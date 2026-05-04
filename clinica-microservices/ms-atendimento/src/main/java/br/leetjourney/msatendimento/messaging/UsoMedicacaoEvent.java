package br.leetjourney.msatendimento.messaging;

public record UsoMedicacaoEvent(Long medicamentoId, Long quantidade, Long atendimentoId, Long pacienteId) {}
