package br.leetjourney.msatendimento.repository;
import br.leetjourney.msatendimento.model.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
    List<Atendimento> findAllByProfissionalId(Long profissionalId);
    List<Atendimento> findAllByProntuario_PacienteId(Long pacienteId);
}
