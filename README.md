# SkillQuest

Plataforma pessoal de estudo com trilhas, missões, sessões cronometradas e roadmaps gamificados. Construída para uso offline-first com persistência local via Zustand.

---

## Visão do projeto

SkillQuest é um sistema de gestão de aprendizado pessoal que combina elementos de RPG (XP, níveis, missões) com ferramentas reais de estudo (sessões, notas, biblioteca de recursos, revisão espaçada). O objetivo é tornar o acompanhamento do progresso de estudo engajante e estruturado.

---

## Principais funcionalidades

| Funcionalidade | Descrição |
|---|---|
| **Trilhas (Questlines)** | Crie roadmaps com módulos e missões aninhadas |
| **Templates** | 6+ templates prontos (React, Python, Machine Learning, etc.) |
| **Sessões de estudo** | Timer, objetivos checklist, reflexão pós-sessão e ganho de XP |
| **Histórico** | Todas as sessões registradas com métricas de duração e XP |
| **Notas** | Base de conhecimento pessoal vinculada a trilhas |
| **Biblioteca** | Recursos externos (artigos, vídeos, livros) organizados |
| **Projetos** | Gestão de projetos práticos associados ao aprendizado |
| **Revisão** | Sistema de revisão espaçada por trilha |
| **Busca global** | Ctrl+K busca trilhas, missões, notas, sessões e recursos |
| **Portfólio** | Showcase exportável das conquistas |
| **Badges** | Sistema de conquistas desbloqueadas por progresso |
| **Backup** | Exportação e importação completa dos dados em JSON |
| **Temas visuais** | Navy Premium, Pixel Quest e Fantasy RPG com dark/light mode |
| **Calendário de consistência** | Visualização de hábito de estudo por dia |

---

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS v4, Framer Motion
- **Componentes**: Radix UI primitivos
- **Estado**: Zustand (persistência localStorage)
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React

---

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento
npm run dev

# 3. Abrir no navegador
# http://localhost:3000
```

Para build de produção:

```bash
npm run build
npm start
```

---

## Estrutura de dados

Todos os dados são salvos no `localStorage` via Zustand. Não há backend — 100% client-side.

| Store | Conteúdo |
|---|---|
| `questlines-store` | Trilhas, módulos e missões |
| `sessions-store` | Histórico de sessões de estudo |
| `notes-store` | Notas pessoais |
| `resources-store` | Biblioteca de recursos |
| `projects-store` | Projetos práticos |
| `review-store` | Fila de revisão espaçada |
| `backup-store` | Metadata de backups |
| `ui-store` | Preferências de UI (tema, sidebar) |

### Exportar/importar dados

Acesse **Configurações → Backup** para exportar todos os dados em JSON ou restaurar a partir de um arquivo.

---

## Roadmap implementado

### Fase 1 — Fundação visual
- Design system Navy Premium com CSS variables
- Sidebar, Topbar e BottomNav responsivos
- Sistema de temas (Navy, Pixel Quest, Fantasy RPG)

### Fase 2 — Trilhas e progressão
- CRUD completo de Questlines, módulos e missões
- Engine de progressão com XP e níveis
- Templates de conteúdo (6 packs)

### Fase 3 — Sessões de estudo
- Modal de sessão com timer, objetivos e reflexão
- Histórico paginado com métricas
- Calendário de consistência

### Fase 4 — Conteúdo e descoberta
- Marketplace de templates (Explore)
- Missões diárias
- Panel de Questline ativa no dashboard

### Fase 5 — Ferramentas de apoio
- Base de notas pessoais
- Biblioteca de recursos
- Gestão de projetos práticos
- Sistema de revisão espaçada

### Fase 6 — Polimento e QA
- Busca global (Ctrl+K)
- Portfólio exportável
- Sistema de badges
- Backup/restore completo
- Zero erros de type e lint
