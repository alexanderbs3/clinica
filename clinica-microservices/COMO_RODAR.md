# Como rodar o projeto

## ⚠️ IMPORTANTE — Limpar o cache do Docker antes de buildar

O Docker cacheia layers de build anteriores. Se você já tentou buildar antes,
execute os comandos abaixo para limpar tudo e garantir um build limpo:

```bash
# Parar e remover todos os containers do projeto
docker compose down -v

# Remover as imagens buildadas anteriormente (força rebuild completo)
docker rmi $(docker images | grep -E 'clinica-microservices|ms-auth|ms-cadastro|ms-atendimento|ms-farmacia|api-gateway' | awk '{print $3}') 2>/dev/null || true

# Build sem cache e subir
docker compose build --no-cache
docker compose up -d
```

## Rodando pela primeira vez (sem cache anterior)

```bash
cd clinica-microservices   # raiz do projeto, onde está o docker-compose.yml
docker compose up --build -d
```

## Verificar se todos subiram

```bash
docker compose ps
docker compose logs -f   # acompanhar logs
```

## Primeiro acesso

```bash
POST http://localhost:8080/auth/login
Content-Type: application/json

{ "username": "admin", "password": "admin123" }
```
