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
    cep_locatario VARCHAR(10),
    cpf_locatario VARCHAR(20),
    rg_locatario VARCHAR(100),
    uf_locatario CHAR(2),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

