package br.leetjourney.mscadastro.service;

import br.leetjourney.mscadastro.dto.PacienteRequest;
import br.leetjourney.mscadastro.dto.PacienteResponse;
import br.leetjourney.mscadastro.exception.ResourceNotFoundException;
import br.leetjourney.mscadastro.messaging.CadastroEventPublisher;
import br.leetjourney.mscadastro.messaging.PacienteCriadoEvent;
import br.leetjourney.mscadastro.model.Paciente;
import br.leetjourney.mscadastro.model.Status;
import br.leetjourney.mscadastro.repository.PacienteRepository;
import br.leetjourney.mscadastro.repository.ProfissionalSaudeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class PacienteService {
    private final PacienteRepository pacienteRepository;
    private final ProfissionalSaudeRepository profissionalRepository;
    private final CadastroEventPublisher eventPublisher;

    @Transactional
    public PacienteResponse criar(PacienteRequest request, Long usuarioId) {
        var profissional = profissionalRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado para o usuário: " + usuarioId));

        var paciente = new Paciente();
        paciente.setNome(request.nome());
        paciente.setEmail(request.email());
        paciente.setTelefone(request.telefone());
        paciente.setCategoria(request.categoria());
        paciente.setVinculoTipo(request.vinculoTipo());
        paciente.setVinculoNome(request.vinculoNome());
        paciente.setEscolaId(request.escolaId());
        paciente.setUnidadeId(request.unidadeId());
        paciente.setProfissionalId(profissional.getId());
        paciente.setStatus(Status.ATIVO);

        var salvo = pacienteRepository.save(paciente);

        // Publica evento → ms-atendimento criará o prontuário
        eventPublisher.publicarPacienteCriado(new PacienteCriadoEvent(
                salvo.getId(), salvo.getNome(), usuarioId));

        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public List<PacienteResponse> listar(Long usuarioId, String role) {
        if ("ADMIN".equals(role)) {
            return pacienteRepository.findAll().stream().map(this::toResponse).toList();
        }

        var profissional = profissionalRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado"));
        return pacienteRepository.findAllByProfissionalId(profissional.getId())
                .stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PacienteResponse buscarPorId(Long id) {
        return toResponse(pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado: " + id)));
    }

    @Transactional
    public PacienteResponse atualizar(Long id, PacienteRequest request, Long usuarioId, String role) {
        var paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado: " + id));

        if (!"ADMIN".equals(role)) {
            var profissional = profissionalRepository.findByUsuarioId(usuarioId)
                    .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado"));
            if (!paciente.getProfissionalId().equals(profissional.getId()))
                throw new RuntimeException("Acesso negado: paciente não pertence ao profissional");
        }

        paciente.setNome(request.nome());
        paciente.setEmail(request.email());
        paciente.setTelefone(request.telefone());
        paciente.setCategoria(request.categoria());
        paciente.setVinculoTipo(request.vinculoTipo());
        paciente.setVinculoNome(request.vinculoNome());
        paciente.setEscolaId(request.escolaId());
        paciente.setUnidadeId(request.unidadeId());
        return toResponse(pacienteRepository.save(paciente));
    }

    @Transactional
    public void inativar(Long id, Long usuarioId) {
        var profissional = profissionalRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado"));
        var paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado: " + id));
        if (!paciente.getProfissionalId().equals(profissional.getId()))
            throw new RuntimeException("Acesso negado: paciente não pertence ao profissional");
        paciente.setStatus(Status.INATIVO);
        pacienteRepository.save(paciente);
    }

    private PacienteResponse toResponse(Paciente p) {
        return new PacienteResponse(p.getId(), p.getNome(), p.getEmail(), p.getTelefone(),
                p.getStatus(), p.getCategoria(), p.getVinculoTipo(), p.getVinculoNome(),
                p.getProfissionalId(), p.getEscolaId(), p.getUnidadeId());
    }
}
