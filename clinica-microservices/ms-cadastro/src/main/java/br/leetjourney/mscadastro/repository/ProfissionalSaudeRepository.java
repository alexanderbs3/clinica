package br.leetjourney.mscadastro.repository;
import br.leetjourney.mscadastro.model.ProfissionalSaude;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ProfissionalSaudeRepository extends JpaRepository<ProfissionalSaude, Long> {
    Optional<ProfissionalSaude> findByUsuarioId(Long usuarioId);
}
