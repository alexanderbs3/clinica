package br.leetjourney.msfarmacia.controller;

import br.leetjourney.msfarmacia.dto.RequisicaoRequest;
import br.leetjourney.msfarmacia.dto.RequisicaoResponse;
import br.leetjourney.msfarmacia.service.RequisicaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/farmacia/requisicoes") @RequiredArgsConstructor
public class RequisicaoController {
    private final RequisicaoService requisicaoService;

    @PostMapping
    public ResponseEntity<RequisicaoResponse> criar(
            @Valid @RequestBody RequisicaoRequest request,
            @RequestHeader("X-User-Id") Long usuarioId) {
        return ResponseEntity.status(201).body(requisicaoService.criar(request, usuarioId));
    }

    @GetMapping
    public ResponseEntity<List<RequisicaoResponse>> listar(
            @RequestHeader("X-User-Id") Long usuarioId,
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        return ResponseEntity.ok(requisicaoService.listar(usuarioId, role));
    }
}
