package br.leetjourney.mscadastro.dto;
import br.leetjourney.mscadastro.model.CategoriaPaciente;
import br.leetjourney.mscadastro.model.Status;
import br.leetjourney.mscadastro.model.VinculoPaciente;

public record PacienteResponse(
    Long id, String nome, String email, String telefone,
    Status status, CategoriaPaciente categoria,
    VinculoPaciente vinculoTipo, String vinculoNome,
    Long profissionalId, Long escolaId, Long unidadeId
) {}
