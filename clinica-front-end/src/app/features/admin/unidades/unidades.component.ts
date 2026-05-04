import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Unidade } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.scss']
})
export class UnidadesComponent implements OnInit {
  unidades: Unidade[] = [];
  filtered: Unidade[] = [];
  searchTerm = '';
  loading = false;

  modalOpen = false;
  editItem: Unidade | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.loadUnidades();
  }

  loadUnidades() {
    this.loading = true;
    this.api.getUnidades().subscribe({
      next: list => { this.unidades = list; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  buildForm(item?: Unidade) {
    this.form = this.fb.group({
      nome:        [item?.nome || '', [Validators.required, Validators.minLength(3)]],
      responsavel: [item?.responsavel || '', Validators.required],
      ies:         [item?.ies || '', Validators.required],
    });
  }

  applyFilter() {
    this.filtered = this.unidades.filter(u => {
      return !this.searchTerm ||
        u.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        u.responsavel.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  openModal(item?: Unidade) {
    this.editItem = item || null;
    this.buildForm(item);
    this.errorMsg = '';
    this.modalOpen = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';

    const payload = this.form.value;

    const request$ = this.editItem?.id
      ? this.api.atualizarUnidade(this.editItem.id, payload)
      : this.api.criarUnidade(payload);

    request$.subscribe({
      next: () => {
        this.modalOpen = false;
        this.saving = false;
        this.showSuccess(this.editItem ? 'Unidade atualizada com sucesso!' : 'Unidade cadastrada com sucesso!');
        this.loadUnidades();
      },
      error: (e) => {
        this.errorMsg = e.error?.message ?? 'Erro ao salvar unidade.';
        this.saving = false;
      }
    });
  }

  inativar(item: Unidade) {
    this.api.inativarUnidade(item.id).subscribe({
      next: () => { this.showSuccess('Unidade inativada com sucesso.'); this.loadUnidades(); },
      error: (e) => { this.errorMsg = e.error?.message ?? 'Erro ao inativar.'; }
    });
  }

  showSuccess(msg: string) { this.successMsg = msg; setTimeout(() => this.successMsg = '', 3000); }
  f(field: string) { return this.form.get(field); }
}
