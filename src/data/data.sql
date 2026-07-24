-- CREATE TABLE IF NOT EXISTS usuarios(
--     id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     email TEXT NOT NULL,
--     senha TEXT NOT NULL UNIQUE,
--     status BOOLEAN NOT NULL DEFAULT TRUE,
--     create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

CREATE TABLE locatarios(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_locatario VARCHAR(150) NOT NULL,
    tel_locatario VARCHAR(14) NOT NULL,
    rua_locatario VARCHAR(150),
    bairro_locatario VARCHAR(20),
    cep_locatario VARCHAR(10) ,
    cpf_locatario VARCHAR(20)NOT NULL UNIQUE,
    rg_locatario VARCHAR(100)UNIQUE,
    uf_locatario CHAR(2),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE locador (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_locador VARCHAR(150) NOT NULL,
    tel_locador VARCHAR(20) NOT NULL,
    rua_locador VARCHAR(150),
    bairro_locador VARCHAR(150),
    cep_locador VARCHAR(10),
    cpf_locador VARCHAR(14) NOT NULL UNIQUE,
    rg_locador VARCHAR(20) UNIQUE,
    uf_locador CHAR(2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE imoveis (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    locador_id INT NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    numero VARCHAR(20),
    status BOOLEAN DEFAULT TRUE, -- TRUE = Disponível, FALSE = Alugado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_imovel_locador FOREIGN KEY (locador_id) REFERENCES locador(id) ON DELETE CASCADE
);



SELECT conname 
FROM pg_constraint 
WHERE conrelid = 'usuarios'::regclass;

ALTER TABLE usuarios
DROP CONSTRAINT usuarios_senha_key;

WITH reordenado AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS novo_id
  FROM usuarios
)
UPDATE usuarios
SET id = reordenado.novo_id
FROM reordenado
WHERE usuarios.id = reordenado.id;



CREATE TABLE imoveis (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    locador_id INT NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    numero VARCHAR(20),
    status BOOLEAN DEFAULT TRUE, -- TRUE = Disponível, FALSE = Alugado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_imovel_locador FOREIGN KEY (locador_id) REFERENCES locador(id) ON DELETE CASCADE
);

CREATE TABLE contratos (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    locatario_id INT NOT NULL,
    imovel_id INT NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    valor DECIMAL(10, 2) NOT NULL,
    status BOOLEAN DEFAULT TRUE, -- TRUE = Contrato Ativo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contrato_locatario FOREIGN KEY (locatario_id) REFERENCES locatarios(id),
    CONSTRAINT fk_contrato_imovel FOREIGN KEY (imovel_id) REFERENCES imoveis(id)
);

CREATE TABLE recebimentos (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    contrato_id INT NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE, -- Permite NULL. Se for NULL, significa que ainda não foi pago.
    valor_cobrado DECIMAL(10, 2) NOT NULL,
    valor_recebido DECIMAL(10, 2), -- Pode ser diferente do cobrado caso haja juros ou desconto
    status VARCHAR(20) DEFAULT 'pendente', -- Sugestões: 'pendente', 'pago', 'atrasado', 'cancelado'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recebimento_contrato FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE
);