package br.leetjourney.msatendimento.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "atendimento")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Atendimento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prontuario_id", nullable = false)
    private Prontuario prontuario;

    @Column(name = "profissional_id", nullable = false)
    private Long profissionalId;

    @Column(name = "paciente_id", nullable = false)
    private Long pacienteId;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "data_atendimento")
    private String dataAtendimento;

    @Column(name = "status_atendimento")
    private String statusAtendimento;
}
