package br.leetjourney.msatendimento.service;

import br.leetjourney.msatendimento.dto.AtendimentoResponse;
import br.leetjourney.msatendimento.dto.ProntuarioResponse;
import br.leetjourney.msatendimento.exception.ResourceNotFoundException;
import br.leetjourney.msatendimento.model.Prontuario;
import br.leetjourney.msatendimento.repository.AtendimentoRepository;
import br.leetjourney.msatendimento.repository.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class ProntuarioService {
    private final ProntuarioRepository prontuarioRepository;
    private final AtendimentoRepository atendimentoRepository;

    @Transactional(readOnly = true)
    public ProntuarioResponse buscarPorPaciente(Long pacienteId) {
        var p = prontuarioRepository.findByPacienteId(pacienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Prontuário não encontrado para pacienteId: " + pacienteId));
        return toResponse(p);
    }

    @Transactional(readOnly = true)
    public ProntuarioResponse buscarPorId(Long id) {
        var p = prontuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prontuário não encontrado: " + id));
        return toResponse(p);
    }

    private ProntuarioResponse toResponse(Prontuario p) {
        var atendimentos = atendimentoRepository.findAllByProntuario_PacienteId(p.getPacienteId())
                .stream().map(a -> new AtendimentoResponse(a.getId(), a.getPacienteId(), a.getProfissionalId(),
                        p.getId(), a.getDescricao(), a.getObservacoes(), a.getDataAtendimento(), a.getStatusAtendimento()))
                .toList();
        return new ProntuarioResponse(p.getId(), p.getPacienteId(), p.getNomePaciente(), p.getProfissionalId(), atendimentos);
    }
}
