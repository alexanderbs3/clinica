package br.leetjourney.mscadastro.controller;

import br.leetjourney.mscadastro.dto.EscolaRequest;
import br.leetjourney.mscadastro.dto.EscolaResponse;
import br.leetjourney.mscadastro.service.EscolaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/cadastro/escolas") @RequiredArgsConstructor
public class EscolaController {
    private final EscolaService escolaService;

    @PostMapping
    public ResponseEntity<EscolaResponse> criar(@Valid @RequestBody EscolaRequest request) {
        return ResponseEntity.status(201).body(escolaService.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<EscolaResponse>> listar() {
        return ResponseEntity.ok(escolaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EscolaResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(escolaService.buscar(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EscolaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody EscolaRequest request) {
        return ResponseEntity.ok(escolaService.atualizar(id, request));
    }

    @PatchMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        escolaService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
