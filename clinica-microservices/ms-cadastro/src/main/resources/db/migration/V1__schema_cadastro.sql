CREATE TABLE escola (
    id          BIGSERIAL    PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    ies         VARCHAR(255),
    coordenador VARCHAR(255),
    status      VARCHAR(20)  NOT NULL DEFAULT 'ATIVO'
);

CREATE TABLE unidade (
    id          BIGSERIAL    PRIMARY KEY,
    nome        VARCHAR(255) NOT NULL,
    ies         VARCHAR(255),
    responsavel VARCHAR(255),
    status      VARCHAR(20)  NOT NULL DEFAULT 'ATIVO'
);

CREATE TABLE profissional_saude (
    id                BIGSERIAL    PRIMARY KEY,
    nome              VARCHAR(255) NOT NULL,
    formacao          VARCHAR(255),
    especialidade     VARCHAR(255),
    conselho          VARCHAR(255),
    numero_registro   VARCHAR(255),
    dias_atendimento  VARCHAR(255),
    turnos_atendimento VARCHAR(255),
    data_cadastro     DATE,
    status            VARCHAR(20)  NOT NULL DEFAULT 'ATIVO',
    usuario_id        BIGINT UNIQUE,
    cadastro_completo BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE paciente (
    id               BIGSERIAL    PRIMARY KEY,
    nome             VARCHAR(255) NOT NULL,
    email            VARCHAR(255),
    telefone         VARCHAR(20),
    status           VARCHAR(20)  NOT NULL DEFAULT 'ATIVO',
    categoria_paciente VARCHAR(50) NOT NULL,
    vinculo_paciente VARCHAR(50)  NOT NULL,
    vinculo_nome     VARCHAR(255),
    profissional_id  BIGINT       NOT NULL REFERENCES profissional_saude(id),
    escola_id        BIGINT       REFERENCES escola(id),
    unidade_id       BIGINT       REFERENCES unidade(id)
);
