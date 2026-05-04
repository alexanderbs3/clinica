package br.leetjourney.msfarmacia.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "requisicao_medicacao")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RequisicaoMedicacao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicamento_id")
    private Medicamento medicamento;

    @Column(nullable = false)
    private Long quantidade;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_requisicao")
    private TipoRequisicao tipoRequisicao;

    @Column(name = "profissional_id")
    private Long profissionalId;

    @Column(nullable = false)
    private String data;

    @Column(columnDefinition = "TEXT")
    private String observacao;
}
