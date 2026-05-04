package br.leetjourney.msatendimento.dto;
import java.util.List;
public record ProntuarioResponse(Long id, Long pacienteId, String nomePaciente,
    Long profissionalId, List<AtendimentoResponse> atendimentos) {}
