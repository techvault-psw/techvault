<div align="center">
    <img height="70rm" src="./.github/assets/logo.png">
</div>

<br/>

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-13AA52?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

<div align="center">

![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

</div>

<div align="center">
    <img height="550rm" src="./.github/assets/page.png">
</div>

## 📋 Sumário

- [Introdução](#ℹ️-introdução)
- [Visão Geral](#👁️-visão-geral)
- [Tecnologias Utilizadas](#⚙️-tecnologias-utilizadas)
- [Arquitetura](#🛠️-arquitetura)
- [Entidades Principais](#👤-entidades-principais)
- [Funcionalidades](#✨-funcionalidades)
- [Como Executar](#▶️-como-executar)
- [Documentação da API](#📝-documentação-da-api)
- [Seeding de Dados](#🌱-seeding-de-dados)
- [Testes](#🧪-testes)
- [Projeto Acadêmico](#🎓-projeto-acadêmico)
- [Créditos](#©️-créditos)
- [Licença](#🧾-licença)

## ℹ️ Introdução

TechVault é uma plataforma full-stack web para gerenciamento de um comércio fictício de aluguel de computadores e equipamentos similares, desenvolvida para a disciplina de Programação de Software para Web por parte da programação do curso de Bacharelado em Ciência da Computação oferecido pelo CEFET/RJ.

## 👁️ Visão Geral

TechVault é uma solução completa que permite gerenciar reservas de equipamentos de informática, com funcionalidades de cadastro de clientes, gestão de pacotes de produtos, controle de endereços de entrega, acompanhamento de reservas e geração de relatórios financeiros.

## ⚙️ Tecnologias Utilizadas

### Backend
- **Runtime**: Node.js com TypeScript
- **Framework**: Express
- **Banco de Dados**: MongoDB com Mongoose 
- **Autenticação**: JWT (JSON Web Tokens) com Passport
- **Validação**: Zod
- **Documentação da API**: OpenAPI/Swagger
- **Upload de Imagens**: Multer
- **Testes**: Jest com ts-jest
- **Deploy**: Vercel

### Frontend
- **Framework**: React com TypeScript
- **Build Tool**: Vite
- **Roteamento**: React Router
- **Gerenciamento de Estado**: Redux Toolkit com redux-persist
- **Formulários**: React Hook Form com Zod
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Testes end-to-end**: Playwright
- **Deploy**: Vercel

## 🛠️ Arquitetura

### Backend (Node.js/Express)

```
backend/src/
├── routes/             # Endpoints da API
│   ├── auth/          # Autenticação e login
│   ├── cliente/       # Gerenciamento de clientes
│   ├── enderecos/     # Gerenciamento de endereços
│   ├── pacotes/       # Gerenciamento de pacotes/produtos
│   ├── reservas/      # Gerenciamento de reservas
│   ├── feedbacks/     # Gerenciamento de avaliações
│   └── relatorios/    # Relatórios financeiros e de reservas
├── models/            # Schemas MongoDB/Mongoose
├── middlewares/       # Middleware de autenticação e validação
├── utils/             # Funções utilitárias
├── scripts/           # Scripts de seeding e testes
└── types/             # Tipos TypeScript compartilhados
```

### Frontend (React/Vite)

```
frontend/src/
├── pages/             # Páginas da aplicação
├── components/        # Componentes React reutilizáveis
├── redux/             # State management (slices)
├── hooks/             # Custom React hooks
├── lib/               # Utilidades e helpers
├── types/             # Tipos TypeScript
├── consts/            # Constantes da aplicação
└── api/               # Integração com backend
```

## 👤 Entidades Principais

### Cliente
- Nome, email, telefone e senha
- Role dentro do sistema (Cliente, Gerente, Suporte)
- Data de registro

### Pacote
- Nome e descrição
- Imagem do pacote
- Lista de componentes inclusos
- Valor da locação
- Quantidade disponível

### Endereço
- Informações de entrega para clientes
- Múltiplos endereços por cliente

### Reserva
- Vinculação de cliente, pacote e endereço
- Status (Confirmada, Cancelada, Concluída)
- Datas de início e término
- Códigos de entrega e coleta
- Rastreamento de data de entrega/coleta

### Feedback
- Avaliações e comentários de clientes
- Vínculo com reservas

## ✨ Funcionalidades

### Autenticação e Autorização
- Login com JWT
- Três roles de usuário: Cliente, Gerente, Suporte
- Proteção de rotas baseada em autenticação

### Gerenciamento de Clientes
- Criar, ler, atualizar e deletar clientes
- Validação de email e telefone únicos

### Catálogo de Pacotes
- Visualizar pacotes disponíveis
- Upload de imagens de produtos
- Controle de quantidade em estoque

### Reservas
- Criar novas reservas
- Confirmar entrega e coleta com códigos
- Cancelar reservas
- Acompanhar status das reservas
- Histórico de reservas do cliente

### Endereços
- Gerenciar múltiplos endereços por cliente
- Atualizar informações de entrega

### Feedbacks
- Deixar avaliações sobre reservas
- Visualizar comentários de clientes

### Relatórios
- Relatório de reservas por período
- Relatório financeiro com receitas

## ▶️ Como Executar

### Pré-requisitos
- Node.js 18+
- MongoDB local ou remoto (configurado via .env)

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar em desenvolvimento
npm run dev

# Executar testes
npm test

# Gerar cobertura de testes
npm test:coverage

# Fazer build para produção
npm run build
npm start
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Testes E2E
npm run test:e2e
npm run test:e2e:ui

# Gerar documentação JSDoc
npm run docs
npm run docs:serve
```

## 📝 Documentação da API

A documentação completa da API está disponível via Swagger/OpenAPI:

```
http://localhost:3000/docs
```

Os endpoints incluem validação automática de request/response e documentação interativa.

## 🌱 Seeding de Dados

Para popular o banco de dados com dados de teste:

```bash
cd backend
npm run seed          # Seed em banco de dados padrão
npm run seed:test     # Seed em banco de dados de testes
```

## 🧪 Testes

### Backend
- Testes unitários e de integração com Jest
- Mock de banco de dados com MongoDB Memory Server
- Supertest para testes de API

### Frontend
- Testes E2E com Playwright
- Suporte a modo headless, UI interativo e relatórios

## 🎓 Projeto Acadêmico

Este projeto foi desenvolvido como parte da disciplina de Programação de Software para Web (PSW) do CEFET/RJ, demonstrando:

- Arquitetura de desenvolvimento full-stack
- Boas práticas de código
- Separação de responsabilidades
- Tipagem forte com TypeScript
- Testes automatizados
- Documentação de API
- Autenticação e autorização
- Gerenciamento de estado complexo

## ©️ Créditos

Este projeto foi idealizado e desenvolvido por meio do esforço conjunto de:

- [Erick Martins Silva](https://github.com/erickMartinsSilva);
- [Gabriel Centeio Freitas](https://github.com/gabrielCenteioFreitas);
- [Gabriel Barretto Galdino dos Santos](https://github.com/g20b-cd);
- [Guilherme Barboza Araujo de Almeida](https://github.com/devguialmeida);
- [Matheus Cunha Schwab](https://github.com/MatheusCunhaSchwab).

## 🧾 Licença

Este projeto está sob a licença ISC (Internet Software Consortium).
