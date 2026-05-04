package br.leetjourney.msatendimento.repository;
import br.leetjourney.msatendimento.model.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {
    Optional<Prontuario> findByPacienteId(Long pacienteId);
}
