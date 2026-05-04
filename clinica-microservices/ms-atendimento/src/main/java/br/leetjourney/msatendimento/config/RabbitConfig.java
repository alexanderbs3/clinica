package br.leetjourney.msatendimento.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE              = "clinica.exchange";
    public static final String QUEUE_PACIENTE_CRIADO = "paciente.criado.queue";
    public static final String QUEUE_USO_MEDICACAO   = "uso.medicacao.queue";
    public static final String RK_PACIENTE_CRIADO    = "paciente.criado";
    public static final String RK_USO_MEDICACAO      = "uso.medicacao";

    @Bean
    public TopicExchange clinicaExchange() {
        return new TopicExchange(EXCHANGE);
    }

    /**
     * FIX #1: Queue estava apenas referenciada por constante no @RabbitListener,
     * mas nunca declarada como Bean neste serviço. Se o ms-atendimento subir antes
     * do ms-cadastro (que era o único que declarava a queue), o listener falhava
     * silenciosamente — nenhum prontuário era criado para os pacientes cadastrados.
     *
     * Declarar o Bean aqui garante que a queue é criada/declarada no RabbitMQ
     * independente da ordem de inicialização dos serviços (idempotente: se já
     * existe, o declare é ignorado).
     */
    @Bean
    public Queue pacienteCriadoQueue() {
        return QueueBuilder.durable(QUEUE_PACIENTE_CRIADO).build();
    }

    @Bean
    public Binding bindPacienteCriado() {
        return BindingBuilder
                .bind(pacienteCriadoQueue())
                .to(clinicaExchange())
                .with(RK_PACIENTE_CRIADO);
    }

    @Bean
    public Queue usoMedicacaoQueue() {
        return QueueBuilder.durable(QUEUE_USO_MEDICACAO).build();
    }

    @Bean
    public Binding bindUsoMedicacao() {
        return BindingBuilder
                .bind(usoMedicacaoQueue())
                .to(clinicaExchange())
                .with(RK_USO_MEDICACAO);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}