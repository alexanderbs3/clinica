package br.leetjourney.mscadastro.dto;
import br.leetjourney.mscadastro.model.Status;
public record EscolaResponse(Long id, String nome, String ies, String coordenador, Status status) {}
