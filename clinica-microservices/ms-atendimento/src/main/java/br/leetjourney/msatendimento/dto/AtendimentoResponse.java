package br.leetjourney.msatendimento.dto;
public record AtendimentoResponse(Long id, Long pacienteId, Long profissionalId, Long prontuarioId,
    String descricao, String observacoes, String dataAtendimento, String statusAtendimento) {}
