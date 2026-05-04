import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfissionalSaude } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent } from '../../../shared/components/ui.components';

@Component({
  selector: 'app-meu-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, BtnComponent],
  templateUrl: './meu-cadastro.component.html',
  styleUrls: ['./meu-cadastro.component.scss']
})
export class MeuCadastroComponent implements OnInit {
  profissional: ProfissionalSaude | null = null;
  form!: FormGroup;
  loading = false;
  saving = false;
  successMsg = '';
  errorMsg = '';
  editMode = false;

  conselhos = ['CRM', 'CRO', 'COREN', 'CREFITO', 'CRP', 'CFM', 'CRN'];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.loading = true;
    this.api.getMeuPerfil().subscribe({
      next: (p) => {
        this.profissional = p;
        this.editMode = !p.cadastroCompleto;
        this.buildForm();
        this.loading = false;
      },
      error: (e) => {
        this.errorMsg = e?.error?.message ?? 'Não foi possível carregar seu perfil.';
        this.loading = false;
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      especialidade:  [this.profissional?.especialidade  || '', Validators.required],
      formacao:       [this.profissional?.formacao       || '', Validators.required],
      conselho:       [this.profissional?.conselho       || '', Validators.required],
      numeroRegistro: [this.profissional?.numeroRegistro || '', Validators.required],
      diasAtendimento:[this.profissional?.diasAtendimento|| '', Validators.required],
      turnosAtendimento:[this.profissional?.turnosAtendimento || '', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';

    const payload = {
      especialidade: this.form.value.especialidade,
      formacao: this.form.value.formacao,
      conselho: this.form.value.conselho,
      numeroRegistro: this.form.value.numeroRegistro,
      diasAtendimento: this.form.value.diasAtendimento,
      turnosAtendimento: this.form.value.turnosAtendimento,
    };

    this.api.completarCadastro(payload).subscribe({
      next: (p) => {
        this.profissional = p;
        this.saving = false;
        this.editMode = false;
        this.successMsg = 'Cadastro complementado com sucesso!';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (e) => {
        this.errorMsg = e?.error?.message ?? 'Erro ao salvar cadastro.';
        this.saving = false;
      }
    });
  }

  f(field: string) { return this.form.get(field); }
}
