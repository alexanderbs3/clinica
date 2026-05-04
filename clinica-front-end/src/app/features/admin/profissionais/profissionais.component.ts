import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ProfissionalSaude } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-profissionais',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './profissionais.component.html',
  styleUrls: ['./profissionais.component.scss']
})
export class ProfissionaisComponent implements OnInit {
  profissionais: ProfissionalSaude[] = [];
  filtered: ProfissionalSaude[] = [];
  searchTerm = '';
  loading = false;

  modalOpen = false;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';
  // Exibe senha em texto (toggle)
  showPassword = false;

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.loadProfissionais();
  }

  loadProfissionais() {
    this.loading = true;
    this.api.getProfissionais().subscribe({
      next: list => { this.profissionais = list; this.applyFilter(); this.loading = false; },
      error: (e) => {
        this.errorMsg = e?.error?.error ?? e?.error?.message ?? 'Erro ao carregar profissionais.';
        this.loading = false;
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      nome:     ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  applyFilter() {
    this.filtered = this.profissionais.filter(p => {
      return !this.searchTerm ||
        p.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (p.especialidade ?? '').toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  openModal() {
    this.buildForm();
    this.errorMsg = '';
    this.showPassword = false;
    this.modalOpen = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';

    this.api.criarProfissional(this.form.value).subscribe({
      next: () => {
        this.modalOpen = false;
        this.saving = false;
        this.showSuccess('Profissional cadastrado com sucesso!');
        this.loadProfissionais();
      },
      error: (e) => {
        this.errorMsg = e?.error?.error ?? e?.error?.message ?? 'Erro ao cadastrar profissional.';
        this.saving = false;
      }
    });
  }

  inativar(item: ProfissionalSaude) {
    this.api.inativarProfissional(item.id).subscribe({
      next: () => { this.showSuccess('Profissional inativado.'); this.loadProfissionais(); },
      error: (e) => { this.errorMsg = e?.error?.error ?? e?.error?.message ?? 'Erro ao inativar.'; }
    });
  }

  showSuccess(msg: string) { this.successMsg = msg; setTimeout(() => this.successMsg = '', 3000); }
  f(field: string) { return this.form.get(field); }
}