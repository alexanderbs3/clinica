package br.leetjourney.mscadastro.service;

import br.leetjourney.mscadastro.dto.EscolaRequest;
import br.leetjourney.mscadastro.dto.EscolaResponse;
import br.leetjourney.mscadastro.exception.ResourceNotFoundException;
import br.leetjourney.mscadastro.model.Escola;
import br.leetjourney.mscadastro.model.Status;
import br.leetjourney.mscadastro.repository.EscolaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class EscolaService {
    private final EscolaRepository escolaRepository;

    @Transactional
    public EscolaResponse criar(EscolaRequest request) {
        var e = new Escola(null, request.nome(), request.ies(), request.coordenador(), Status.ATIVO);
        return toResponse(escolaRepository.save(e));
    }

    @Transactional(readOnly = true)
    public List<EscolaResponse> listar() {
        return escolaRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public EscolaResponse buscar(Long id) {
        return toResponse(escolaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Escola não encontrada: " + id)));
    }

    @Transactional
    public EscolaResponse atualizar(Long id, EscolaRequest request) {
        var e = escolaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Escola não encontrada: " + id));
        e.setNome(request.nome());
        e.setIes(request.ies());
        e.setCoordenador(request.coordenador());
        return toResponse(escolaRepository.save(e));
    }

    @Transactional
    public void inativar(Long id) {
        var e = escolaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Escola não encontrada: " + id));
        e.setStatus(Status.INATIVO);
        escolaRepository.save(e);
    }

    private EscolaResponse toResponse(Escola e) {
        return new EscolaResponse(e.getId(), e.getNome(), e.getIes(), e.getCoordenador(), e.getStatus());
    }
}
