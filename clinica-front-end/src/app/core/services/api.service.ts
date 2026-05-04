import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { environment } from "../../../environments/environment";
import {
  Escola,
  Unidade,
  ProfissionalSaude,
  Medicamento,
  Atendimento,
  Prontuario,
  Requisicao,
  StatusDashboard,
  Paciente,
} from "../models/models";

export interface EscolaRequest {
  nome: string;
  ies: string;
  coordenador: string;
}

export interface UnidadeRequest {
  nome: string;
  ies: string;
  responsavel: string;
}

export interface ProfissionalCadastroRequest {
  nome: string;
  username: string;
  password: string;
}

export interface ProfissionalComplementoRequest {
  especialidade: string;
  formacao: string;
  conselho: string;
  numeroRegistro: string;
  diasAtendimento: string;
  turnosAtendimento: string;
}

export interface MedicamentoRequest {
  nome: string;
  descricao?: string;
  quantidade?: number;
  unidadeMedida?: string;
  ativo?: boolean;
  validade?: string;
}

export interface AtendimentoRequest {
  pacienteId: number;
  profissionalId?: number;
  dataInicio?: string;
  dataFim?: string;
  sintomas?: string;
  diagnostico?: string;
  tratamento?: string;
  tipo?: string;
  medicacoesUsadas?: Array<{
    medicacaoId: number;
    medicacaoNome?: string;
    quantidade: number;
    dosagem: string;
  }>;
  descricao?: string;
  observacoes?: string;
  dataAtendimento?: string;
  status?: string;
}

/**
 * PacienteRequest alinhado com o backend real.
 * CORREÇÃO: campos corretos (categoria, vinculoTipo, escolaId, unidadeId)
 * em vez dos antigos (cpf, dataNascimento, endereco, responsavel).
 */
export interface PacienteRequest {
  nome: string;
  email?: string;
  telefone?: string;
  categoria: string;
  vinculoTipo: string;
  vinculoNome?: string;
  escolaId?: number;
  unidadeId?: number;
}

