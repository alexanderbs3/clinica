package br.leetjourney.msatendimento.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "prontuario")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Prontuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paciente_id", nullable = false, unique = true)
    private Long pacienteId;

    @Column(name = "nome_paciente")
    private String nomePaciente;

    @Column(name = "profissional_id")
    private Long profissionalId;
}
