# ClinicalES - Frontend

Sistema web desenvolvido em **Angular 17** para o controle de uma clinica medica voltada ao ambiente academico/IES.

Este projeto representa a camada de interface do sistema e se comunica com uma API REST externa para autenticar usuarios e gerenciar:

- escolas
- unidades
- profissionais de saude
- pacientes
- medicamentos
- atendimentos
- prontuarios
- requisicoes
- dashboards e relatorios

O objetivo e oferecer uma interface organizada, responsiva e pronta para uso com um backend real.

## Visao Geral

O frontend foi construido com uma arquitetura baseada em:

- **Angular standalone**
- **Lazy loading por rota**
- **Servicos centralizados para API**
- **Guards de autenticacao e permissao**
- **Interceptor HTTP para envio do token**
- **Modelos tipados em TypeScript**

A aplicacao separa bem as areas de acesso:

- **Administrador**
  - dashboard
  - escolas
  - unidades
  - profissionais
  - medicamentos
  - relatorios

- **Profissional de saude**
  - meu cadastro
  - pacientes
  - atendimentos
  - prontuarios
  - requisicoes

## Tecnologias

- Angular 17
- TypeScript
- SCSS
- RxJS
- Angular Router
- Angular HttpClient
- JWT para autenticacao

## Funcionalidades

### Autenticacao

- login com `username` e `password`
- armazenamento do token no `localStorage`
- restauracao de sessao ao recarregar a pagina
- controle de acesso por perfil

### Area do Administrador

- cadastro, edicao e inativacao de escolas
- cadastro, edicao e inativacao de unidades
- cadastro e inativacao de profissionais
- cadastro, edicao e ativacao/inativacao de medicamentos
- visualizacao de indicadores e relatorios

### Area do Profissional

- atualizacao do proprio cadastro
- listagem e cadastro de pacientes
- cadastro e edicao de atendimentos
- consulta de prontuarios
- emissao de requisicoes de medicamentos

### Integração com a API

O frontend consome a API atraves de `environment.apiUrl`.

Configuracao atual:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

URL padrao:

```ts
apiUrl: "http://localhost:8000";
```

## Rotas da Aplicacao

### Publica

- `/login`

### Admin

- `/admin/dashboard`
- `/admin/escolas`
- `/admin/unidades`
- `/admin/profissionais`
- `/admin/medicacoes`
- `/admin/relatorios`

### Profissional

- `/profissional/meu-cadastro`
- `/profissional/pacientes`
- `/profissional/atendimentos`
- `/profissional/prontuarios`
- `/profissional/requisicoes`

## Requisitos

- Node.js 18+ recomendado
- npm
- Angular CLI 17
- backend da aplicacao rodando em `http://localhost:8000`

## Como Rodar

### 1. Instale as dependencias

```bash
npm install
```

### 2. Inicie o ambiente de desenvolvimento

```bash
npm start
```

ou

```bash
ng serve
```

### 3. Acesse no navegador

```bash
http://localhost:4200
```

## Build de Producao

Para gerar a versao final:

```bash
npm run build
```

O resultado sera gerado em:

```bash
dist/clinica-angular
```

## Estrutura do Projeto

```text
src/
  app/
    core/
      guards/
      interceptors/
      models/
      services/
    features/
      auth/
      admin/
      profissional/
    shared/
      components/
  assets/
    styles/
  environments/
```

### Pastas principais

- `src/app/core`
  - autenticação
  - interceptor
  - models
  - servicos centrais

- `src/app/features`
  - telas da aplicação separadas por dominio

- `src/app/shared`
  - componentes reutilizaveis de layout e UI

- `src/assets/styles`
  - estilos globais e utilitarios visuais

## Fluxo de Autenticacao

1. O usuario acessa a tela de login.
2. O front envia `username` e `password` para `POST /auth/login`.
3. A API retorna um JWT.
4. O token e o usuario sao salvos no `localStorage`.
5. O interceptor adiciona o token nas requisicoes protegidas.
6. Os guards liberam ou bloqueiam o acesso conforme o perfil.

## Modelagem de Dados no Front

Os principais tipos utilizados estao em `src/app/core/models/models.ts`.

Alguns exemplos:

- `Usuario`
- `Escola`
- `Unidade`
- `Paciente`
- `ProfissionalSaude`
- `Medicacao`
- `Atendimento`
- `Prontuario`
- `Requisicao`
- `StatusDashboard`

## Servicos Principais

O acesso a API esta centralizado em:

- `src/app/core/services/api.service.ts`
- `src/app/core/services/auth.service.ts`

Esses servicos cuidam de:

- login e logout
- recuperacao de sessao
- chamadas HTTP para os modulos do sistema
- adaptacao de dados vindos do backend

## Observacoes Tecnicas

- O projeto utiliza componentes **standalone**.
- As rotas carregam as telas de forma preguiçosa quando necessario.
- O token de autenticacao e armazenado no navegador.
- O front depende da API estar online para login e operacoes de CRUD.

## Principais Dependencias

```json
{
  "@angular/animations": "^17.3.0",
  "@angular/common": "^17.3.0",
  "@angular/compiler": "^17.3.0",
  "@angular/core": "^17.3.0",
  "@angular/forms": "^17.3.0",
  "@angular/platform-browser": "^17.3.0",
  "@angular/platform-browser-dynamic": "^17.3.0",
  "@angular/router": "^17.3.0",
  "rxjs": "~7.8.0",
  "zone.js": "~0.14.3"
}
```

## Scripts Disponiveis

```bash
npm start
npm run build
npm run watch
```

- `npm start`: sobe o servidor local
- `npm run build`: gera o build de producao
- `npm run watch`: recompila automaticamente durante desenvolvimento


## Proposito do Projeto

Este frontend foi criado com foco academico e profissional, demonstrando:

- organizacao por modulos
- integracao com backend real
- controle de acesso por perfil
- formulários e CRUDs estruturados
- experiencia de uso limpa e funcional
