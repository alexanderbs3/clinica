CREATE TABLE prontuario (
    id             BIGSERIAL PRIMARY KEY,
    paciente_id    BIGINT    NOT NULL UNIQUE,
    nome_paciente  VARCHAR(255),
    profissional_id BIGINT
);

CREATE TABLE atendimento (
    id                 BIGSERIAL    PRIMARY KEY,
    prontuario_id      BIGINT       NOT NULL REFERENCES prontuario(id),
    profissional_id    BIGINT       NOT NULL,
    paciente_id        BIGINT       NOT NULL,
    descricao          TEXT,
    observacoes        TEXT,
    data_atendimento   VARCHAR(50),
    status_atendimento VARCHAR(50)
);
