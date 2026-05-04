package br.leetjourney.msfarmacia.service;

import br.leetjourney.msfarmacia.dto.MedicamentoRequest;
import br.leetjourney.msfarmacia.dto.MedicamentoResponse;
import br.leetjourney.msfarmacia.exception.ResourceNotFoundException;
import br.leetjourney.msfarmacia.model.Medicamento;
import br.leetjourney.msfarmacia.repository.MedicamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class MedicamentoService {
    private final MedicamentoRepository medicamentoRepository;

    @Transactional
    public MedicamentoResponse criar(MedicamentoRequest request) {
        var m = new Medicamento(null, request.nome(), request.descricao(),
                request.quantidade(), request.unidadeMedida(), request.validade(), true);
        return toResponse(medicamentoRepository.save(m));
    }

    @Transactional(readOnly = true)
    public List<MedicamentoResponse> listarAtivos() {
        return medicamentoRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public MedicamentoResponse buscarPorId(Long id) {
        return toResponse(medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento não encontrado: " + id)));
    }

    @Transactional
    public MedicamentoResponse atualizar(Long id, MedicamentoRequest request) {
        var m = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento não encontrado: " + id));
        m.setNome(request.nome());
        m.setDescricao(request.descricao());
        m.setQuantidade(request.quantidade());
        m.setUnidadeMedida(request.unidadeMedida());
        m.setValidade(request.validade());
        return toResponse(medicamentoRepository.save(m));
    }

    @Transactional
    public void inativar(Long id) {
        var m = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento não encontrado: " + id));
        m.setAtivo(false);
        medicamentoRepository.save(m);
    }

    @Transactional
    public MedicamentoResponse ativar(Long id) {
        var m = medicamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento não encontrado: " + id));
        m.setAtivo(true);
        return toResponse(medicamentoRepository.save(m));
    }

    private MedicamentoResponse toResponse(Medicamento m) {
        return new MedicamentoResponse(m.getId(), m.getNome(), m.getDescricao(),
                m.getQuantidade(), m.getUnidadeMedida(), m.getValidade(), m.getAtivo());
    }
}
