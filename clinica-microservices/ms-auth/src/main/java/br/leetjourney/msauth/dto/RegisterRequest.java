package br.leetjourney.msauth.dto;
import br.leetjourney.msauth.model.RoleUsuario;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
public record RegisterRequest(@NotBlank String username, @NotBlank String password, @NotNull RoleUsuario role) {}
