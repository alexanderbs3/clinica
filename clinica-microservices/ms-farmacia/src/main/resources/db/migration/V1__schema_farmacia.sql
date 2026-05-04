CREATE TABLE medicamento (
    id             BIGSERIAL    PRIMARY KEY,
    nome           VARCHAR(255) NOT NULL,
    descricao      TEXT,
    quantidade     BIGINT       NOT NULL DEFAULT 0,
    unidade_medida VARCHAR(100) NOT NULL,
    validade       DATE,
    ativo          BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE requisicao_medicacao (
    id              BIGSERIAL    PRIMARY KEY,
    medicamento_id  BIGINT       NOT NULL REFERENCES medicamento(id),
    quantidade      BIGINT       NOT NULL,
    tipo_requisicao VARCHAR(20)  NOT NULL,
    profissional_id BIGINT,
    data            VARCHAR(50)  NOT NULL,
    observacao      TEXT
);

CREATE TABLE uso_medicacao (
    id             BIGSERIAL PRIMARY KEY,
    medicamento_id BIGINT    NOT NULL REFERENCES medicamento(id),
    atendimento_id BIGINT    NOT NULL,
    paciente_id    BIGINT    NOT NULL,
    quantidade     BIGINT    NOT NULL
);
