import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../../core/services/api.service';
import { PageHeaderComponent } from '../../../shared/components/ui.components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = {
    escolas: 0, unidades: 0, profissionais: 0,
    pacientes: 0, atendimentos: 0, medicacoesAtivas: 0,
    medicacoesEstoqueBaixo: 0, requisicoesPendentes: 0,
  };
  loading = true;
  today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  cards = [
    { label: 'Escolas Ativas',      key: 'escolas',                icon: 'school',    color: 'blue',   route: '/admin/escolas' },
    { label: 'Unidades Ativas',     key: 'unidades',               icon: 'building',  color: 'purple', route: '/admin/unidades' },
    { label: 'Profissionais',       key: 'profissionais',          icon: 'users',     color: 'teal',   route: '/admin/profissionais' },
    { label: 'Pacientes',           key: 'pacientes',              icon: 'heart',     color: 'rose',   route: '/admin/relatorios' },
    { label: 'Atendimentos',        key: 'atendimentos',           icon: 'clipboard', color: 'amber',  route: '/admin/relatorios' },
    { label: 'Medicações Ativas',   key: 'medicacoesAtivas',       icon: 'pill',      color: 'green',  route: '/admin/medicacoes' },
    { label: 'Estoque Baixo',       key: 'medicacoesEstoqueBaixo', icon: 'warning',   color: 'orange', route: '/admin/medicacoes' },
    { label: 'Requisições',         key: 'requisicoesPendentes',   icon: 'bell',      color: 'red',    route: '/admin/medicacoes' },
  ];

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.api.getStatus().subscribe({
      next: (res) => {
        this.stats = {
          escolas: res.totalEscolasAtivas ?? 0,
          unidades: res.totalUnidadesAtivas ?? 0,
          profissionais: res.totalProfissionais ?? 0,
          pacientes: res.totalPacientes ?? 0,
          atendimentos: res.totalAtendimentos ?? 0,
          medicacoesAtivas: res.totalMedicacoesAtivas ?? 0,
          medicacoesEstoqueBaixo: res.totalEstoqueBaixo ?? 0,
          requisicoesPendentes: res.totalRequisicoes ?? 0,
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getIcon(name: string): string {
    const icons: Record<string, string> = {
      school:    `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>`,
      building:  `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/></svg>`,
      users:     `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>`,
      heart:     `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/></svg>`,
      clipboard: `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>`,
      pill:      `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm-1 5a1 1 0 012 0v4a1 1 0 01-2 0V7zm1-2a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"/></svg>`,
      warning:   `<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`,
      bell:      `<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>`,
    };
    return icons[name] || '';
  }

  safeIcon(name: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.getIcon(name));
  }
}
