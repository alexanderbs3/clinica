package br.leetjourney.mscadastro.controller;

import br.leetjourney.mscadastro.dto.PacienteRequest;
import br.leetjourney.mscadastro.dto.PacienteResponse;
import br.leetjourney.mscadastro.service.PacienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/cadastro/pacientes") @RequiredArgsConstructor
public class PacienteController {
    private final PacienteService pacienteService;

    // O gateway propaga X-User-Id como header após validar o JWT
    @PostMapping
    public ResponseEntity<PacienteResponse> criar(
            @Valid @RequestBody PacienteRequest request,
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.status(201).body(pacienteService.criar(request, usuarioId));
    }

    @GetMapping
    public ResponseEntity<List<PacienteResponse>> listar(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        return ResponseEntity.ok(pacienteService.listar(usuarioId, role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PacienteRequest request,
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        return ResponseEntity.ok(pacienteService.atualizar(id, request, usuarioId, role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long usuarioId) {
        pacienteService.inativar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }
}
