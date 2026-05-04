import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Escola } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-escolas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './escolas.component.html',
  styleUrls: ['./escolas.component.scss']
})
export class EscolasComponent implements OnInit {
  escolas: Escola[] = [];
  filtered: Escola[] = [];
  searchTerm = '';
  loading = false;

  modalOpen = false;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
    this.loadEscolas();
  }

  loadEscolas() {
    this.loading = true;
    this.api.getEscolas().subscribe({
      next: list => { this.escolas = list; this.applyFilter(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      nome:        ['', [Validators.required, Validators.minLength(3)]],
      coordenador: ['', Validators.required],
      ies:         ['', Validators.required],
    });
  }

  applyFilter() {
    this.filtered = this.escolas.filter(e =>
      !this.searchTerm ||
      e.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.coordenador.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openModal() {
    this.buildForm();
    this.errorMsg = '';
    this.modalOpen = true;
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';

    this.api.criarEscola(this.form.value).subscribe({
      next: () => {
        this.modalOpen = false;
        this.saving = false;
        this.showSuccess('Escola cadastrada com sucesso!');
        this.loadEscolas();
      },
      error: (e) => {
        this.errorMsg = e.error?.message ?? 'Erro ao salvar escola.';
        this.saving = false;
      }
    });
  }

  showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => this.successMsg = '', 3000);
  }

  f(field: string) { return this.form.get(field); }
}
