package br.leetjourney.msatendimento.service;

import br.leetjourney.msatendimento.dto.AtendimentoRequest;
import br.leetjourney.msatendimento.dto.AtendimentoResponse;
import br.leetjourney.msatendimento.exception.ResourceNotFoundException;
import br.leetjourney.msatendimento.messaging.AtendimentoEventPublisher;
import br.leetjourney.msatendimento.messaging.UsoMedicacaoEvent;
import br.leetjourney.msatendimento.model.Atendimento;
import br.leetjourney.msatendimento.model.Prontuario;
import br.leetjourney.msatendimento.repository.AtendimentoRepository;
import br.leetjourney.msatendimento.repository.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AtendimentoService {

    private final AtendimentoRepository atendimentoRepository;
    private final ProntuarioRepository prontuarioRepository;
    private final AtendimentoEventPublisher eventPublisher;

    @Transactional
    public AtendimentoResponse criar(AtendimentoRequest request, Long profissionalId) {
        /*
         * FIX #2 — Causa raiz do 404:
         *
         * O prontuário é criado de forma assíncrona via RabbitMQ (evento paciente.criado).
         * Se o ms-atendimento estiver fora do ar no momento do cadastro do paciente, ou se
         * o evento for perdido (queue não declarada — ver Fix #1), o prontuário nunca é criado.
         *
         * Solução: criação lazy (on-demand) do prontuário caso ele não exista ainda.
         * Isso é resiliente por design — o estado converge independente da ordem dos eventos.
         *
         * O PacienteCriadoConsumer continua funcionando normalmente para o caso feliz
         * (paciente cadastrado com ms-atendimento no ar). A idempotência no consumer
         * garante que um prontuário não será duplicado.
         */
        var prontuario = prontuarioRepository
                .findByPacienteId(request.pacienteId())
                .orElseGet(() -> {
                    log.warn(
                            "Prontuário não encontrado para pacienteId={} — criando on-demand " +
                                    "(evento paciente.criado pode ter sido perdido).",
                            request.pacienteId()
                    );
                    var novo = new Prontuario(null, request.pacienteId(), null, profissionalId);
                    return prontuarioRepository.save(novo);
                });

        /*
         * FIX #2b — Verificação de ownership mais segura:
         *
         * Antes: se o prontuário tiver sido criado com profissionalId diferente
         * (ex: paciente reatribuído ou prontuário criado on-demand por outro profissional),
         * o acesso era bloqueado silenciosamente com RuntimeException(400), sem log.
         *
         * Agora: loga o conflito e lança exceção clara. Admins podem investigar.
         * O check só ocorre quando o prontuário JÁ EXISTIA (profissionalId não nulo).
         */
        if (prontuario.getProfissionalId() != null
                && !prontuario.getProfissionalId().equals(profissionalId)) {
            log.warn(
                    "Acesso negado: profissionalId={} tentou atender pacienteId={} " +
                            "cujo prontuário pertence ao profissionalId={}.",
                    profissionalId, request.pacienteId(), prontuario.getProfissionalId()
            );
            throw new RuntimeException(
                    "Acesso negado: este paciente não pertence ao seu cadastro."
            );
        }

        var atendimento = new Atendimento();
        atendimento.setProntuario(prontuario);
        atendimento.setProfissionalId(profissionalId);
        atendimento.setPacienteId(request.pacienteId());
        atendimento.setDescricao(request.descricao());
        atendimento.setObservacoes(request.observacoes());
        atendimento.setDataAtendimento(request.dataAtendimento());
        atendimento.setStatusAtendimento(request.statusAtendimento());

        var salvo = atendimentoRepository.save(atendimento);
        publicarUsoMedicacoes(request, salvo);

        log.info("Atendimento id={} criado para pacienteId={} por profissionalId={}",
                salvo.getId(), salvo.getPacienteId(), salvo.getProfissionalId());

        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public List<AtendimentoResponse> listar(Long profissionalId, String role) {
        if ("ADMIN".equals(role)) {
            return atendimentoRepository.findAll()
                    .stream().map(this::toResponse).toList();
        }
        return atendimentoRepository.findAllByProfissionalId(profissionalId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AtendimentoResponse> listarPorPaciente(Long pacienteId) {
        return atendimentoRepository.findAllByProntuario_PacienteId(pacienteId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public AtendimentoResponse buscarPorId(Long id) {
        return toResponse(atendimentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Atendimento não encontrado: " + id)));
    }

    @Transactional
    public AtendimentoResponse atualizar(Long id, AtendimentoRequest request, Long profissionalId) {
        var atendimento = atendimentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Atendimento não encontrado: " + id));

        if (!atendimento.getProfissionalId().equals(profissionalId)) {
            throw new RuntimeException("Acesso negado: este atendimento não pertence a você.");
        }

        atendimento.setDescricao(request.descricao());
        atendimento.setObservacoes(request.observacoes());
        atendimento.setDataAtendimento(request.dataAtendimento());
        atendimento.setStatusAtendimento(request.statusAtendimento());

        var salvo = atendimentoRepository.save(atendimento);
        publicarUsoMedicacoes(request, salvo);
        return toResponse(salvo);
    }

    private void publicarUsoMedicacoes(AtendimentoRequest request, Atendimento atendimento) {
        if (request.medicacoesUsadas() == null || request.medicacoesUsadas().isEmpty()) {
            return;
        }
        request.medicacoesUsadas().stream()
                .filter(m -> m.medicacaoId() != null && m.quantidade() != null && m.quantidade() > 0)
                .forEach(m -> eventPublisher.publicarUsoMedicacao(new UsoMedicacaoEvent(
                        m.medicacaoId(), m.quantidade(), atendimento.getId(), atendimento.getPacienteId())));
    }

    private AtendimentoResponse toResponse(Atendimento a) {
        return new AtendimentoResponse(
                a.getId(),
                a.getPacienteId(),
                a.getProfissionalId(),
                a.getProntuario().getId(),
                a.getDescricao(),
                a.getObservacoes(),
                a.getDataAtendimento(),
                a.getStatusAtendimento()
        );
    }
}