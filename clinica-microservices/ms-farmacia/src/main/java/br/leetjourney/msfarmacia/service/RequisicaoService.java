package br.leetjourney.msfarmacia.service;

import br.leetjourney.msfarmacia.dto.RequisicaoRequest;
import br.leetjourney.msfarmacia.dto.RequisicaoResponse;
import br.leetjourney.msfarmacia.exception.ResourceNotFoundException;
import br.leetjourney.msfarmacia.model.RequisicaoMedicacao;
import br.leetjourney.msfarmacia.model.TipoRequisicao;
import br.leetjourney.msfarmacia.repository.MedicamentoRepository;
import br.leetjourney.msfarmacia.repository.RequisicaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service @RequiredArgsConstructor
public class RequisicaoService {
    private final RequisicaoRepository requisicaoRepository;
    private final MedicamentoRepository medicamentoRepository;

    @Transactional
    public RequisicaoResponse criar(RequisicaoRequest request, Long profissionalId) {
        var med = medicamentoRepository.findById(request.medicamentoId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicamento não encontrado: " + request.medicamentoId()));

        // Atualiza estoque conforme tipo
        if (request.tipoRequisicao() == TipoRequisicao.SAIDA) {
            if (med.getQuantidade() < request.quantidade())
                throw new RuntimeException("Estoque insuficiente: " + med.getNome());
            med.setQuantidade(med.getQuantidade() - request.quantidade());
        } else {
            med.setQuantidade(med.getQuantidade() + request.quantidade());
        }
        medicamentoRepository.save(med);

        var req = new RequisicaoMedicacao(null, med, request.quantidade(),
                request.tipoRequisicao(), profissionalId,
                request.data() != null ? request.data() : LocalDate.now().toString(),
                request.observacao());

        return toResponse(requisicaoRepository.save(req));
    }

    @Transactional(readOnly = true)
    public List<RequisicaoResponse> listar(Long profissionalId, String role) {
        if ("ADMIN".equals(role)) {
            return requisicaoRepository.findAll().stream().map(this::toResponse).toList();
        }

        return requisicaoRepository.findAllByProfissionalId(profissionalId)
                .stream().map(this::toResponse).toList();
    }

    private RequisicaoResponse toResponse(RequisicaoMedicacao r) {
        return new RequisicaoResponse(r.getId(), r.getMedicamento().getId(), r.getMedicamento().getNome(),
                r.getQuantidade(), r.getTipoRequisicao(), r.getProfissionalId(), r.getData(), r.getObservacao());
    }
}
