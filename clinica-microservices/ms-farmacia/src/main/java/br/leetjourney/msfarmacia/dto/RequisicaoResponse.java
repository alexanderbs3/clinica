package br.leetjourney.msfarmacia.dto;
import br.leetjourney.msfarmacia.model.TipoRequisicao;
public record RequisicaoResponse(Long id, Long medicamentoId, String nomeMedicamento,
    Long quantidade, TipoRequisicao tipoRequisicao, Long profissionalId, String data, String observacao) {}