@Injectable({ providedIn: "root" })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private adaptProfissional(item: Partial<ProfissionalSaude>): ProfissionalSaude {
    return {
      id: item.id ?? 0,
      nome: item.nome ?? "",
      username: item.username ?? "",
      usuarioId: item.usuarioId,
      formacao: item.formacao ?? "",
      conselho: item.conselho ?? "",
      especialidade: item.especialidade ?? "",
      numeroRegistro: item.numeroRegistro ?? "",
      diasAtendimento: item.diasAtendimento ?? "",
      turnosAtendimento: item.turnosAtendimento ?? "",
      dataCadastro: item.dataCadastro ?? "",
      status: item.status ?? "ATIVO",
      cadastroCompleto: item.cadastroCompleto ?? false,
    };
  }

  private adaptMedicamento(item: any): Medicamento {
    return {
      id: item.id ?? 0,
      nome: item.nome ?? "",
      descricao: item.descricao ?? "",
      fornecedor: item.fornecedor ?? "Nao informado",
      armazenamento: item.armazenamento ?? "TEMPERATURA_AMBIENTE",
      estoque: item.estoque ?? item.quantidade ?? 0,
      unidadeMedida: item.unidadeMedida ?? "un",
      dataAquisicao: item.dataAquisicao ?? "",
      validade: item.validade ?? "",
      status: item.status ?? (item.ativo === false ? "INATIVO" : "ATIVO"),
    };
  }

  private adaptRequisicao(item: any): Requisicao {
    return {
      id: item.id ?? 0,
      medicacaoId: item.medicacaoId ?? item.medicamentoId ?? 0,
      medicacaoNome: item.medicacaoNome ?? item.nomeMedicamento ?? "",
      quantidade: item.quantidade ?? 0,
      tipo: item.tipo ?? item.tipoRequisicao ?? "SAIDA",
      profissionalId: item.profissionalId ?? 0,
      data: item.data ?? "",
      observacao: item.observacao,
    };
  }

  private encodeAtendimentoDetails(data: AtendimentoRequest): string {
    return JSON.stringify({
      diagnostico: data.diagnostico ?? "",
      tratamento: data.tratamento ?? "",
      dataFim: data.dataFim ?? "",
      tipo: data.tipo ?? data.status ?? "CONSULTA",
      medicacoesUsadas: data.medicacoesUsadas ?? [],
    });
  }

  private decodeAtendimentoDetails(raw?: string | null): {
    diagnostico?: string;
    tratamento?: string;
    dataFim?: string;
    tipo?: string;
    medicacoesUsadas?: Atendimento["medicacoesUsadas"];
  } {
    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw);
    } catch {
      return { tratamento: raw };
    }
  }

  private adaptAtendimento(item: any): Atendimento {
    const details = this.decodeAtendimentoDetails(item.observacoes);

    return {
      id: item.id ?? 0,
      pacienteId: item.pacienteId ?? 0,
      pacienteNome: item.pacienteNome ?? "",
      profissionalId: item.profissionalId ?? item.profissionalUsuarioId ?? 0,
      profissionalNome: item.profissionalNome ?? "",
      dataInicio: item.dataInicio ?? item.dataAtendimento ?? "",
      dataFim: item.dataFim ?? details.dataFim,
      sintomas: item.sintomas ?? item.descricao ?? "",
      diagnostico: item.diagnostico ?? details.diagnostico ?? "",
      tratamento: item.tratamento ?? details.tratamento ?? "",
      tipo: item.tipo ?? item.statusAtendimento ?? item.status ?? details.tipo ?? "CONSULTA",
      medicacoesUsadas: item.medicacoesUsadas ?? details.medicacoesUsadas ?? [],
    };
  }

  private adaptProntuario(item: any): Prontuario {
    return {
      id: item.id ?? 0,
      pacienteId: item.pacienteId ?? 0,
      pacienteNome: item.pacienteNome ?? item.nomePaciente ?? "",
      atendimentos: Array.isArray(item.atendimentos)
        ? item.atendimentos.map((atendimento: any) => this.adaptAtendimento(atendimento))
        : [],
    };
  }

  // ── ESCOLAS ────────────────────────────────────────────────────────────────

  getEscolas(): Observable<Escola[]> {
    return this.http.get<Escola[]>(`${this.base}/cadastro/escolas`);
  }

  getEscolaById(id: number): Observable<Escola> {
    return this.http.get<Escola>(`${this.base}/cadastro/escolas/${id}`);
  }

  criarEscola(data: EscolaRequest): Observable<Escola> {
    return this.http.post<Escola>(`${this.base}/cadastro/escolas`, data);
  }

  atualizarEscola(id: number, data: EscolaRequest): Observable<Escola> {
    return this.http.put<Escola>(`${this.base}/cadastro/escolas/${id}`, data);
  }

  inativarEscola(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/cadastro/escolas/${id}/inativar`, {});
  }

  // ── UNIDADES ───────────────────────────────────────────────────────────────

  getUnidades(): Observable<Unidade[]> {
    return this.http.get<Unidade[]>(`${this.base}/cadastro/unidades`);
  }

  getUnidadeById(id: number): Observable<Unidade> {
    return this.http.get<Unidade>(`${this.base}/cadastro/unidades/${id}`);
  }

  criarUnidade(data: UnidadeRequest): Observable<Unidade> {
    return this.http.post<Unidade>(`${this.base}/cadastro/unidades`, data);
  }

  atualizarUnidade(id: number, data: UnidadeRequest): Observable<Unidade> {
    return this.http.put<Unidade>(`${this.base}/cadastro/unidades/${id}`, data);
  }

  inativarUnidade(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/cadastro/unidades/${id}/inativar`, {});
  }

  // ── PROFISSIONAIS (admin) ──────────────────────────────────────────────────

  getProfissionais(): Observable<ProfissionalSaude[]> {
    return this.http
      .get<Partial<ProfissionalSaude>[]>(`${this.base}/cadastro/profissionais`)
      .pipe(map((list) => list.map((item) => this.adaptProfissional(item))));
  }

  getProfissionalById(id: number): Observable<ProfissionalSaude> {
    return this.http
      .get<Partial<ProfissionalSaude>>(`${this.base}/cadastro/profissionais/${id}`)
      .pipe(map((item) => this.adaptProfissional(item)));
  }

  criarProfissional(data: ProfissionalCadastroRequest): Observable<ProfissionalSaude> {
    return this.http
      .post<{ token: string }>(`${this.base}/auth/register`, {
        username: data.username,
        password: data.password,
        role: "PROFISSIONAL",
      })
      .pipe(
        switchMap((res) =>
          this.http.post<Partial<ProfissionalSaude>>(
            `${this.base}/cadastro/profissionais`,
            { nome: data.nome },
            { headers: { Authorization: `Bearer ${res.token}` } }
          )
        ),
        map((item) => this.adaptProfissional({ ...item, username: data.username }))
      );
  }

  inativarProfissional(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/cadastro/profissionais/${id}/inativar`, {});
  }

  // ── PROFISSIONAIS (self — perfil próprio) ──────────────────────────────────

  getMeuPerfil(): Observable<ProfissionalSaude> {
    return this.http
      .get<Partial<ProfissionalSaude>>(`${this.base}/cadastro/profissionais/me`)
      .pipe(map((item) => this.adaptProfissional(item)));
  }

  completarCadastro(data: ProfissionalComplementoRequest): Observable<ProfissionalSaude> {
    return this.http.put<ProfissionalSaude>(
      `${this.base}/cadastro/profissionais/complemento`,
      data
    ).pipe(map((item) => this.adaptProfissional(item)));
  }

  // ── PACIENTES ──────────────────────────────────────────────────────────────

  /**
   * Retorna apenas os pacientes do profissional autenticado (filtrado no backend).
   */
  getPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.base}/cadastro/pacientes`);
  }

  /**
   * Cadastra um novo paciente vinculado ao profissional autenticado.
   */
  criarPaciente(data: PacienteRequest): Observable<Paciente> {
    return this.http.post<Paciente>(`${this.base}/cadastro/pacientes`, data);
  }

  /**
   * Atualiza os dados de um paciente existente.
   * CORREÇÃO: método inexistente — pacientes.component.ts chamava este método
   * mas ele não existia, fazendo a edição nunca persistir no banco.
   *
   * Chama: PUT /paciente/{id}
   * Backend: PacienteController.updatePaciente() → PacienteService.updatePaciente()
   */
  atualizarPaciente(id: number, data: PacienteRequest): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.base}/cadastro/pacientes/${id}`, data);
  }

  inativarPaciente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/cadastro/pacientes/${id}`);
  }

  // ── MEDICAMENTOS ───────────────────────────────────────────────────────────

  getMedicamentos(): Observable<Medicamento[]> {
    return this.http
      .get<any[]>(`${this.base}/farmacia/medicamentos`)
      .pipe(map((list) => list.map((item) => this.adaptMedicamento(item))));
  }

  criarMedicamento(data: MedicamentoRequest): Observable<Medicamento> {
    return this.http
      .post<any>(`${this.base}/farmacia/medicamentos`, data)
      .pipe(map((item) => this.adaptMedicamento(item)));
  }

  atualizarMedicamento(data: MedicamentoRequest & { id?: number }): Observable<Medicamento> {
    return this.http
      .put<any>(`${this.base}/farmacia/medicamentos/${data.id}`, data)
      .pipe(map((item) => this.adaptMedicamento(item)));
  }

  toggleMedicamento(id: number, status: "ATIVO" | "INATIVO"): Observable<void | Medicamento> {
    if (status === "ATIVO") {
      return this.http.delete<void>(`${this.base}/farmacia/medicamentos/${id}`);
    }

    return this.http
      .patch<any>(`${this.base}/farmacia/medicamentos/${id}/ativar`, {})
      .pipe(map((item) => this.adaptMedicamento(item)));
  }

  // ── ATENDIMENTOS ───────────────────────────────────────────────────────────

  getAtendimentos(): Observable<Atendimento[]> {
    return this.http
      .get<any[]>(`${this.base}/atendimento/atendimentos`)
      .pipe(map((list) => list.map((item) => this.adaptAtendimento(item))));
  }

  // criarAtendimento(data: AtendimentoRequest): Observable<Atendimento> {
  //   const payload = {
  //     pacienteId: data.pacienteId,
  //     profissionalId: data.profissionalId,
  //     descricao: data.sintomas ?? data.descricao ?? "",
  //     observacoes: this.encodeAtendimentoDetails(data),
  //     dataAtendimento: data.dataInicio ?? data.dataAtendimento ?? "",
  //     status: data.tipo ?? data.status ?? "CONSULTA",
  //   };

  //   return this.http
  //     .post<any>(`${this.base}/atendimento`, payload)
  //     .pipe(map((item) => this.adaptAtendimento(item)));
  // }

  criarAtendimento(data: AtendimentoRequest): Observable<Atendimento> {
  const payload = {
    pacienteId: data.pacienteId,
    profissionalId: data.profissionalId,
    descricao: data.sintomas ?? data.descricao ?? "",
    observacoes: this.encodeAtendimentoDetails(data),
    dataAtendimento: data.dataInicio ?? data.dataAtendimento ?? "",
    statusAtendimento: data.tipo ?? data.status ?? "CONSULTA",
    medicacoesUsadas: (data.medicacoesUsadas ?? []).map((m) => ({
      medicacaoId: Number(m.medicacaoId),
      medicacaoNome: m.medicacaoNome ?? "",
      quantidade: Number(m.quantidade),
      dosagem: m.dosagem ?? "",
    })),
  };

  return this.http
    .post<any>(`${this.base}/atendimento/atendimentos`, payload)
    .pipe(map((item) => this.adaptAtendimento(item)));
}

  // atualizarAtendimento(data: AtendimentoRequest & { id?: number }): Observable<Atendimento> {
  //   const payload = {
  //     id: data.id,
  //     pacienteId: data.pacienteId,
  //     profissionalId: data.profissionalId,
  //     descricao: data.sintomas ?? data.descricao ?? "",
  //     observacoes: this.encodeAtendimentoDetails(data),
  //     dataAtendimento: data.dataInicio ?? data.dataAtendimento ?? "",
  //     status: data.tipo ?? data.status ?? "CONSULTA",
  //   };

  //   return this.http
  //     .put<any>(`${this.base}/atendimento`, payload)
  //     .pipe(map((item) => this.adaptAtendimento(item)));
  // }

  atualizarAtendimento(data: AtendimentoRequest & { id?: number }): Observable<Atendimento> {
  const payload = {
    id: data.id,
    pacienteId: data.pacienteId,
    profissionalId: data.profissionalId,
    descricao: data.sintomas ?? data.descricao ?? "",
    observacoes: this.encodeAtendimentoDetails(data),
    dataAtendimento: data.dataInicio ?? data.dataAtendimento ?? "",
    statusAtendimento: data.tipo ?? data.status ?? "CONSULTA",
    medicacoesUsadas: (data.medicacoesUsadas ?? []).map((m) => ({
      medicacaoId: Number(m.medicacaoId),
      medicacaoNome: m.medicacaoNome ?? "",
      quantidade: Number(m.quantidade),
      dosagem: m.dosagem ?? "",
    })),
  };

  return this.http
    .put<any>(`${this.base}/atendimento/atendimentos/${data.id}`, payload)
    .pipe(map((item) => this.adaptAtendimento(item)));
}

  // ── PRONTUÁRIOS ────────────────────────────────────────────────────────────

  getProntuarios(): Observable<Prontuario[]> {
    return this.getPacientes().pipe(
      switchMap((pacientes) => {
        if (!pacientes.length) {
          return of([]);
        }

        return forkJoin(
          pacientes.map((paciente) =>
            this.getProntuarioByPacienteId(paciente.id).pipe(catchError(() => of(null)))
          )
        ).pipe(
          map((list) => list.filter((item): item is Prontuario => item !== null))
        );
      })
    );
  }

  getProntuarioById(id: number): Observable<Prontuario> {
    return this.http
      .get<any>(`${this.base}/atendimento/prontuarios/${id}`)
      .pipe(map((item) => this.adaptProntuario(item)));
  }

  getProntuarioByPacienteId(id: number): Observable<Prontuario> {
    return this.http
      .get<any>(`${this.base}/atendimento/prontuarios/paciente/${id}`)
      .pipe(map((item) => this.adaptProntuario(item)));
  }

  // ── REQUISIÇÕES ────────────────────────────────────────────────────────────

  getRequisicoes(): Observable<Requisicao[]> {
    return this.http
      .get<any[]>(`${this.base}/farmacia/requisicoes`)
      .pipe(map((list) => list.map((item) => this.adaptRequisicao(item))));
  }

  createRequisicao(payload: {
    medicacaoId: number;
    quantidade: number;
    tipo: string;
    profissionalId: number;
    data: string;
    observacao?: string;
  }): Observable<Requisicao> {
    return this.http
      .post<any>(`${this.base}/farmacia/requisicoes`, {
        medicamentoId: payload.medicacaoId,
        quantidade: payload.quantidade,
        tipoRequisicao: payload.tipo,
        data: payload.data,
        observacao: payload.observacao,
      })
      .pipe(map((item) => this.adaptRequisicao(item)));
  }

  // ── DASHBOARD / STATUS ─────────────────────────────────────────────────────

  getStatus(): Observable<StatusDashboard> {
    return forkJoin({
      escolas: this.getEscolas().pipe(catchError(() => of([] as Escola[]))),
      unidades: this.getUnidades().pipe(catchError(() => of([] as Unidade[]))),
      profissionais: this.getProfissionais().pipe(catchError(() => of([] as ProfissionalSaude[]))),
      pacientes: this.getPacientes().pipe(catchError(() => of([] as Paciente[]))),
      atendimentos: this.getAtendimentos().pipe(catchError(() => of([] as Atendimento[]))),
      medicamentos: this.getMedicamentos().pipe(catchError(() => of([] as Medicamento[]))),
      requisicoes: this.getRequisicoes().pipe(catchError(() => of([] as Requisicao[]))),
    }).pipe(
      map(({ escolas, unidades, profissionais, pacientes, atendimentos, medicamentos, requisicoes }) => ({
        totalEscolasAtivas: escolas.filter((item) => item.status === "ATIVO").length,
        totalUnidadesAtivas: unidades.filter((item) => item.status === "ATIVO").length,
        totalPacientes: pacientes.length,
        totalAtendimentos: atendimentos.length,
        totalProfissionais: profissionais.length,
        totalMedicacoes: medicamentos.length,
        totalMedicacoesAtivas: medicamentos.filter((item) => item.status === "ATIVO").length,
        totalEstoqueBaixo: medicamentos.filter((item) => item.estoque > 0 && item.estoque < 20).length,
        totalMedicacoesVencidas: medicamentos.filter((item) => !!item.validade && item.validade < new Date().toISOString().split("T")[0]).length,
        totalRequisicoes: requisicoes.length,
      }))
    );
  }
}
