import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/ui.components';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})
export class RelatoriosComponent implements OnInit {
  stats: any = {};
  pacientes: any[]      = [];
  atendimentos: any[]   = [];
  profissionais: any[]  = [];
  medicacoes: any[]     = [];
  requisicoes: any[]    = [];
  escolas: any[]        = [];
  unidades: any[]       = [];
  today = new Date().toISOString().split('T')[0];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    forkJoin({
      profissionais: this.api.getProfissionais(),
      escolas: this.api.getEscolas(),
      unidades: this.api.getUnidades(),
      pacientes: this.api.getPacientes(),
      atendimentos: this.api.getAtendimentos(),
      medicacoes: this.api.getMedicamentos(),
      requisicoes: this.api.getRequisicoes(),
      stats: this.api.getStatus(),
    }).subscribe({
      next: (res) => {
        this.profissionais = res.profissionais;
        this.escolas = res.escolas;
        this.unidades = res.unidades;
        this.pacientes = res.pacientes;
        this.atendimentos = res.atendimentos;
        this.medicacoes = res.medicacoes;
        this.requisicoes = res.requisicoes;
        this.stats = {
          escolas: res.escolas.filter((e: any) => e.status === 'ATIVO').length,
          unidades: res.unidades.filter((u: any) => u.status === 'ATIVO').length,
          profissionais: res.stats.totalProfissionais ?? res.profissionais.filter((p: any) => p.status === 'ATIVO').length,
          pacientes: res.stats.totalPacientes ?? res.pacientes.length,
          atendimentos: res.stats.totalAtendimentos ?? res.atendimentos.length,
          medicacoesAtivas: res.stats.totalMedicacoesAtivas ?? res.medicacoes.filter((m: any) => m.status === 'ATIVO').length,
          medicacoesEstoqueBaixo: res.stats.totalEstoqueBaixo ?? res.medicacoes.filter((m: any) => m.status === 'ATIVO' && m.estoque < 20 && m.estoque > 0).length,
          requisicoesPendentes: res.stats.totalRequisicoes ?? res.requisicoes.length,
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get ativosCount()        { return this.pacientes.filter(p => p.status === 'ATIVO').length; }
  get medicacoesVencidas() { return this.medicacoes.filter(m => m.validade < this.today && m.status === 'ATIVO').length; }
  get profCompletos()      { return this.profissionais.filter(p => p.cadastroCompleto && p.status === 'ATIVO').length; }

  get tipoAtendimentos() {
    const tipos: Record<string, number> = {};
    this.atendimentos.forEach(a => { tipos[a.tipo] = (tipos[a.tipo] || 0) + 1; });
    return Object.entries(tipos).map(([tipo, count]) => ({ tipo, count }));
  }
  get categoriaPacientes() {
    const cats: Record<string, number> = {};
    this.pacientes.forEach(p => { cats[p.categoria] = (cats[p.categoria] || 0) + 1; });
    return Object.entries(cats).map(([cat, count]) => ({ cat, count }));
  }
}
