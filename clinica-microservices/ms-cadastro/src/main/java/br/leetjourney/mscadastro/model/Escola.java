package br.leetjourney.mscadastro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "escola")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Escola {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String ies;
    private String coordenador;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Status status = Status.ATIVO;
}
