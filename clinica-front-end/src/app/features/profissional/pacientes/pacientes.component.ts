import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService, PacienteRequest } from '../../../core/services/api.service';
import { Escola, Unidade, Paciente, CategoriasPaciente, VinculoPaciente } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss']
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  escolas: Escola[] = [];
  unidades: Unidade[] = [];
  filtered: Paciente[] = [];
  searchTerm = '';
  filterStatus: 'TODOS' | 'ATIVO' | 'INATIVO' = 'TODOS';
  modalOpen = false;
  editItem: Paciente | null = null;
  form!: FormGroup;
  saving = false;
  errorMsg = '';
  successMsg = '';

  categorias: CategoriasPaciente[] = ['ALUNO', 'COLABORADOR_UNIDADE', 'COLABORADOR_ESCOLA', 'EXTERNO'];
  vinculos: VinculoPaciente[] = ['ESCOLA', 'UNIDADE', 'REITORIA'];

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.api.getPacientes().subscribe({
      next: (list) => { this.pacientes = list; this.applyFilter(); },
      error: (e) => { this.errorMsg = e?.error?.message ?? 'Erro ao carregar pacientes.'; }
    });

    this.api.getEscolas().subscribe({
      next: (list) => this.escolas = list.filter(e => e.status === 'ATIVO'),
      error: () => { this.escolas = []; }
    });

    this.api.getUnidades().subscribe({
      next: (list) => this.unidades = list.filter(u => u.status === 'ATIVO'),
      error: () => { this.unidades = []; }
    });

    this.buildForm();
  }

  buildForm(item?: Paciente) {
    const vinculoTipo = item?.vinculoTipo || this.defaultVinculoByCategoria(item?.categoria || 'ALUNO');
    this.form = this.fb.group({
      nome:        [item?.nome || '', [Validators.required, Validators.minLength(3)]],
      categoria:   [item?.categoria || '', Validators.required],
      vinculoTipo: [vinculoTipo, Validators.required],
      escolaId:    [item?.escolaId ?? ''],
      unidadeId:   [item?.unidadeId ?? ''],
      email:       [item?.email || '', [Validators.email]],
      telefone:    [item?.telefone || ''],
    });
    this.applyVinculoRules();
    this.form.get('categoria')?.valueChanges.subscribe((cat) => {
      const tipo = this.defaultVinculoByCategoria(cat);
      this.form.patchValue({ vinculoTipo: tipo }, { emitEvent: false });
      this.applyVinculoRules();
    });
    this.form.get('vinculoTipo')?.valueChanges.subscribe(() => this.applyVinculoRules());
  }

  applyFilter() {
    this.filtered = this.pacientes.filter(p => {
      const ms = this.filterStatus === 'TODOS' || p.status === this.filterStatus;
      const mq = !this.searchTerm ||
        p.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (p.email || '').toLowerCase().includes(this.searchTerm.toLowerCase());
      return ms && mq;
    });
  }

  openModal(item?: Paciente) {
    this.editItem = item || null;
    this.buildForm(item);
    this.errorMsg = '';
    this.modalOpen = true;
  }

  // ---------------------------------------------------------------------------
  // SAVE — CORREÇÃO PRINCIPAL
  // Antes: sempre chamava criarPaciente(), mesmo ao editar.
  // Agora: verifica editItem para decidir entre criar ou atualizar.
  // ---------------------------------------------------------------------------
  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.errorMsg = '';

    const raw = this.form.value;

    const payload: PacienteRequest = {
      nome:        raw.nome,
      email:       raw.email || undefined,
      telefone:    raw.telefone || undefined,
      categoria:   raw.categoria,
      vinculoTipo: raw.vinculoTipo,
      vinculoNome: this.getVinculoNome(raw.vinculoTipo, Number(raw.escolaId), Number(raw.unidadeId)),
      escolaId:    raw.vinculoTipo === 'ESCOLA'  ? Number(raw.escolaId)  : undefined,
      unidadeId:   raw.vinculoTipo === 'UNIDADE' ? Number(raw.unidadeId) : undefined,
    };

    // ✅ CORREÇÃO: roteamento correto entre criação e atualização
    if (this.editItem) {
      this.executarUpdate(this.editItem.id, payload);
    } else {
      this.executarCreate(payload);
    }
  }

  toggleStatus(item: Paciente) {
    this.api.inativarPaciente(item.id).subscribe({
      next: () => { this.showSuccess('Status do paciente alterado.'); this.loadAll(); },
      error: (e) => {
        this.errorMsg = e?.error?.message ?? 'Erro ao alterar status do paciente.';
      }
    });
  }

  labelCategoria(cat: string): string {
    const map: Record<string, string> = {
      ALUNO: 'Aluno',
      COLABORADOR_UNIDADE: 'Colab. Unidade',
      COLABORADOR_ESCOLA: 'Colab. Escola',
      EXTERNO: 'Externo',
    };
    return map[cat] || cat;
  }

  labelVinculo(tipo: VinculoPaciente): string {
    const map: Record<VinculoPaciente, string> = {
      ESCOLA: 'Escola',
      UNIDADE: 'Unidade',
      REITORIA: 'Reitoria',
    };
    return map[tipo];
  }

  // ---------------------------------------------------------------------------
  // PRIVADOS
  // ---------------------------------------------------------------------------

  /**
   * Cria um novo paciente via API.
   */
  private executarCreate(payload: PacienteRequest) {
    this.api.criarPaciente(payload).subscribe({
      next: () => {
        this.modalOpen = false;
        this.saving = false;
        this.showSuccess('Paciente cadastrado com sucesso.');
        this.loadAll();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message ?? 'Erro ao cadastrar paciente.';
        this.saving = false;
      }
    });
  }

  /**
   * Atualiza um paciente existente via API.
   * CORREÇÃO: método novo — antes inexistente, causando o bug de edição.
   *
   * Chama PUT /paciente/{id} e recarrega a lista após sucesso.
   * Exibe mensagem de erro vinda do backend em caso de falha.
   */
  private executarUpdate(id: number, payload: PacienteRequest) {
    this.api.atualizarPaciente(id, payload).subscribe({
      next: () => {
        this.modalOpen = false;
        this.saving = false;
        this.editItem = null;
        this.showSuccess('Paciente atualizado com sucesso.');
        this.loadAll(); // ← recarrega a lista para mostrar os dados novos
      },
      error: (err) => {
        // Exibe mensagem de erro do backend (ex: "e-mail já existe")
        this.errorMsg = err?.error?.message ?? 'Erro ao atualizar paciente.';
        this.saving = false;
      }
    });
  }

  private defaultVinculoByCategoria(categoria: CategoriasPaciente): VinculoPaciente {
    if (categoria === 'COLABORADOR_UNIDADE') return 'UNIDADE';
    if (categoria === 'EXTERNO') return 'REITORIA';
    return 'ESCOLA';
  }

  private applyVinculoRules() {
    const tipo = this.form.get('vinculoTipo')?.value as VinculoPaciente;
    const escolaCtrl  = this.form.get('escolaId');
    const unidadeCtrl = this.form.get('unidadeId');
    escolaCtrl?.clearValidators();
    unidadeCtrl?.clearValidators();

    if (tipo === 'ESCOLA') {
      escolaCtrl?.setValidators([Validators.required]);
      unidadeCtrl?.setValue('');
    } else if (tipo === 'UNIDADE') {
      unidadeCtrl?.setValidators([Validators.required]);
      escolaCtrl?.setValue('');
    } else {
      escolaCtrl?.setValue('');
      unidadeCtrl?.setValue('');
    }

    escolaCtrl?.updateValueAndValidity({ emitEvent: false });
    unidadeCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  private getVinculoNome(tipo: VinculoPaciente, escolaId: number, unidadeId: number): string {
    if (tipo === 'ESCOLA')  return this.escolas.find(e => e.id === escolaId)?.nome  || '';
    if (tipo === 'UNIDADE') return this.unidades.find(u => u.id === unidadeId)?.nome || '';
    return 'Reitoria';
  }

  showSuccess(msg: string) { this.successMsg = msg; setTimeout(() => this.successMsg = '', 4000); }
  f(field: string) { return this.form.get(field); }
}