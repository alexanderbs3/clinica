package br.leetjourney.msfarmacia.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
public record MedicamentoRequest(@NotBlank String nome, String descricao,
    @NotNull Long quantidade, @NotBlank String unidadeMedida, LocalDate validade) {}
