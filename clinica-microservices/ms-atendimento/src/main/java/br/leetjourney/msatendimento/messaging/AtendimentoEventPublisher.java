package br.leetjourney.msatendimento.messaging;

import br.leetjourney.msatendimento.config.RabbitConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Slf4j @Component @RequiredArgsConstructor
public class AtendimentoEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publicarUsoMedicacao(UsoMedicacaoEvent event) {
        log.info("Publicando uso.medicacao: medicamentoId={} qtd={}", event.medicamentoId(), event.quantidade());
        rabbitTemplate.convertAndSend(RabbitConfig.EXCHANGE, RabbitConfig.RK_USO_MEDICACAO, event);
    }
}
