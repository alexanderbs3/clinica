package br.leetjourney.mscadastro.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {
    public static final String EXCHANGE      = "clinica.exchange";
    public static final String QUEUE_PACIENTE_CRIADO    = "paciente.criado.queue";
    public static final String QUEUE_PROFISSIONAL_CRIADO = "profissional.criado.queue";
    public static final String RK_PACIENTE_CRIADO       = "paciente.criado";
    public static final String RK_PROFISSIONAL_CRIADO   = "profissional.criado";

    @Bean public TopicExchange clinicaExchange() { return new TopicExchange(EXCHANGE); }

    @Bean public Queue pacienteCriadoQueue() { return QueueBuilder.durable(QUEUE_PACIENTE_CRIADO).build(); }
    @Bean public Queue profissionalCriadoQueue() { return QueueBuilder.durable(QUEUE_PROFISSIONAL_CRIADO).build(); }

    @Bean public Binding bindPaciente() {
        return BindingBuilder.bind(pacienteCriadoQueue()).to(clinicaExchange()).with(RK_PACIENTE_CRIADO);
    }
    @Bean public Binding bindProfissional() {
        return BindingBuilder.bind(profissionalCriadoQueue()).to(clinicaExchange()).with(RK_PROFISSIONAL_CRIADO);
    }

    @Bean public Jackson2JsonMessageConverter messageConverter() { return new Jackson2JsonMessageConverter(); }
}
