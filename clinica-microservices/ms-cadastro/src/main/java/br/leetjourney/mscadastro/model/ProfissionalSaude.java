package br.leetjourney.mscadastro.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "profissional_saude")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProfissionalSaude {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String formacao;
    private String especialidade;
    private String conselho;

    @Column(name = "numero_registro")
    private String numeroRegistro;

    @Column(name = "dias_atendimento")
    private String diasAtendimento;

    @Column(name = "turnos_atendimento")
    private String turnosAtendimento;

    @Column(name = "data_cadastro")
    private LocalDate dataCadastro;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Status status = Status.ATIVO;

    // ID do usuário no ms-auth (referência externa, sem FK real)
    @Column(name = "usuario_id", unique = true)
    private Long usuarioId;

    @Column(name = "cadastro_completo", nullable = false)
    private boolean cadastroCompleto = false;

    @PrePersist
    public void prePersist() {
        if (dataCadastro == null) dataCadastro = LocalDate.now();
    }
}
