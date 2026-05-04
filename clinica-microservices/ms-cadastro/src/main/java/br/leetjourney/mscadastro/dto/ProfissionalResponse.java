package br.leetjourney.mscadastro.dto;
import br.leetjourney.mscadastro.model.Status;
import java.time.LocalDate;
public record ProfissionalResponse(Long id, String nome, String formacao, String especialidade,
    String conselho, String numeroRegistro, String diasAtendimento, String turnosAtendimento,
    LocalDate dataCadastro, Status status, Long usuarioId, boolean cadastroCompleto) {}
