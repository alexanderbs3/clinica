package br.leetjourney.mscadastro.repository;
import br.leetjourney.mscadastro.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    List<Paciente> findAllByProfissionalId(Long profissionalId);
}
