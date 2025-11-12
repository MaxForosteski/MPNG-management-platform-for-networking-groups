# MPNG - Management Platform for Networking Groups

## Visão Geral
Esta plataforma tem como objetivo digitalizar e centralizar a gestão de grupos de networking voltados à geração de negócios, substituindo planilhas e controles manuais.

O sistema permitirá gerenciar membros, indicações, reuniões e performance, oferecendo uma interface moderna e intuitiva, construída com Next.js/React no frontend e Node.js(Nest.js) no backend.

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

## Execução e Deploy (resumo)

### Ambiente local:

#### 1. Configurar variáveis de ambiente
```
cd backend
cp .env.example .env
```
  
#### 2. Instalar dependências
```
npm run install
```

#### 3. Rodar migrações
```
npm run migrations
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