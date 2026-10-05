--
-- PostgreSQL database dump
--

\restrict yiUtX3dd8ahDoe0zrAhFhwhE3UD3RXaB9BoIuKleC9SGfUGXK9fYsHXE5gLJzJ8

-- Dumped from database version 18.6 (Debian 18.6-1.pgdg13+2)
-- Dumped by pg_dump version 18.6 (Debian 18.6-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO admin;

--
-- Name: contratos; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.contratos (
    id integer NOT NULL,
    locatario_id integer NOT NULL,
    imovel_id integer NOT NULL,
    data_inicio date NOT NULL,
    data_fim date,
    valor numeric(10,2) NOT NULL,
    status boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    arquivo_pdf character varying(500) DEFAULT NULL::character varying
);


ALTER TABLE public.contratos OWNER TO admin;

--
-- Name: contratos_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

ALTER TABLE public.contratos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contratos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: imoveis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.imoveis (
    id integer NOT NULL,
    locador_id integer NOT NULL,
    endereco character varying(255) NOT NULL,
    numero character varying(20),
    status boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.imoveis OWNER TO postgres;

--
-- Name: imoveis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.imoveis ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.imoveis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: locador; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locador (
    id integer NOT NULL,
    nome_locador character varying(150) NOT NULL,
    tel_locador character varying(20) NOT NULL,
    rua_locador character varying(150),
    bairro_locador character varying(150),
    cep_locador character varying(10),
    cpf_locador character varying(14) NOT NULL,
    rg_locador character varying(20),
    uf_locador character(2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.locador OWNER TO postgres;

--
-- Name: locador_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.locador ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.locador_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: locatarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locatarios (
    id integer NOT NULL,
    nome_locatario character varying(150) NOT NULL,
    tel_locatario character varying(20) NOT NULL,
    rua_locatario character varying(150),
    bairro_locatario character varying(150),
    cep_locatario character varying(10),
    cpf_locatario character varying(20) NOT NULL,
    rg_locatario character varying(100),
    uf_locatario character(2),
    create_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.locatarios OWNER TO postgres;

--
-- Name: locatarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.locatarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.locatarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: recebimentos; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.recebimentos (
    id integer NOT NULL,
    contrato_id integer NOT NULL,
    data_vencimento date NOT NULL,
    data_pagamento date,
    valor_cobrado numeric(10,2) NOT NULL,
    valor_recebido numeric(10,2),
    status character varying(20) DEFAULT 'pendente'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    numero_recibo character varying(50),
    comprovante character varying(255)
);


ALTER TABLE public.recebimentos OWNER TO admin;

--
-- Name: COLUMN recebimentos.comprovante; Type: COMMENT; Schema: public; Owner: admin
--

COMMENT ON COLUMN public.recebimentos.comprovante IS 'Caminho do arquivo do comprovante de pagamento';


--
-- Name: recebimentos_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

ALTER TABLE public.recebimentos ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.recebimentos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    senha character varying(255) NOT NULL,
    status boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260828203104-add-numero-recibo-to-recebimentos.js
20260909012605-add-arquivo-pdf-to-contratos.js
20260909222300-add-comprovante-to-recebimentos.cjs
\.


--
-- Data for Name: contratos; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.contratos (id, locatario_id, imovel_id, data_inicio, data_fim, valor, status, created_at, arquivo_pdf) FROM stdin;
3	3	3	2025-12-16	2026-12-16	600.00	t	2026-08-28 21:39:57.505	\N
4	4	4	2026-05-08	2027-05-08	780.00	t	2026-08-28 21:44:13.146	\N
1	1	1	2025-12-05	2026-12-05	600.00	t	2026-08-28 21:12:47.606	\N
2	2	2	2026-01-20	2027-01-20	600.00	t	2026-08-28 21:34:55.451	\N
\.


--
-- Data for Name: imoveis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.imoveis (id, locador_id, endereco, numero, status, created_at) FROM stdin;
4	2	Residencial Belo Jardim 1 Rua Napolis 	254	t	2026-08-28 21:42:09.043
1	2	Residencial Belo Jardim 1 Rua Firense	254B	t	2026-08-28 21:07:55.739
3	2	Residencial Belo Jardim 1 Rua Napolis	328C	t	2026-08-28 21:37:33.085
2	2	Residencial Belo Jardim 1 Rua Napolis	328B	t	2026-08-28 21:33:52.386
\.


--
-- Data for Name: locador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locador (id, nome_locador, tel_locador, rua_locador, bairro_locador, cep_locador, cpf_locador, rg_locador, uf_locador, created_at) FROM stdin;
2	João Victor Reis De Lima	99999999999	Firenze	Centro	00111222	12121212121112	1212121	PA	2026-08-28 21:04:43.232
\.


--
-- Data for Name: locatarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locatarios (id, nome_locatario, tel_locatario, rua_locatario, bairro_locatario, cep_locatario, cpf_locatario, rg_locatario, uf_locatario, create_at) FROM stdin;
3	Jeferson Da Silva	(11) 11111-1111	Residencial Belo Jardim 1 Rua Napolis 328B	Centro	68795-000	011.289.826-99	6564936	PA	2026-08-28 21:39:15.99543
4	Kelvilene Nascimento Oliveira	(11) 11111-1111	Residencial Belo Jardim 1 Rua Napolis 254	Centro	68795-000	076.564.932-20	8549600	PA	2026-08-28 21:43:28.616431
2	Claudemir	(11) 11111-1111	Residencial Belo Jardim 1 Rua Napolis	Centro	68795-000	009.977.372-47	1117610	PA	2026-08-28 21:32:50.715843
1	Rayane	(11) 11111-1111	Napolis	Centro	11111-111	111.111.111-11	111111	PA	2026-08-28 20:58:24.807988
\.


--
-- Data for Name: recebimentos; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.recebimentos (id, contrato_id, data_vencimento, data_pagamento, valor_cobrado, valor_recebido, status, created_at, numero_recibo, comprovante) FROM stdin;
3	3	2026-08-16	2026-08-13	600.00	600.00	pago	2026-08-28 21:40:46.562	32	\N
4	4	2026-08-08	2026-08-10	780.00	780.00	pago	2026-08-28 21:45:12.007	4	\N
7	3	2026-09-16	2026-09-07	600.00	600.00	pago	2026-09-11 02:13:11.017	33	\N
6	4	2026-09-08	2026-09-08	780.00	790.00	pago	2026-09-11 02:09:01.142	5	\N
2	2	2026-08-20	2026-08-10	600.00	600.00	pago	2026-08-28 21:35:46.871	8	\N
9	2	2026-09-20	2026-09-08	600.00	600.00	pago	2026-09-11 02:15:50.489	9	\N
8	1	2026-09-05	2026-09-10	600.00	600.00	pago	2026-09-11 02:14:42.2	19	\N
1	1	2026-08-05	2026-08-10	600.00	600.00	pago	2026-08-28 21:13:53.248	18	\N
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, email, senha, status, created_at) FROM stdin;
1	joaolima@gmail.com	$2b$10$tlYAmUdMCzIDXOUKj2DUweD1N5Iobn484mNecEgnqfYxRACQszlq.	t	2026-08-20 00:41:08.305
5	vicotrreislima134@gmail.com	$2b$10$EmZeJhooEC53BAnaYJ9/wu1lFNudYs9oLYmIfSPVbofqJjGpXxawO	t	2026-08-31 03:14:09.79
\.


--
-- Name: contratos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.contratos_id_seq', 4, true);


--
-- Name: imoveis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.imoveis_id_seq', 6, true);


--
-- Name: locador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locador_id_seq', 3, true);


--
-- Name: locatarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locatarios_id_seq', 5, true);


--
-- Name: recebimentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.recebimentos_id_seq', 9, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 5, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: contratos contratos_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT contratos_pkey PRIMARY KEY (id);


--
-- Name: imoveis imoveis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imoveis
    ADD CONSTRAINT imoveis_pkey PRIMARY KEY (id);


--
-- Name: locador locador_cpf_locador_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locador
    ADD CONSTRAINT locador_cpf_locador_key UNIQUE (cpf_locador);


--
-- Name: locador locador_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locador
    ADD CONSTRAINT locador_pkey PRIMARY KEY (id);


--
-- Name: locador locador_rg_locador_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locador
    ADD CONSTRAINT locador_rg_locador_key UNIQUE (rg_locador);


--
-- Name: locatarios locatarios_cpf_locatario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locatarios
    ADD CONSTRAINT locatarios_cpf_locatario_key UNIQUE (cpf_locatario);


--
-- Name: locatarios locatarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locatarios
    ADD CONSTRAINT locatarios_pkey PRIMARY KEY (id);


--
-- Name: locatarios locatarios_rg_locatario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locatarios
    ADD CONSTRAINT locatarios_rg_locatario_key UNIQUE (rg_locatario);


--
-- Name: recebimentos recebimentos_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recebimentos
    ADD CONSTRAINT recebimentos_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: contratos fk_contrato_imovel; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT fk_contrato_imovel FOREIGN KEY (imovel_id) REFERENCES public.imoveis(id);


--
-- Name: contratos fk_contrato_locatario; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.contratos
    ADD CONSTRAINT fk_contrato_locatario FOREIGN KEY (locatario_id) REFERENCES public.locatarios(id);


--
-- Name: imoveis fk_imovel_locador; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.imoveis
    ADD CONSTRAINT fk_imovel_locador FOREIGN KEY (locador_id) REFERENCES public.locador(id) ON DELETE CASCADE;


--
-- Name: recebimentos fk_recebimento_contrato; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.recebimentos
    ADD CONSTRAINT fk_recebimento_contrato FOREIGN KEY (contrato_id) REFERENCES public.contratos(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO admin;


--
-- Name: TABLE imoveis; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.imoveis TO admin;


--
-- Name: SEQUENCE imoveis_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.imoveis_id_seq TO admin;


--
-- Name: TABLE locador; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.locador TO admin;


--
-- Name: SEQUENCE locador_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.locador_id_seq TO admin;


--
-- Name: TABLE locatarios; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.locatarios TO admin;


--
-- Name: SEQUENCE locatarios_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.locatarios_id_seq TO admin;


--
-- Name: TABLE usuarios; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.usuarios TO admin;


--
-- Name: SEQUENCE usuarios_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.usuarios_id_seq TO admin;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO admin;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO admin;


--
-- PostgreSQL database dump complete
--

\unrestrict yiUtX3dd8ahDoe0zrAhFhwhE3UD3RXaB9BoIuKleC9SGfUGXK9fYsHXE5gLJzJ8

