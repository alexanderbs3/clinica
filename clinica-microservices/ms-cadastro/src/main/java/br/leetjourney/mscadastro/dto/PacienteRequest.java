package br.leetjourney.mscadastro.dto;
import br.leetjourney.mscadastro.model.CategoriaPaciente;
import br.leetjourney.mscadastro.model.VinculoPaciente;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PacienteRequest(
    @NotBlank String nome,
    String email,
    String telefone,
    @NotNull CategoriaPaciente categoria,
    @NotNull VinculoPaciente vinculoTipo,
    String vinculoNome,
    Long escolaId,
    Long unidadeId
) {}
