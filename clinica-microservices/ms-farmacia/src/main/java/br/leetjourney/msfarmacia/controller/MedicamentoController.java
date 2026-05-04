package br.leetjourney.msfarmacia.controller;

import br.leetjourney.msfarmacia.dto.MedicamentoRequest;
import br.leetjourney.msfarmacia.dto.MedicamentoResponse;
import br.leetjourney.msfarmacia.service.MedicamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/farmacia/medicamentos") @RequiredArgsConstructor
public class MedicamentoController {
    private final MedicamentoService medicamentoService;

    @PostMapping
    public ResponseEntity<MedicamentoResponse> criar(@Valid @RequestBody MedicamentoRequest request) {
        return ResponseEntity.status(201).body(medicamentoService.criar(request));
    }

    @GetMapping
    public ResponseEntity<List<MedicamentoResponse>> listar() {
        return ResponseEntity.ok(medicamentoService.listarAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicamentoResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(medicamentoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicamentoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody MedicamentoRequest request) {
        return ResponseEntity.ok(medicamentoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        medicamentoService.inativar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<MedicamentoResponse> ativar(@PathVariable Long id) {
        return ResponseEntity.ok(medicamentoService.ativar(id));
    }
}
