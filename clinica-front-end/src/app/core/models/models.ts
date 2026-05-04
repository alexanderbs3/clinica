export type Status = "ATIVO" | "INATIVO";
export type Role = "ADMINISTRADOR" | "PROFISSIONAL_SAUDE";
export type VinculoPaciente = "ESCOLA" | "UNIDADE" | "REITORIA";
export type ArmazenamentoMedicacao = "REFRIGERACAO" | "TEMPERATURA_AMBIENTE";

export interface Usuario {
  id: number;
  username: string;
  password?: string;
  role: Role;
}

export interface Escola {
  id: number;
  nome: string;
  coordenador: string;
  ies: string;
  status: Status;
}

export interface Unidade {
  id: number;
  nome: string;
  responsavel: string;
  ies: string;
  status: Status;
}

export type CategoriasPaciente =
  | "ALUNO"
  | "COLABORADOR_UNIDADE"
  | "COLABORADOR_ESCOLA"
  | "EXTERNO";

export interface Paciente {
  id: number;
  nome: string;
  categoria: CategoriasPaciente;
  vinculoTipo: VinculoPaciente;
  vinculoNome: string;
  escolaId?: number;
  unidadeId?: number;
  email: string;
  telefone: string;
  status: Status;
  prontuarioId?: number;
}

export type TipoAtendimento =
  | "URGENCIA"
  | "EMERGENCIA"
  | "CONSULTA"
  | "REVISAO";

export interface Atendimento {
  id: number;
  pacienteId: number;
  pacienteNome?: string;
  profissionalId: number;
  profissionalNome?: string;
  dataInicio: string;
  dataFim?: string;
  sintomas: string;
  diagnostico: string;
  tratamento: string;
  tipo: TipoAtendimento;
  medicacoesUsadas?: UsoMedicacao[];
}

export interface UsoMedicacao {
  medicacaoId: number;
  medicacaoNome?: string;
  quantidade: number;
  dosagem: string;
}

export interface Prontuario {
  id: number;
  pacienteId: number;
  pacienteNome?: string;
  atendimentos: Atendimento[];
}

export interface ProfissionalSaude {
  id: number;
  nome: string;
  username: string;
  usuarioId?: number;
  formacao: string;
  conselho: string;
  especialidade: string;
  numeroRegistro: string;
  diasAtendimento: string;
  turnosAtendimento: string;
  dataCadastro: string;
  status: Status;
  cadastroCompleto: boolean;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface Medicacao {
  id: number;
  nome: string;
  descricao: string;
  fornecedor: string;
  armazenamento: ArmazenamentoMedicacao;
  estoque: number;
  unidadeMedida: string;
  dataAquisicao: string;
  validade: string;
  status: Status;
}

export type TipoRequisicao = "ENTRADA" | "SAIDA";

export interface RequisicaoMedicacao {
  id: number;
  medicacaoId: number;
  medicacaoNome?: string;
  quantidade: number;
  tipo: TipoRequisicao;
  profissionalId: number;
  data: string;
  observacao?: string;
}
export interface StatusDashboard {
  totalEscolasAtivas?: number;
  totalUnidadesAtivas?: number;
  totalPacientes: number;
  totalAtendimentos: number;
  totalProfissionais: number;
  totalMedicacoes: number;
  totalMedicacoesAtivas?: number;
  totalEstoqueBaixo?: number;
  totalMedicacoesVencidas?: number;
  totalRequisicoes: number;
}

export type Medicamento = Medicacao;
export type Requisicao = RequisicaoMedicacao;
