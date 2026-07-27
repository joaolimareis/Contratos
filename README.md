# 🏠 Sistema de Gerenciamento de Contratos de Imóveis

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-orange)

## 📌 Sobre o projeto

Este projeto nasceu de uma necessidade real: melhorar a organização dos documentos, contratos, informações de imóveis e controle de pagamentos relacionados aos imóveis da minha família.

A ideia foi criar uma solução própria para centralizar essas informações e facilitar o gerenciamento desses dados, reduzindo a dependência de controles manuais e documentos espalhados.

Além de resolver um problema real, este projeto representa meu primeiro grande desafio desenvolvendo um Backend completo, desde a estrutura inicial da API até o deploy em produção.

O objetivo principal foi aplicar e consolidar meus conhecimentos em desenvolvimento Backend, arquitetura de APIs, banco de dados, segurança e boas práticas de desenvolvimento.

> Este projeto está em constante evolução. Como parte do meu processo de aprendizado, novas funcionalidades, melhorias de segurança e ajustes de arquitetura serão implementados conforme meu conhecimento evolui.

---

# 🌐 Demonstração da API

A API está hospedada utilizando o Render e possui uma documentação interativa através do Swagger UI.

É possível visualizar todos os endpoints disponíveis, realizar testes das requisições e explorar a estrutura da API diretamente pelo navegador.

🔗 Documentação Swagger:
https://contratos-4u9g.onrender.com/api-docs/

> Futuramente pretendo adicionar imagens, GIFs ou vídeos demonstrando o funcionamento da aplicação para facilitar a visualização do projeto.

---

# 🚀 Primeira versão

Nesta primeira versão, o foco principal foi desenvolver toda a estrutura do Backend, criando uma API REST responsável pelo gerenciamento das informações do sistema.

A aplicação foi desenvolvida pensando em uma arquitetura que permita futuras expansões, como:

- Interface Web;
- Aplicação Mobile;
- Melhorias de segurança;
- Controle de usuários e permissões.

---

# ⚙️ Tecnologias utilizadas

## Backend

### Node.js

Utilizado como ambiente de execução da aplicação.

### Express.js

Framework utilizado para criação do servidor HTTP, organização das rotas e construção da API REST.

### PostgreSQL

Banco de dados relacional utilizado para persistência das informações do sistema.

### Docker

Utilizado para criação e gerenciamento do ambiente da aplicação, facilitando a configuração e execução do projeto em diferentes ambientes.

### Swagger UI

Utilizado para documentação da API e realização de testes diretamente pelo navegador.

### Bibliotecas de criptografia

Utilizadas para implementar práticas de segurança relacionadas ao armazenamento de senhas dos usuários.

---

# 📌 Funcionalidades implementadas

Atualmente a API possui funcionalidades para gerenciamento das principais entidades do sistema:

- Cadastro e gerenciamento de usuários;
- Sistema de login;
- Cadastro e gerenciamento de imóveis;
- Cadastro e gerenciamento de locadores;
- Cadastro e gerenciamento de locatários;
- Estrutura inicial para contratos;
- Validações de dados;
- Documentação dos endpoints utilizando Swagger.

---
# 🏗️ Arquitetura do projeto

A arquitetura do projeto foi pensada inicialmente utilizando containers Docker para separar as responsabilidades da aplicação.

Na primeira versão, todo o ambiente funcionava localmente utilizando Docker Compose, com dois containers independentes:

- Um container responsável pela API Backend utilizando Node.js e Express;
- Um container responsável pelo banco de dados PostgreSQL.

Essa separação permite que cada serviço tenha seu próprio ambiente, facilitando a manutenção, configuração e futura escalabilidade do sistema.

Atualmente, a API está publicada utilizando o Render e o banco de dados PostgreSQL também está hospedado em uma instância gerenciada pelo Render.

A arquitetura atual funciona da seguinte forma:

              Usuário / Cliente
                     |
                     |
                     v
          +--------------------+
          |  API Node.js       |
          |  Express.js        |
          |  Swagger UI        |
          +--------------------+
                     |
                     |
                     v
          +--------------------+
          | PostgreSQL         |
          | Banco de Dados     |
          | Render             |
          +--------------------+

          
---

## Ambiente inicial utilizando Docker

Durante o desenvolvimento local, o projeto foi estruturado utilizando Docker Compose:

             Ambiente Docker

          +--------------------+
          | Backend API        |
          | Node.js            |
          | Express            |
          | Container          |
          +--------------------+
                     |
                     |
                     v
          +--------------------+
          | PostgreSQL         |
          | Banco de Dados     |
          | Container          |
          +--------------------+

