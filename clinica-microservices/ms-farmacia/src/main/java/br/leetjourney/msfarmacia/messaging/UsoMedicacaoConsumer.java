package br.leetjourney.msfarmacia.messaging;

import br.leetjourney.msfarmacia.config.RabbitConfig;
import br.leetjourney.msfarmacia.model.Medicamento;
import br.leetjourney.msfarmacia.model.UsoMedicacao;
import br.leetjourney.msfarmacia.repository.MedicamentoRepository;
import br.leetjourney.msfarmacia.repository.UsoMedicacaoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j @Component @RequiredArgsConstructor
public class UsoMedicacaoConsumer {
    private final MedicamentoRepository medicamentoRepository;
    private final UsoMedicacaoRepository usoMedicacaoRepository;

    @RabbitListener(queues = RabbitConfig.QUEUE_USO_MEDICACAO)
    @Transactional
    public void consumir(UsoMedicacaoEvent event) {
        log.info("Recebido uso.medicacao: medicamentoId={} qtd={}", event.medicamentoId(), event.quantidade());

        Medicamento med = medicamentoRepository.findById(event.medicamentoId())
                .orElseThrow(() -> new RuntimeException("Medicamento não encontrado: " + event.medicamentoId()));

        if (med.getQuantidade() < event.quantidade())
            throw new RuntimeException("Estoque insuficiente para medicamento: " + med.getNome());

        med.setQuantidade(med.getQuantidade() - event.quantidade());
        medicamentoRepository.save(med);

        usoMedicacaoRepository.save(new UsoMedicacao(null, event.medicamentoId(),
                event.atendimentoId(), event.pacienteId(), event.quantidade()));

        log.info("Estoque atualizado. Medicamento={} novo estoque={}", med.getNome(), med.getQuantidade());
    }
}
