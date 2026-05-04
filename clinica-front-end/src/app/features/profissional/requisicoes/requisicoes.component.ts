import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { RequisicaoMedicacao, Medicacao, TipoRequisicao } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-requisicoes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './requisicoes.component.html',
  styleUrls: ['./requisicoes.component.scss']
})
export class RequisicoesComponent implements OnInit {
  requisicoes: RequisicaoMedicacao[] = [];
  medicacoes: Medicacao[] = [];
  searchTerm = '';
  filterTipo: string = 'TODOS';
  modalOpen = false;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';

  tipos: TipoRequisicao[] = ['SAIDA', 'ENTRADA'];

  get filtered() {
    return this.requisicoes.filter(r => {
      const mt = this.filterTipo === 'TODOS' || r.tipo === this.filterTipo;
      const mq = !this.searchTerm || (r.medicacaoNome || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      return mt && mq;
    });
  }

  get medicacoesAtivas() { return this.medicacoes.filter(m => m.status === 'ATIVO'); }

  constructor(private api: ApiService, private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.api.getRequisicoes().subscribe({
      next: list => this.requisicoes = list,
      error: () => { this.requisicoes = []; }
    });
    this.api.getMedicamentos().subscribe({
      next: list => this.medicacoes = list,
      error: () => { this.medicacoes = []; }
    });
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      medicacaoId: ['', Validators.required],
      quantidade:  [1, [Validators.required, Validators.min(1)]],
      tipo:        ['SAIDA', Validators.required],
      observacao:  [''],
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';
    const raw = this.form.value;
    const payload = {
      medicacaoId: Number(raw.medicacaoId),
      quantidade: Number(raw.quantidade),
      tipo: raw.tipo,
      profissionalId: this.auth.currentUser?.id ?? 0,
      data: new Date().toISOString().split('T')[0],
      observacao: raw.observacao || undefined,
    };
    this.api.createRequisicao(payload).subscribe({
      next: (nova) => {
        this.requisicoes = [...this.requisicoes, nova];
        this.modalOpen = false;
        this.saving = false;
        this.buildForm();
        this.showSuccess('Requisição enviada ao administrador!');
      },
      error: (e) => { this.errorMsg = e?.error?.message || 'Erro ao salvar requisição.'; this.saving = false; }
    });
  }

  tipoLabel(tipo: string): string {
    const map: Record<string, string> = { SAIDA: 'Saída', ENTRADA: 'Entrada' };
    return map[tipo] || tipo;
  }

  showSuccess(msg: string) { this.successMsg = msg; setTimeout(() => this.successMsg = '', 4000); }
  f(field: string) { return this.form.get(field); }
}
