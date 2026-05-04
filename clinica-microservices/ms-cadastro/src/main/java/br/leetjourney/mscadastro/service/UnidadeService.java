package br.leetjourney.mscadastro.service;

import br.leetjourney.mscadastro.dto.UnidadeRequest;
import br.leetjourney.mscadastro.dto.UnidadeResponse;
import br.leetjourney.mscadastro.exception.ResourceNotFoundException;
import br.leetjourney.mscadastro.model.Status;
import br.leetjourney.mscadastro.model.Unidade;
import br.leetjourney.mscadastro.repository.UnidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class UnidadeService {
    private final UnidadeRepository unidadeRepository;

    @Transactional
    public UnidadeResponse criar(UnidadeRequest request) {
        var u = new Unidade(null, request.nome(), request.ies(), request.responsavel(), Status.ATIVO);
        return toResponse(unidadeRepository.save(u));
    }

    @Transactional(readOnly = true)
    public List<UnidadeResponse> listar() {
        return unidadeRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UnidadeResponse buscar(Long id) {
        return toResponse(unidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada: " + id)));
    }

    @Transactional
    public UnidadeResponse atualizar(Long id, UnidadeRequest request) {
        var u = unidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada: " + id));
        u.setNome(request.nome());
        u.setIes(request.ies());
        u.setResponsavel(request.responsavel());
        return toResponse(unidadeRepository.save(u));
    }

    @Transactional
    public void inativar(Long id) {
        var u = unidadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Unidade não encontrada: " + id));
        u.setStatus(Status.INATIVO);
        unidadeRepository.save(u);
    }

    private UnidadeResponse toResponse(Unidade u) {
        return new UnidadeResponse(u.getId(), u.getNome(), u.getIes(), u.getResponsavel(), u.getStatus());
    }
}
