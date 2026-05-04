package br.leetjourney.msfarmacia.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "medicamento")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Medicamento {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private Long quantidade;

    @Column(name = "unidade_medida", nullable = false)
    private String unidadeMedida;

    private LocalDate validade;

    @Column(nullable = false)
    private Boolean ativo = true;
}
