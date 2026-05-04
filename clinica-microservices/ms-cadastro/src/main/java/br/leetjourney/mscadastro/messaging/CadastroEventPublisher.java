package br.leetjourney.mscadastro.messaging;

import br.leetjourney.mscadastro.config.RabbitConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j @Component @RequiredArgsConstructor
public class CadastroEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publicarPacienteCriado(PacienteCriadoEvent event) {
        log.info("Publicando evento paciente.criado: pacienteId={}", event.pacienteId());
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.RK_PACIENTE_CRIADO, event);
    }

    public void publicarProfissionalCriado(ProfissionalCriadoEvent event) {
        log.info("Publicando evento profissional.criado: profissionalId={}", event.profissionalId());
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.RK_PROFISSIONAL_CRIADO, event);
    }
}
