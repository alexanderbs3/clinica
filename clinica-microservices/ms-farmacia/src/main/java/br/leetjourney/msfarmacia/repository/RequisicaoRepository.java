package br.leetjourney.msfarmacia.repository;
import br.leetjourney.msfarmacia.model.RequisicaoMedicacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface RequisicaoRepository extends JpaRepository<RequisicaoMedicacao, Long> {
    List<RequisicaoMedicacao> findAllByProfissionalId(Long profissionalId);
}
