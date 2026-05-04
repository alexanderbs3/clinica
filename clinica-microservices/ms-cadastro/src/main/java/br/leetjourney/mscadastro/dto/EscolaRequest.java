package br.leetjourney.mscadastro.dto;
import jakarta.validation.constraints.NotBlank;
public record EscolaRequest(@NotBlank String nome, String ies, String coordenador) {}