---
          
Essa abordagem permitiu estudar conceitos importantes como:

- Containerização de aplicações;
- Comunicação entre serviços;
- Configuração de ambientes isolados;
- Persistência de dados utilizando volumes Docker.

---

## Próximas evoluções da arquitetura

O projeto ainda está em desenvolvimento e novas camadas serão adicionadas futuramente.

A próxima grande etapa será a criação do Frontend utilizando React.js, formando uma arquitetura mais completa:

                Usuário

                   |
                   v

          +----------------+
          | Frontend       |
          | React.js       |
          +----------------+

                   |
                   |
                   v

          +----------------+
          | Backend API    |
          | Node.js        |
          | Express.js     |
          +----------------+

                   |
                   |
                   v

          +----------------+
          | PostgreSQL     |
          | Banco de Dados |
          +----------------+
---

A ideia é evoluir o sistema gradualmente, adicionando novas funcionalidades, melhorias de segurança e uma experiência de uso mais simples para os usuários finais.

# 🔐 Segurança e autenticação

A primeira versão já possui a estrutura inicial de autenticação:

- Cadastro de usuários;
- Login;
- Criptografia de senhas.

Porém, o controle de acesso das rotas ainda está em desenvolvimento.

O próximo passo será aplicar a autenticação nos endpoints, garantindo que determinadas funcionalidades só possam ser acessadas por usuários devidamente autenticados.

Também pretendo evoluir essa parte aplicando conceitos de segurança de aplicações Web, como:

- Controle de permissões;
- Proteção de endpoints;
- Boas práticas de segurança em APIs;
- Mitigação de vulnerabilidades comuns.

---

# 📱 Próximas versões

## Frontend

A próxima etapa será desenvolver uma interface utilizando React.js.

O objetivo é criar uma experiência mais simples e intuitiva para os usuários finais.

Também existe a intenção de futuramente evoluir o projeto para uma aplicação mobile, facilitando o uso no dia a dia pelos meus pais.

---

## Evolução tecnológica

Neste projeto optei por utilizar JavaScript puro porque é a tecnologia que utilizo atualmente no meu trabalho e queria aprofundar meus conhecimentos antes de migrar para novas tecnologias.

Como próximos estudos, pretendo desenvolver novos projetos utilizando:

- TypeScript;
- Arquiteturas mais escaláveis;
- Melhores práticas de desenvolvimento Backend.

---

# 🧠 Aprendizados durante o desenvolvimento

Este foi meu primeiro projeto desenvolvendo um Backend completo.

Durante o desenvolvimento tive contato com desafios reais envolvendo:

- Estruturação de uma API;
- Modelagem de banco de dados;
- Organização de código;
- Autenticação;
- Segurança de informações;
- Deploy de aplicações;
- Correção de problemas durante o desenvolvimento.

O processo de desenvolvimento também mostrou a importância de testar, identificar falhas e melhorar continuamente o código.

Ainda existem pontos que serão aprimorados, mas cada ajuste representa uma oportunidade de aprendizado e evolução técnica.

---

# 🤝 Contribuições e feedbacks

Este projeto está aberto para estudos, testes e contribuições.

Caso você encontre:

- Erros;
- Possíveis melhorias;
- Falhas de segurança;
- Sugestões de arquitetura;

Fique à vontade para abrir uma Issue ou compartilhar seu feedback.

Acredito que receber críticas construtivas e analisar diferentes perspectivas é uma das melhores formas de evoluir como desenvolvedor.

---

# 🛡️ Interesse em Segurança da Informação

Além do desenvolvimento Backend, tenho grande interesse pela área de Segurança da Informação.

Atualmente estudo:

- Redes de computadores;
- Linux;
- Segurança Web;
- Ethical Hacking.

Meu objetivo é aprofundar meus conhecimentos em segurança ofensiva, explorando conceitos de Pentest, análise de vulnerabilidades e proteção de aplicações.

---

# 📊 Por que este projeto existe?

Este projeto representa mais do que uma aplicação CRUD.

Ele foi desenvolvido para resolver um problema real, aplicando conceitos aprendidos durante minha jornada de desenvolvimento.

Ao longo da construção, busquei entender não apenas como fazer uma aplicação funcionar, mas também como criar uma solução organizada, segura e preparada para evoluir.

---

# 📄 Licença

Este projeto está disponível para estudos, testes e aprendizado.
