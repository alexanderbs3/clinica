import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Medicacao } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-medicacoes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './medicacoes.component.html',
  styleUrls: ['./medicacoes.component.scss']
})
export class MedicacoesComponent implements OnInit {
  medicacoes: Medicacao[] = [];
  filtered: Medicacao[] = [];
  searchTerm = '';
  filterStatus: 'TODOS'|'ATIVO'|'INATIVO' = 'TODOS';
  modalOpen = false;
  editItem: Medicacao | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';
  today = new Date().toISOString().split('T')[0];

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadMedicacoes();
    this.buildForm();
  }

  loadMedicacoes() {
    this.api.getMedicamentos().subscribe({
      next: list => { this.medicacoes = list; this.applyFilter(); },
      error: (e) => { this.errorMsg = e?.error?.message ?? 'Erro ao carregar medicações.'; }
    });
  }

  buildForm(item?: Medicacao) {
    this.form = this.fb.group({
      nome:          [item?.nome || '', Validators.required],
      descricao:     [item?.descricao || '', Validators.required],
      fornecedor:    [item?.fornecedor || ''],
      armazenamento: [item?.armazenamento || 'TEMPERATURA_AMBIENTE'],
      quantidade:    [item?.estoque ?? 1, [Validators.required, Validators.min(1)]],
      unidadeMedida: [item?.unidadeMedida || 'un', Validators.required],
      dataAquisicao: [item?.dataAquisicao || ''],
      validade:      [item?.validade || '', Validators.required],
    });
  }

  applyFilter() {
    this.filtered = this.medicacoes.filter(m => {
      const statusMedicacao = m.status;
      const ms = this.filterStatus === 'TODOS' || statusMedicacao === this.filterStatus;
      const mq = !this.searchTerm || m.nome.toLowerCase().includes(this.searchTerm.toLowerCase());
      return ms && mq;
    });
  }

  openModal(item?: Medicacao) {
    this.editItem = item || null;
    this.buildForm(item);
    this.errorMsg = '';
    this.modalOpen = true;
  }

  save() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      return; 
    }

    this.saving = true;

    const payload = {
      nome: this.form.value.nome,
      descricao: this.form.value.descricao,
      quantidade: Number(this.form.value.quantidade),
      unidadeMedida: this.form.value.unidadeMedida,
      validade: this.form.value.validade,
      ativo: true
    };

    const apiRequest$ = this.editItem?.id
      ? this.api.atualizarMedicamento({ ...payload, id: this.editItem.id })
      : this.api.criarMedicamento(payload);

    apiRequest$.subscribe({
      next: () => {
        this.modalOpen = false;
        this.saving = false;
        this.showSuccess('Medicação salva com sucesso!');
        this.loadMedicacoes();
      },
      error: (e) => {
        this.errorMsg = e?.error?.message ?? 'Erro ao salvar medicação.';
        this.saving = false;
      }
    });
  }

  toggleStatus(item: Medicacao) {
    this.api.toggleMedicamento(item.id, item.status).subscribe({
      next: () => { 
        this.showSuccess(`Medicação ${item.status === 'ATIVO' ? 'inativada' : 'ativada'}.`); 
        this.loadMedicacoes(); 
      },
      error: (e) => {
        this.errorMsg = e?.error?.message ?? 'Erro ao alterar status da medicação.';
      }
    });
  }

  isVencida(validade: string): boolean { return validade < this.today; }
  isEstoqueBaixo(estoque: number): boolean { return estoque < 20 && estoque > 0; }
  isEstoqueZero(estoque: number): boolean { return estoque === 0; }

  showSuccess(msg: string) { 
    this.successMsg = msg; 
    setTimeout(() => this.successMsg = '', 3000); 
  }

  f(field: string) { return this.form.get(field); }
}
