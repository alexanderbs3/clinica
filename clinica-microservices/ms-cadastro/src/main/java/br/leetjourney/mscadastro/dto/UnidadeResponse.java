package br.leetjourney.mscadastro.dto;
import br.leetjourney.mscadastro.model.Status;
public record UnidadeResponse(Long id, String nome, String ies, String responsavel, Status status) {}
