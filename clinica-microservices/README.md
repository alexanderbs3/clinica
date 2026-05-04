# Clínica Médica — Arquitetura de Microsserviços

Migração do monólito `clinica-es-main` para uma arquitetura de microsserviços com Spring Boot 3.4, RabbitMQ e API Gateway.

## Arquitetura

```
                    ┌─────────────────┐
   Frontend/        │   API Gateway   │  :8080
   Postman ────────►│  (Spring Cloud) │
                    └────────┬────────┘
                             │ valida JWT → propaga X-User-Id / X-User-Role
            ┌────────────────┼────────────────────┐
            │                │                    │
     ┌──────▼──────┐  ┌──────▼──────┐   ┌────────▼──────┐
     │  ms-cadastro│  │ms-atendimento│   │  ms-farmacia  │
     │    :8082    │  │    :8083    │   │    :8084      │
     └──────┬──────┘  └──────┬──────┘   └───────┬───────┘
            │                │                   │
     ┌──────▼──────┐         │         ┌─────────▼──────┐
     │  postgres   │  ┌──────▼──────┐  │   postgres     │
     │  (cadastro) │  │  postgres   │  │   (farmacia)   │
     └─────────────┘  │ (atendimento│  └────────────────┘
                      └─────────────┘

     ┌────────────────────────────────────────────────────┐
     │                   RabbitMQ                         │
     │  paciente.criado ──► ms-atendimento (prontuário)  │
     │  uso.medicacao   ──► ms-farmacia   (estoque)      │
     └────────────────────────────────────────────────────┘

     ┌─────────────┐
     │   ms-auth   │  :8081  (Login + JWT — acessado diretamente via gateway)
     │  postgres   │
     └─────────────┘
```

## Bounded Contexts

| Serviço | Porta | Responsabilidade | Banco |
|---|---|---|---|
| **api-gateway** | 8080 | Roteamento + validação JWT | — |
| **ms-auth** | 8081 | Login, registro, emissão JWT | `clinica_auth` |
| **ms-cadastro** | 8082 | Pacientes, Profissionais, Escolas, Unidades | `clinica_cadastro` |
| **ms-atendimento** | 8083 | Atendimentos, Prontuários | `clinica_atendimento` |
| **ms-farmacia** | 8084 | Medicamentos, Requisições, Uso | `clinica_farmacia` |

## Decisões arquiteturais

### Por que Database per Service?
Cada microsserviço tem seu próprio banco PostgreSQL. Isso garante **isolamento de deploy**, permite escalar cada serviço de forma independente e evita o acoplamento de schema — padrão essencial em arquiteturas distribuídas.

### Por que JWT no Gateway e não em cada serviço?
O API Gateway valida o JWT uma única vez e propaga a identidade como headers internos (`X-User-Id`, `X-User-Role`). Os serviços downstream confiam nestes headers sem reprocessar o token — eliminando a necessidade de `spring-boot-starter-security` em cada MS, reduzindo complexidade e latência.

### Por que Choreography Saga com RabbitMQ?
- `paciente.criado` → ms-atendimento cria o prontuário automaticamente (sem chamada HTTP síncrona)
- `uso.medicacao` → ms-farmacia baixa o estoque e registra o uso

Essa abordagem garante **consistência eventual** sem acoplamento síncrono, com idempotência nos consumers para tolerância a redeliveries.

### Por que não Feign/RestTemplate entre serviços?
No design atual, a comunicação cross-service é totalmente assíncrona via RabbitMQ. Isso evita o problema de **cascading failures** — se ms-farmacia estiver fora, ms-atendimento continua funcionando e o evento fica na fila.

## Endpoints principais (via gateway :8080)

### Auth (público)
```
POST /auth/login         → { token }
POST /auth/register      → 201
```

### Cadastro (requer JWT)
```
POST   /cadastro/pacientes          → cria paciente + dispara evento prontuário
GET    /cadastro/pacientes          → lista pacientes do profissional autenticado
GET    /cadastro/pacientes/{id}
DELETE /cadastro/pacientes/{id}     → inativa

POST   /cadastro/profissionais      → cria perfil profissional
GET    /cadastro/profissionais/me   → perfil do usuário autenticado
GET    /cadastro/profissionais
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
DELETE /farmacia/medicamentos/{id}  → inativa

POST   /farmacia/requisicoes
GET    /farmacia/requisicoes
```

## Como rodar

```bash
# 1. Configure o ambiente
cp .env.example .env
# Edite .env com suas senhas

# 2. Suba toda a stack
docker-compose up --build

# 3. Aguarde os serviços iniciarem (~30s)
# RabbitMQ Management: http://localhost:15672

# 4. Primeiro acesso
POST http://localhost:8080/auth/login
{ "username": "admin", "password": "admin123" }
```

## Estrutura do projeto

```
clinica-microservices/
├── api-gateway/          ← Spring Cloud Gateway + JWT filter
├── ms-auth/              ← Autenticação + usuários
├── ms-cadastro/          ← Pacientes + profissionais + escolas
├── ms-atendimento/       ← Atendimentos + prontuários
├── ms-farmacia/          ← Medicamentos + estoque + requisições
├── docker-compose.yml    ← Stack completa
├── .env.example
└── README.md
```
