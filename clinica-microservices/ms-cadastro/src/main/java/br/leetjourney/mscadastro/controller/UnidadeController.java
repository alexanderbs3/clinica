package br.leetjourney.mscadastro.controller;

import br.leetjourney.mscadastro.dto.UnidadeRequest;
import br.leetjourney.mscadastro.dto.UnidadeResponse;
import br.leetjourney.mscadastro.service.UnidadeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/cadastro/unidades") @RequiredArgsConstructor
public class UnidadeController {
    private final UnidadeService unidadeService;

    @PostMapping
    public ResponseEntity<UnidadeResponse> criar(@Valid @RequestBody UnidadeRequest request) {
        return ResponseEntity.status(201).body(unidadeService.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<UnidadeResponse>> listar() {
        return ResponseEntity.ok(unidadeService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadeResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(unidadeService.buscar(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UnidadeResponse> atualizar(@PathVariable Long id, @Valid @RequestBody UnidadeRequest request) {
        return ResponseEntity.ok(unidadeService.atualizar(id, request));
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        unidadeService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
