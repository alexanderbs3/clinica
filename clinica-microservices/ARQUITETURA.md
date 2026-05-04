# Clínica Médica — Arquitetura de Microsserviços

## Bounded Contexts Identificados

| Microsserviço | Domínio | Responsabilidade |
|---|---|---|
| **ms-auth** | Identidade | Login, JWT, gerenciamento de usuários |
| **ms-cadastro** | Cadastro | Pacientes, Profissionais, Escolas, Unidades |
| **ms-atendimento** | Clínico | Atendimentos, Prontuários |
| **ms-farmacia** | Farmácia | Medicamentos, Requisições, Uso de Medicação |
| **api-gateway** | Infraestrutura | Roteamento, autenticação centralizada |

## Comunicação entre Serviços

```
Frontend
   │
   ▼
api-gateway :8080
   ├── /auth/**         → ms-auth :8081
   ├── /cadastro/**     → ms-cadastro :8082
   ├── /atendimento/**  → ms-atendimento :8083
   └── /farmacia/**     → ms-farmacia :8084

Comunicação assíncrona (RabbitMQ):
  ms-cadastro  ──[paciente.criado]──►  ms-atendimento  (cria prontuário)
  ms-atendimento ──[uso.medicacao]──►  ms-farmacia     (baixa estoque)
```

## Decisões Arquiteturais

- **Banco por serviço** (Database per Service): cada MS tem seu próprio schema PostgreSQL
- **JWT validado no gateway**: os serviços downstream confiam no header X-User-Id/X-User-Role
- **Choreography Saga** via RabbitMQ para eventos cross-service
- **Comunicação síncrona** via RestTemplate/OpenFeign apenas para leituras que precisam de consistência imediata
