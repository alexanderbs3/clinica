# 🏥 Clínica Médica — Sistema Completo

> Sistema de gestão clínica full-stack com arquitetura de microsserviços. Backend em Java 21 / Spring Boot com comunicação assíncrona via RabbitMQ e frontend Angular 17 com controle de acesso por perfil.

<div align="center">

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 📁 Estrutura do Repositório

```
clinica/
├── clinica-microservices/     ← Backend (Spring Boot, RabbitMQ, PostgreSQL)
│   ├── api-gateway/           ← Spring Cloud Gateway + validação JWT
│   ├── ms-auth/               ← Autenticação e emissão de tokens
│   ├── ms-cadastro/           ← Pacientes, profissionais, escolas, unidades
│   ├── ms-atendimento/        ← Atendimentos e prontuários
│   ├── ms-farmacia/           ← Medicamentos, requisições e estoque
│   └── docker-compose.yml     ← Stack completa de infraestrutura
│
└── clinica-front-end/         ← Frontend (Angular 17, TypeScript, SCSS)
    └── src/app/
        ├── features/admin/    ← Dashboard, escolas, medicações, profissionais…
        └── features/profissional/ ← Pacientes, atendimentos, prontuários…
```

---

## 🏛️ Arquitetura Geral

```
┌──────────────────────────────────────────────────────────────┐
│                    clinica-front-end                         │
│              Angular 17 · TypeScript · SCSS                  │
│  Auth Guard · HTTP Interceptor · Perfis: Admin / Profissional│
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTP (JWT Bearer)
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                     api-gateway :8080                        │
│          Spring Cloud Gateway · Valida JWT · Propaga         │
│               X-User-Id / X-User-Role headers                │
└────┬──────────────┬──────────────┬──────────────┬────────────┘
     │              │              │              │
     ▼              ▼              ▼              ▼
 ms-auth        ms-cadastro   ms-atendimento  ms-farmacia
  :8081           :8082           :8083          :8084
 postgres        postgres        postgres       postgres
(clinica_auth) (clinica_cad.) (clinica_ate.) (clinica_far.)

     └────────────── RabbitMQ ──────────────────┘
        paciente.criado ──► ms-atendimento (cria prontuário)
        uso.medicacao   ──► ms-farmacia   (baixa estoque)
```

---

## 🔧 Stack Tecnológica

### Backend — `clinica-microservices`

| Camada | Tecnologia |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 3.4 |
| API Gateway | Spring Cloud Gateway |
| Segurança | Spring Security + JWT (JJWT) |
| Mensageria | RabbitMQ 3 (Choreography Saga) |
| Persistência | Spring Data JPA + Flyway |
| Banco de dados | PostgreSQL 16 (Database per Service) |
| Containerização | Docker + Docker Compose |

### Frontend — `clinica-front-end`

| Camada | Tecnologia |
|---|---|
| Framework | Angular 17 (Standalone Components) |
| Linguagem | TypeScript |
| Estilo | SCSS (design system próprio) |
| HTTP | HttpClient + Interceptor JWT |
| Roteamento | Angular Router com Auth Guard |
| Build | Vite + Angular CLI |

---

## 🔑 Decisões Arquiteturais

### Database per Service
Cada microsserviço possui seu próprio banco PostgreSQL (`clinica_auth`, `clinica_cadastro`, `clinica_atendimento`, `clinica_farmacia`). Isso garante isolamento de deploy, escalabilidade independente e elimina acoplamento de schema — padrão essencial em arquiteturas distribuídas.

### JWT validado centralmente no Gateway
O API Gateway valida o token JWT uma única vez e propaga a identidade como headers internos (`X-User-Id`, `X-User-Role`). Os microsserviços downstream confiam nesses headers sem reprocessar o token, eliminando a necessidade de `spring-boot-starter-security` em cada serviço e reduzindo latência.

### Choreography Saga via RabbitMQ
Comunicação cross-service 100% assíncrona — sem chamadas HTTP entre microsserviços:
- `paciente.criado` → ms-atendimento cria o prontuário automaticamente
- `uso.medicacao` → ms-farmacia baixa o estoque e registra o uso

