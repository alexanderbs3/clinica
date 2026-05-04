package br.leetjourney.msatendimento.dto;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record AtendimentoRequest(
    @NotNull Long pacienteId,
    String descricao, String observacoes,
    String dataAtendimento, String statusAtendimento,
    List<MedicacaoUsadaRequest> medicacoesUsadas
) {
    public record MedicacaoUsadaRequest(Long medicacaoId, Long quantidade, String dosagem) {}
}
