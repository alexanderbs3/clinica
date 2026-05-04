package br.leetjourney.mscadastro.dto;
import jakarta.validation.constraints.NotBlank;
public record UnidadeRequest(@NotBlank String nome, String ies, String responsavel) {}
