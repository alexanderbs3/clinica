package br.leetjourney.msatendimento.messaging;
public record PacienteCriadoEvent(Long pacienteId, String nomePaciente, Long profissionalId) {}
