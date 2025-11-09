# Arquitetura da Plataforma de Gestão de Networking

## Visão Geral
Esta plataforma tem como objetivo digitalizar e centralizar a gestão de grupos de networking voltados à geração de negócios, substituindo planilhas e controles manuais.

O sistema permitirá gerenciar membros, indicações, reuniões e performance, oferecendo uma interface moderna e intuitiva, construída com Next.js/React no frontend e Node.js(Nest.js) no backend.

A arquitetura proposta prioriza modularidade, escalabilidade e manutenibilidade, seguindo princípios de boas práticas como separação de responsabilidades, componentização e testes automatizados.

## Diagrama da Arquitetura
```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'fontSize': '14px'}} }%%
graph TD
    %% === Frontend ===
    subgraph Frontend["Frontend - Next.js / React"]
        direction TB
        A1["Página de Intenção<br/>(IntentionForm)"]
        A2["Painel Admin<br/>(Lista + Aprovação)"]
        A3["Cadastro por Convite<br/>(invite/[token])"]
    end

    %% === Backend ===
    subgraph Backend["Backend - Node.js API"]
        direction TB
        B1["Intent Controller<br/>(/api/intents)"]
        B2["Invitation Controller<br/>(/api/invitations)"]
        B3["Member Controller<br/>(/api/members)"]
        B4["ORM / Database Layer<br/>(Prisma, Drizzle, etc.)"]
    end

    %% === Database ===
    subgraph Database["Banco de Dados - PostgreSQL"]
        direction TB
        C1[(intents)]
        C2[(invitations)]
        C3[(members)]
        C4[(indications)]
    end

    %% === External ===
    subgraph External["Infra & Configurações"]
        D1[".env<br/>(ADMIN_KEY, DB_URL)"]
        D2["Simulação de E-mail<br/>(console.log)"]
    end

    %% === Conexões Frontend → Backend ===
    A1 -->|POST /api/intents| B1
    A2 -->|GET /api/admin/intents| B1
    A2 -->|PATCH /api/admin/intents/:id/approve| B1
    A2 -->|PATCH /api/admin/intents/:id/reject| B1
    A3 -->|POST /api/invitations/:token/register| B2
    A3 -->|GET /api/invitations/:token| B2

    %% === Backend → DB ===
    B1 --> B4
    B2 --> B4
    B3 --> B4
    B4 --> C1
    B4 --> C2
    B4 --> C3
    B4 --> C4

    %% === Configs → Backend ===
    D1 -.->|Configurações| Backend
    D2 -.->|Log de convite| B2

    %% === Estilo por camada ===
    classDef frontend fill:#E3F2FD,stroke:#1976D2,stroke-width:2px,color:#000
    classDef backend fill:#FFF3E0,stroke:#F57C00,stroke-width:2px,color:#000
    classDef database fill:#E8F5E9,stroke:#388E3C,stroke-width:2px,color:#000
    classDef external fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#000

    class A1,A2,A3 frontend
    class B1,B2,B3,B4 backend
    class C1,C2,C3,C4 database
    class D1,D2 external
```

## Escolhas Técnicas
### <b>Frontend:</b> 
+ Next.js

+ React

<b>Motivo:</b> Renderização híbrida (SSR/SSG), roteamento integrado, ótimo desempenho e estrutura consistente para aplicações fullstack.

### Backend 
+ Node.js (com Nest.js)

<b>Motivo:</b> Simplicidade e integração direta com o frontend e arquitetura compreensiva e escalável.

### Banco de Dados
+ PostgreSQL

<b>Motivo:</b> modelo relacional, ideal para relatórios, relacionamentos (membros, indicações) e consistência transacional.

### ORM 
+ Prisma

<b>Motivo:</b> abstração simples e intuitiva, migrations automáticas, tipagem estática e suporte a múltiplos bancos.

### Testes 
+ Jest (backend) e React Testing Library (frontend).

### Autenticação 
+ Proteção da área administrativa via variável de ambiente (ADMIN_KEY).

## Modelo de Dados

### Estrutura Relacional (PostgreSQL)
```mermaid
erDiagram

	INTENTS ||--o{ INVITATIONS : generates

	INVITATIONS ||--o{ MEMBERS : registers

	MEMBERS ||--o{ INDICATIONS : creates

	MEMBERS ||--o{ INDICATIONS : receives

  

INTENTS {

	uuid id PK

	string name

	string email

	string phone

	text message

	enum status "pending|approved|refused"

	timestamp created_at

	timestamp updated_at
}

  

INVITATIONS {

	uuid id PK

	uuid intent_id FK

	string token

	timestamp expires_at

	boolean used

	timestamp created_at

}

  

MEMBERS {

	uuid id PK

	string name

	string email

	string phone

	string organization

	boolean active

	timestamp joined_at

}

  

INDICATIONS {

	uuid id PK

	uuid from_member_id FK

	uuid to_member_id FK

	string company

	text description

	enum status "open|contacted|won|lost"

	timestamp created_at
}
```

### Justificativa

A estrutura relacional garante:

+ Integridade referencial entre intenções, convites e membros.
+ Consultas agregadas simples para dashboards (quantidade de membros, indicações etc.).
+ Extensibilidade para novos módulos (financeiro, reuniões 1:1).

## Estrutura de Componentes (Frontend)

