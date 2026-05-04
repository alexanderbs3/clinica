package br.leetjourney.msatendimento.messaging;

import br.leetjourney.msatendimento.config.RabbitConfig;
import br.leetjourney.msatendimento.model.Prontuario;
import br.leetjourney.msatendimento.repository.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Slf4j @Component @RequiredArgsConstructor
public class PacienteCriadoConsumer {
    private final ProntuarioRepository prontuarioRepository;

    @RabbitListener(queues = RabbitConfig.QUEUE_PACIENTE_CRIADO)
    public void consumir(PacienteCriadoEvent event) {
        log.info("Recebido paciente.criado: pacienteId={}", event.pacienteId());

        // Idempotência: só cria se não existir
        if (prontuarioRepository.findByPacienteId(event.pacienteId()).isPresent()) {
            log.warn("Prontuário já existe para pacienteId={} — ignorando", event.pacienteId());
            return;
        }

        var prontuario = new Prontuario(null, event.pacienteId(), event.nomePaciente(), event.profissionalId());
        prontuarioRepository.save(prontuario);
        log.info("Prontuário criado para pacienteId={}", event.pacienteId());
    }
}
