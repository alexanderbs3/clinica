package br.leetjourney.mscadastro.controller;

import br.leetjourney.mscadastro.dto.ProfissionalRequest;
import br.leetjourney.mscadastro.dto.ProfissionalResponse;
import br.leetjourney.mscadastro.service.ProfissionalSaudeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/cadastro/profissionais") @RequiredArgsConstructor
public class ProfissionalController {
    private final ProfissionalSaudeService profissionalService;

    @PostMapping
    public ResponseEntity<ProfissionalResponse> criar(
            @Valid @RequestBody ProfissionalRequest request,
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.status(201).body(profissionalService.criar(request, usuarioId));
    }

    @GetMapping("/me")
    public ResponseEntity<ProfissionalResponse> meuPerfil(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestHeader(value = "X-Username", required = false) String username) {
        return ResponseEntity.ok(profissionalService.buscarOuCriarPorUsuario(usuarioId, username));
    }

    @GetMapping
    public ResponseEntity<List<ProfissionalResponse>> listar() {
        return ResponseEntity.ok(profissionalService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfissionalResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(profissionalService.buscarPorId(id));
    }

    @PutMapping("/complemento")
    public ResponseEntity<ProfissionalResponse> complementar(
            @Valid @RequestBody ProfissionalRequest request,
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestHeader(value = "X-Username", required = false) String username) {
        return ResponseEntity.ok(profissionalService.complementar(usuarioId, username, request));
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        profissionalService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
