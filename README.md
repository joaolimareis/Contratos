# 🏠 Sistema de Gerenciamento de Contratos de Imóveis

## Sobre o projeto

Este projeto nasceu de uma necessidade real: melhorar a organização dos documentos, contratos, informações de imóveis e controle de pagamentos relacionados aos imóveis da minha família.

A ideia foi criar uma solução própria para centralizar essas informações e facilitar o gerenciamento desses dados, evitando a dependência de arquivos espalhados, controles manuais e processos pouco organizados.

Este é um projeto pessoal desenvolvido principalmente como uma forma de aplicar e consolidar meus conhecimentos em desenvolvimento Backend, criando uma aplicação próxima de um cenário real de uso.

---

# 🚀 Primeira versão

Nesta primeira versão, o foco principal foi desenvolver toda a estrutura do Backend, criando uma API REST completa responsável pelo gerenciamento das informações do sistema.

A API foi desenvolvida utilizando:

- Node.js
- Express.js
- PostgreSQL
- Docker
- Swagger UI para documentação e testes da API

A aplicação está hospedada utilizando o Render, permitindo que outras pessoas possam visualizar e testar as rotas disponíveis através da documentação Swagger:

🔗 Documentação da API:
https://contratos-4u9g.onrender.com/api-docs/

---

# ⚙️ Tecnologias utilizadas

## Backend

- **Node.js**  
  Utilizado como ambiente de execução da aplicação.

- **Express.js**  
  Framework responsável pela criação do servidor, gerenciamento das rotas e organização da API.

- **PostgreSQL**  
  Banco de dados relacional utilizado para armazenar os dados do sistema.

- **Docker**  
  Utilizado para criação do ambiente da aplicação, facilitando a configuração e execução do projeto.

- **Swagger UI**
  Utilizado para documentação da API e testes das requisições diretamente pelo navegador.

- **Bibliotecas de criptografia**
  Utilizadas para implementação da lógica de segurança relacionada ao armazenamento de senhas.

---

# 📌 Funcionalidades implementadas

Atualmente a API possui funcionalidades para gerenciamento das principais entidades do sistema, incluindo:

- Cadastro e gerenciamento de usuários;
- Cadastro e gerenciamento de imóveis;
- Cadastro e gerenciamento de locadores;
- Cadastro e gerenciamento de locatários;
- Estrutura inicial para gerenciamento de contratos;
- Validações de dados;
- Documentação completa das rotas utilizando Swagger.

---

# 🔐 Autenticação

A lógica de autenticação já foi desenvolvida, incluindo:

- Cadastro de usuários;
- Login;
- Criptografia de senhas.

Porém, nesta primeira versão ainda falta aplicar completamente o controle de acesso das rotas.

O próximo passo será implementar a proteção dos endpoints para que somente usuários autenticados possam acessar determinadas funcionalidades do sistema.

---

# 📱 Próximos passos

O projeto continuará evoluindo em novas versões.

Algumas melhorias planejadas:

## Frontend

Desenvolver uma interface utilizando:

- React.js

A ideia é criar uma aplicação mais amigável para uso diário e futuramente possibilitar uma evolução para dispositivos móveis, facilitando o acesso dos meus pais ao sistema.

## Segurança

Como tenho grande interesse pela área de Segurança da Informação, pretendo continuar evoluindo o projeto aplicando boas práticas como:

- Melhorias no controle de autenticação;
- Controle de permissões;
- Proteção contra vulnerabilidades comuns em aplicações Web;
- Estudos relacionados a segurança de APIs.

## Tecnologias futuras

Também pretendo desenvolver novos projetos utilizando TypeScript para ampliar meus conhecimentos e entender melhor suas vantagens em aplicações maiores.

Apesar disso, neste projeto optei por utilizar JavaScript puro porque é a tecnologia que utilizo atualmente no meu trabalho e queria aprofundar ainda mais meus conhecimentos nela antes de migrar para novas tecnologias.

---

# 🧠 Aprendizados

Este foi meu primeiro grande desafio desenvolvendo um Backend completo do início ao fim.

Durante o desenvolvimento tive contato com problemas reais de programação, arquitetura, banco de dados, segurança e deploy.

Ainda estou em processo de aprendizado e sei que existem pontos que podem ser melhorados, mas acredito que corrigir erros, receber feedbacks e evoluir o código faz parte do processo de desenvolvimento.

Por esse motivo, deixo o projeto aberto para quem quiser testar a API, encontrar possíveis problemas, sugerir melhorias ou compartilhar conhecimentos.

Toda contribuição e feedback são bem-vindos.

---

# 🛡️ Sobre mim

Sou um entusiasta de tecnologia, desenvolvimento Backend e Segurança da Informação.

Atualmente estudo:

- Redes de computadores;
- Linux;
- Segurança Web;
- Ethical Hacking.

Meu objetivo é continuar evoluindo como desenvolvedor e futuramente aprofundar meus conhecimentos na área de segurança ofensiva, explorando conceitos de Pentest e proteção de aplicações.

---

# 📄 Licença

Este projeto está disponível para estudos, testes e aprendizado.
