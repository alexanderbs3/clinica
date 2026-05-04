import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Prontuario, Paciente, Atendimento } from '../../../core/models/models';
import { PageHeaderComponent, BtnComponent, EmptyStateComponent } from '../../../shared/components/ui.components';
import { ModalComponent } from '../../../shared/components/modal.component';

@Component({
  selector: 'app-prontuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, BtnComponent, EmptyStateComponent, ModalComponent],
  templateUrl: './prontuarios.component.html',
  styleUrls: ['./prontuarios.component.scss']
})
export class ProntuariosComponent implements OnInit {
  prontuarios: Prontuario[] = [];
  pacientes: Paciente[] = [];
  searchTerm = '';
  detalheOpen = false;
  selectedProntuario: Prontuario | null = null;

  get filtered() {
    if (!this.searchTerm) return this.prontuarios;
    const t = this.searchTerm.toLowerCase();
    return this.prontuarios.filter(p =>
      (p.pacienteNome || '').toLowerCase().includes(t)
    );
  }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getProntuarios().subscribe({
      next: list => this.prontuarios = list,
      error: () => { this.prontuarios = []; }
    });

    this.api.getPacientes().subscribe({
      next: list => this.pacientes = list,
      error: () => { this.pacientes = []; }
    });
  }

  getPacienteCategoria(pacienteId: number): string {
    const p = this.pacientes.find(x => x.id === pacienteId);
    return p?.categoria || '';
  }

  getPacienteStatus(pacienteId: number): string {
    const p = this.pacientes.find(x => x.id === pacienteId);
    return p?.status || '';
  }

  verProntuario(p: Prontuario) {
    this.selectedProntuario = p;
    this.detalheOpen = true;
  }

  getUltimoAtendimento(prontuario: Prontuario): Atendimento | null {
    if (!prontuario.atendimentos.length) return null;
    return [...prontuario.atendimentos].sort(
      (a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime()
    )[0];
  }

  tipoColor(tipo: string): string {
    const map: Record<string, string> = {
      URGENCIA: 'danger', EMERGENCIA: 'warning', CONSULTA: 'primary', REVISAO: 'info'
    };
    return map[tipo] || 'primary';
  }
}
