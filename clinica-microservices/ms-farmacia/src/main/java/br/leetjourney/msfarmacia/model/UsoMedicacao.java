package br.leetjourney.msfarmacia.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "uso_medicacao")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UsoMedicacao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "medicamento_id", nullable = false)
    private Long medicamentoId;

    @Column(name = "atendimento_id", nullable = false)
    private Long atendimentoId;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(nullable = false)
    private Long quantidade;
}
