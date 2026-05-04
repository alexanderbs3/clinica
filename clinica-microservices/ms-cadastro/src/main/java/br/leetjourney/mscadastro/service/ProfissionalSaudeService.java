package br.leetjourney.mscadastro.service;

import br.leetjourney.mscadastro.dto.ProfissionalRequest;
import br.leetjourney.mscadastro.dto.ProfissionalResponse;
import br.leetjourney.mscadastro.exception.ResourceNotFoundException;
import br.leetjourney.mscadastro.messaging.CadastroEventPublisher;
import br.leetjourney.mscadastro.messaging.ProfissionalCriadoEvent;
import br.leetjourney.mscadastro.model.ProfissionalSaude;
import br.leetjourney.mscadastro.model.Status;
import br.leetjourney.mscadastro.repository.ProfissionalSaudeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class ProfissionalSaudeService {
    private final ProfissionalSaudeRepository profissionalRepository;
    private final CadastroEventPublisher eventPublisher;

    @Transactional
    public ProfissionalResponse criar(ProfissionalRequest request, Long usuarioId) {
        if (profissionalRepository.findByUsuarioId(usuarioId).isPresent())
            throw new RuntimeException("Profissional já cadastrado para este usuário");

        var p = new ProfissionalSaude();
        p.setNome(request.nome());
        p.setFormacao(request.formacao());
        p.setEspecialidade(request.especialidade());
        p.setConselho(request.conselho());
        p.setNumeroRegistro(request.numeroRegistro());
        p.setDiasAtendimento(request.diasAtendimento());
        p.setTurnosAtendimento(request.turnosAtendimento());
        p.setUsuarioId(usuarioId);
        p.setStatus(Status.ATIVO);

        var salvo = profissionalRepository.save(p);
        eventPublisher.publicarProfissionalCriado(new ProfissionalCriadoEvent(salvo.getId(), salvo.getNome(), usuarioId));
        return toResponse(salvo);
    }

    @Transactional(readOnly = true)
    public ProfissionalResponse buscarPorUsuario(Long usuarioId) {
        return toResponse(profissionalRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Perfil profissional não encontrado")));
    }

    @Transactional
    public ProfissionalResponse buscarOuCriarPorUsuario(Long usuarioId, String username) {
        return profissionalRepository.findByUsuarioId(usuarioId)
                .map(this::toResponse)
                .orElseGet(() -> criarPerfilBasico(usuarioId, username));
    }

    @Transactional(readOnly = true)
    public List<ProfissionalResponse> listarTodos() {
        return profissionalRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProfissionalResponse buscarPorId(Long id) {
        return toResponse(profissionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado: " + id)));
    }

    @Transactional
    public ProfissionalResponse complementar(Long usuarioId, String username, ProfissionalRequest request) {
        var p = profissionalRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> novoPerfilBasico(usuarioId, request.nome() != null ? request.nome() : username));
        p.setFormacao(request.formacao());
        p.setEspecialidade(request.especialidade());
        p.setConselho(request.conselho());
        p.setNumeroRegistro(request.numeroRegistro());
        p.setDiasAtendimento(request.diasAtendimento());
        p.setTurnosAtendimento(request.turnosAtendimento());
        p.setCadastroCompleto(true);
        return toResponse(profissionalRepository.save(p));
    }

    private ProfissionalResponse criarPerfilBasico(Long usuarioId, String username) {
        return toResponse(profissionalRepository.save(novoPerfilBasico(usuarioId, username)));
    }

    private ProfissionalSaude novoPerfilBasico(Long usuarioId, String username) {
        var p = new ProfissionalSaude();
        p.setNome(username != null && !username.isBlank() ? username : "Profissional");
        p.setUsuarioId(usuarioId);
        p.setStatus(Status.ATIVO);
        p.setCadastroCompleto(false);
        return p;
    }

    @Transactional
    public void inativar(Long id) {
        var p = profissionalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional não encontrado: " + id));
        p.setStatus(Status.INATIVO);
        profissionalRepository.save(p);
    }

    private ProfissionalResponse toResponse(ProfissionalSaude p) {
        return new ProfissionalResponse(p.getId(), p.getNome(), p.getFormacao(), p.getEspecialidade(),
                p.getConselho(), p.getNumeroRegistro(), p.getDiasAtendimento(), p.getTurnosAtendimento(),
                p.getDataCadastro(), p.getStatus(), p.getUsuarioId(), p.isCadastroCompleto());
    }
}