Isso garante **consistência eventual** sem acoplamento síncrono e elimina cascading failures: se ms-farmacia estiver fora, ms-atendimento continua funcionando e o evento aguarda na fila.

### Controle de acesso por perfil no frontend
O Angular usa `AuthGuard` + `Auth Interceptor` para proteger rotas e injetar automaticamente o Bearer token em cada requisição. As views de `admin` e `profissional` são completamente separadas por perfil de acesso.

---

## 🚀 Como Rodar

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 18+ e Angular CLI (para o frontend)

### 1. Subir o Backend

```bash
cd clinica-microservices

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas senhas

# Suba toda a stack (gateway + 4 microsserviços + 4 bancos + RabbitMQ)
docker-compose up --build

# Aguarde ~30 segundos para todos os serviços iniciarem
# RabbitMQ Management: http://localhost:15672
```

### 2. Subir o Frontend

```bash
cd clinica-front-end

npm install
ng serve

# Frontend disponível em http://localhost:4200
```

### 3. Primeiro acesso

```bash
# Registrar usuário
POST http://localhost:8080/auth/register

# Fazer login
POST http://localhost:8080/auth/login
# Retorna: { "token": "eyJ..." }

# Usar o token nas próximas requisições:
# Authorization: Bearer <token>
```

---

## 🗺️ Endpoints (via Gateway :8080)

### Auth (público)
```
POST /auth/login
POST /auth/register
```

### Cadastro (requer JWT)
```
POST   /cadastro/pacientes
GET    /cadastro/pacientes
GET    /cadastro/pacientes/{id}
DELETE /cadastro/pacientes/{id}

POST   /cadastro/profissionais
GET    /cadastro/profissionais
GET    /cadastro/profissionais/me
PUT    /cadastro/profissionais/complemento
```

### Atendimento (requer JWT)
```
POST   /atendimento/atendimentos
GET    /atendimento/atendimentos
GET    /atendimento/atendimentos/{id}
PUT    /atendimento/atendimentos/{id}

GET    /atendimento/prontuarios/paciente/{pacienteId}
```

### Farmácia (requer JWT)
```
POST   /farmacia/medicamentos
GET    /farmacia/medicamentos
GET    /farmacia/medicamentos/{id}
PUT    /farmacia/medicamentos/{id}
DELETE /farmacia/medicamentos/{id}

POST   /farmacia/requisicoes
GET    /farmacia/requisicoes
```

---

## 📱 Telas do Frontend

| Perfil | Tela | Descrição |
|---|---|---|
| Ambos | Login | Autenticação com redirecionamento por perfil |
| Admin | Dashboard | Visão geral do sistema |
| Admin | Profissionais | Gerenciamento de profissionais de saúde |
| Admin | Escolas | Cadastro de escolas vinculadas |
| Admin | Unidades | Unidades de atendimento |
| Admin | Medicações | Gestão do estoque farmacêutico |
| Admin | Relatórios | Relatórios consolidados |
| Profissional | Pacientes | Cadastro e gerenciamento de pacientes |
| Profissional | Atendimentos | Registro de atendimentos clínicos |
| Profissional | Prontuários | Histórico clínico por paciente |
| Profissional | Requisições | Solicitações de medicamentos |
| Profissional | Meu Cadastro | Perfil e dados do profissional |

---

## 📂 READMEs específicos

Cada subprojeto possui documentação detalhada própria:

- [`clinica-microservices/README.md`](./clinica-microservices/README.md) — arquitetura detalhada do backend, payloads, migrations e decisões técnicas
- [`clinica-front-end/README.md`](./clinica-front-end/README.md) — estrutura de componentes, serviços, guards e como rodar o frontend

---

## 👤 Autor

**Alexander Costa**

[![GitHub](https://img.shields.io/badge/GitHub-alexanderbs3-181717?style=flat&logo=github)](https://github.com/alexanderbs3)
