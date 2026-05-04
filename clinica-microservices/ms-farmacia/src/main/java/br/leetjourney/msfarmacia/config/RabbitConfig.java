package br.leetjourney.msfarmacia.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE            = "clinica.exchange";
    public static final String QUEUE_USO_MEDICACAO = "uso.medicacao.queue";

    @Bean public TopicExchange clinicaExchange() { return new TopicExchange(EXCHANGE); }
    @Bean public Queue usoMedicacaoQueue() { return QueueBuilder.durable(QUEUE_USO_MEDICACAO).build(); }
    @Bean public Binding bindUsoMedicacao() {
        return BindingBuilder.bind(usoMedicacaoQueue()).to(clinicaExchange()).with("uso.medicacao");
    }
    @Bean public Jackson2JsonMessageConverter messageConverter() { return new Jackson2JsonMessageConverter(); }
}
