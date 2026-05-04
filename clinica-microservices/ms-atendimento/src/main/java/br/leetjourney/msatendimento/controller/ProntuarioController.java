package br.leetjourney.msatendimento.controller;

import br.leetjourney.msatendimento.dto.ProntuarioResponse;
import br.leetjourney.msatendimento.service.ProntuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/atendimento/prontuarios") @RequiredArgsConstructor
public class ProntuarioController {
    private final ProntuarioService prontuarioService;

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<ProntuarioResponse> buscarPorPaciente(@PathVariable Long pacienteId) {
        return ResponseEntity.ok(prontuarioService.buscarPorPaciente(pacienteId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProntuarioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(prontuarioService.buscarPorId(id));
    }
}
