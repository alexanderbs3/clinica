CREATE TABLE usuario (
                         id       BIGSERIAL    PRIMARY KEY,
                         username VARCHAR(255) NOT NULL UNIQUE,
                         password VARCHAR(255) NOT NULL,
                         role     VARCHAR(50)  NOT NULL
);

INSERT INTO usuario (username, password, role)
VALUES ('admin', '$2b$12$o6OMpv7ZhhPKU.i/BIXi5.g4tIqIv/JCMWOx53SaK0Zzeo5VZ4Uw6', 'ADMIN');
-- senha: admin123