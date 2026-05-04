package br.leetjourney.msfarmacia.dto;
import br.leetjourney.msfarmacia.model.TipoRequisicao;
import jakarta.validation.constraints.NotNull;
public record RequisicaoRequest(@NotNull Long medicamentoId, @NotNull Long quantidade,
    @NotNull TipoRequisicao tipoRequisicao, String data, String observacao) {}
