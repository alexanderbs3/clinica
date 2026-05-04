package br.leetjourney.msfarmacia.repository;
import br.leetjourney.msfarmacia.model.Medicamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MedicamentoRepository extends JpaRepository<Medicamento, Long> {
    List<Medicamento> findAllByAtivoTrue();
}
