import { Routes } from "@angular/router";
import { authGuard, adminGuard, profissionalCadastroGuard } from "./core/guards/auth.guard";

export const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },

  // ── Login (público) ──
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login.component").then((m) => m.LoginComponent),
  },

  // ── Painel do Administrador (protegido) ──
  {
    path: "admin",
    loadComponent: () =>
      import("./shared/components/shell.component").then((m) => m.ShellComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        loadComponent: () =>
          import("./features/admin/dashboard/dashboard.component").then((m) => m.DashboardComponent),
      },
      {
        path: "escolas",
        loadComponent: () =>
          import("./features/admin/escolas/escolas.component").then((m) => m.EscolasComponent),
      },
      {
        path: "unidades",
        loadComponent: () =>
          import("./features/admin/unidades/unidades.component").then((m) => m.UnidadesComponent),
      },
      {
        path: "profissionais",
        loadComponent: () =>
          import("./features/admin/profissionais/profissionais.component").then((m) => m.ProfissionaisComponent),
      },
      {
        path: "medicacoes",
        loadComponent: () =>
          import("./features/admin/medicacoes/medicacoes.component").then((m) => m.MedicacoesComponent),
      },
      {
        path: "relatorios",
        loadComponent: () =>
          import("./features/admin/relatorios/relatorios.component").then((m) => m.RelatoriosComponent),
      },
    ],
  },

  // ── Painel do Profissional de Saúde (protegido) ──
  {
    path: "profissional",
    loadComponent: () =>
      import("./shared/components/shell.component").then((m) => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: "pacientes", pathMatch: "full" },

      // Rota de completar cadastro — acessível sempre (sem guard de cadastroCompleto)
      {
        path: "meu-cadastro",
        loadComponent: () =>
          import("./features/profissional/cadastro/meu-cadastro.component").then((m) => m.MeuCadastroComponent),
      },

      /**
       * CORREÇÃO: rotas de pacientes, atendimentos, prontuários e requisições
       * agora têm o profissionalCadastroGuard ativo (RN013).
       * Profissional sem cadastro completo é redirecionado para /profissional/meu-cadastro.
       */
      {
        path: "pacientes",
        canActivate: [profissionalCadastroGuard],
        loadComponent: () =>
          import("./features/profissional/pacientes/pacientes.component").then((m) => m.PacientesComponent),
      },
      {
        path: "atendimentos",
        canActivate: [profissionalCadastroGuard],
        loadComponent: () =>
          import("./features/profissional/atendimentos/atendimentos.component").then((m) => m.AtendimentosComponent),
      },
      {
        path: "prontuarios",
        canActivate: [profissionalCadastroGuard],
        loadComponent: () =>
          import("./features/profissional/prontuarios/prontuarios.component").then((m) => m.ProntuariosComponent),
      },
      {
        path: "requisicoes",
        canActivate: [profissionalCadastroGuard],
        loadComponent: () =>
          import("./features/profissional/requisicoes/requisicoes.component").then((m) => m.RequisicoesComponent),
      },
    ],
  },

  { path: "**", redirectTo: "/login" },
];