A aplicação será organizada em uma arquitetura de pastas clara e modular, promovendo reutilização e testes isolados.
```pgsql
/src

/pages

/intention

	index.tsx -> Formulário público de intenção

/admin

	index.tsx -> Painel administrativo (aprovação)

/invite

	[token].tsx -> Cadastro via token

/components

/ui

	Input.tsx

	Button.tsx

	Card.tsx

	Table.tsx

/intention

	IntentionForm.tsx

/admin

	IntentList.tsx

/invite

	InviteForm.tsx

/services

	api.ts -> Wrapper para chamadas HTTP (Axios ou Fetch)

/hooks

	useFetch.ts

/contexts

	AppContext.tsx -> Estado global (opcional)

/styles

	globals.css
```
  
### Boas práticas adotadas
+ Componentes pequenos e reutilizáveis.
+ Separação clara entre UI, lógica e dados.
+ Uso opcional de Context API para estado global (ex: dados do admin).
+ Tipagem completa com TypeScript.
 
 ## Definição da API
A API segue o padrão RESTful, com rotas organizadas por contexto.
O foco está nas rotas necessárias para o Fluxo de Admissão de Membros.

### Rotas Principais

1. Criar Intenção de Participação
<b>POST</b> /api/intents

<b>Request</b>:
```
{
	
	"name": "João Silva",

	"email": "joao@exemplo.com",

	"phone": "(11)99999-9999",

	"message": "Quero participar do grupo."

}
```

<b>Response (201):</b>
```
{

	"id": "uuid-123",

	"status": "pending",

	"created_at": "2025-11-09T12:00:00Z"

}
```
  

2.  Listar Intenções (Admin)
<b>GET</b> /api/admin/intents

<b>Headers:</b>
```
x-admin-key: ${ADMIN_KEY}
```
<b>Response (200):</b>
```
[
	
	{ "id": "uuid-123", "name": "João", "email": "joao@exemplo.com", "status": "pending" }

]
```
  
3.  Aprovar / Recusar Intenção
<b>POST</b> /api/admin/intents/:id/decision

<b>Body:</b>
```
{ "action": "approve" }
```
<b>Response (200):</b>
```
{
	
	"id": "uuid-123",
	"status": "approved",
	"invitationLink": "https://app.example.com/invite/abcd1234"

}
```

4.  Cadastro Completo via Token
<b>POST</b> /api/invitations/:token/register

<b>Request:</b>
```
{
	
	"name": "João Silva",

	"email": "joao@exemplo.com",

	"organization": "Empresa X"

}
```

<b>Response (201):</b>
```
{
	
	"memberId": "member-uuid-1",

	"message": "Cadastro concluído com sucesso!"

}
```

5.  (Opcional - Sistema de Indicações)
<b>POST</b> /api/indications

<b>Request:</b>
```
{
	
	"fromMemberId": "uuid-member-1",

	"toMemberId": "uuid-member-2",

	"company": "ACME Ltda",

	"description": "Potencial cliente em comum",

	"status": "open"

}
```
  

## Fluxo de Admissão de Membros
```mermaid
sequenceDiagram

participant User as Usuário

participant Admin as Administrador

participant API as Backend API

participant DB as Banco de Dados

  

User->>API: POST /api/intents (enviar intenção)

API->>DB: salva intenção (status = pending)

Admin->>API: GET /api/admin/intents

Admin->>API: POST /api/admin/intents/:id/decision (approve)

API->>DB: cria invitation com token único

API-->>Admin: Retorna link de convite (/invite/:token)

User->>API: Acessa link /invite/:token e preenche cadastro

API->>DB: Cria membro ativo (status = active)

API-->>User: Confirmação de cadastro
```

## Considerações de Segurança

+ <b>Área Admin protegida:</b> verificação por variável de ambiente (ADMIN_KEY) no header ou query string.

+ <b>Tokens de convite:</b> UUIDs únicos com expiração.

+ <b>Validação de entrada:</b> middleware com Joi/Zod.

+ <b>CORS</b> configurado para permitir apenas origens conhecidas.

+ <b>Env vars</b> isoladas em .env e exemplo em .env.example.

## Testes

+ <b>Backend (Jest)</b>

+ <b>Teste unitário:</b> criação de intenção e aprovação.

+ <b>Teste de integração:</b> fluxo completo de intenção -> aprovação -> registro.

+ <b>Frontend (React Testing Library)</b>

+ Teste do formulário de intenção (validação e envio).

+ Teste do fluxo de cadastro com token válido/inválido.

## Decisões e Trade-offs

Uso do Next.js Simplifica o fullstack -> reduz necessidade de infra separada

Env para admin -> Evita overhead de autenticação completa

PostgreSQL via Prisma -> Rápido para modelar e consultar

Tokens UUID -> Garantem segurança e simplicidade

Arquitetura modular Facilita evolução futura para B2B / dashboards financeiros

## Futuras Extensões

Autenticação real (JWT + RBAC).

Módulo financeiro com Stripe/Pagar.me.

Dashboard dinâmico com métricas reais.

Integração com e-mails transacionais (SendGrid, SES).

## Execução e Deploy (resumo)

### Ambiente local:

#### 1. Configurar variáveis de ambiente
```
cp .env.example .env
```
  
#### 2. Instalar dependências
```
npm install
```

#### 3. Rodar migrações
```
npx prisma migrate dev
```
  

#### 4. Iniciar servidor de desenvolvimento
```
npm run dev
```

#### Principais variáveis:
```
DATABASE_URL=postgresql://user:password@localhost:5432/networking

ADMIN_KEY=secret123

NEXT_PUBLIC_API_URL=http://localhost:3000
``` 

#### Autor: Marcos Max Forosteski da Silva

#### Data: Novembro/2025

### Versão: 1.0