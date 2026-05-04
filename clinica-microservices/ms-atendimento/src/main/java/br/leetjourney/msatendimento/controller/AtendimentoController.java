package br.leetjourney.msatendimento.controller;

import br.leetjourney.msatendimento.dto.AtendimentoRequest;
import br.leetjourney.msatendimento.dto.AtendimentoResponse;
import br.leetjourney.msatendimento.service.AtendimentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/atendimento/atendimentos") @RequiredArgsConstructor
public class AtendimentoController {
    private final AtendimentoService atendimentoService;

    @PostMapping
    public ResponseEntity<AtendimentoResponse> criar(
            @Valid @RequestBody AtendimentoRequest request,
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.status(201).body(atendimentoService.criar(request, usuarioId));
    }

    @GetMapping
    public ResponseEntity<List<AtendimentoResponse>> listar(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        return ResponseEntity.ok(atendimentoService.listar(usuarioId, role));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AtendimentoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(atendimentoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AtendimentoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AtendimentoRequest request,
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.ok(atendimentoService.atualizar(id, request, usuarioId));
    }
}
