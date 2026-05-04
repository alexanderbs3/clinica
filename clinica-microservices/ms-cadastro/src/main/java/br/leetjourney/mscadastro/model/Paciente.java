package br.leetjourney.mscadastro.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "paciente")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Paciente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String email;
    private String telefone;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Status status = Status.ATIVO;

    @Enumerated(EnumType.STRING) @Column(name = "categoria_paciente", nullable = false)
    private CategoriaPaciente categoria;

    @Enumerated(EnumType.STRING) @Column(name = "vinculo_paciente", nullable = false)
    private VinculoPaciente vinculoTipo;

    @Column(name = "vinculo_nome")
    private String vinculoNome;

    // Referência por ID — sem @ManyToOne cross-service
    @Column(name = "profissional_id", nullable = false)
    private Long profissionalId;

    @Column(name = "escola_id")
    private Long escolaId;

    @Column(name = "unidade_id")
    private Long unidadeId;
}
