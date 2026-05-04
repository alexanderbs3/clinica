package br.leetjourney.msfarmacia.dto;
import java.time.LocalDate;
public record MedicamentoResponse(Long id, String nome, String descricao,
    Long quantidade, String unidadeMedida, LocalDate validade, Boolean ativo) {}
