# Changelog

## Sprint 14 — QA Final e Documentação (2026-06-26)

### Corrigido
- `useMediaQuery`: migrado para `useSyncExternalStore` — elimina setState síncrono em efeito
- `GlobalSearch`: reset de estado via `setTimeout` para evitar cascata de renders; `flatIdx` mutável substituído por `reduce`; aspas escapadas no JSX
- `StudySessionModal`: reset de estado movido para fora do corpo síncrono do efeito
- `paths/page.tsx`: aspas não escapadas em JSX corrigidas

### Adicionado
- README completo com visão, funcionalidades, stack, instruções de execução, estrutura de dados e roadmap implementado
- Este CHANGELOG

---

## Sprint 2 — Fluxo completo de sessão de estudo

- Timer de sessão com pause/resume e objetivos checklist
- Reflexão pós-sessão com campos de humor e aprendizados
- Ganho de XP ao finalizar sessão
- Registro de sessão no histórico

## Auditoria técnica — Sprints 1, 2 e 3

- Correção de imports, tipos e erros de build
- Alinhamento de convenções de nomenclatura (shadcn lowercase, componentes PascalCase)

## Portfolio Builder

- Página de portfólio com showcase de trilhas concluídas
- Modal de exportação

## Qualidade — Fase 14

- Dados reais nos stores, navegação entre páginas, configurações de perfil

## Questline Ativa no Dashboard — Fase 13

- Panel que mostra a questline mais recente com progresso e próxima missão

## Missão Detail View — Fase 12

- Checklist de objetivos, recursos vinculados e dicas contextuais

## Content Packs + Explore Marketplace — Fase 11

- 6 templates prontos: React, Python, ML, TypeScript, Node.js, SQL
- Página Explore com marketplace de conteúdo

## Daily Quest + Study Session — Fase 10

- Missão diária gerada automaticamente
- Primeiro fluxo de sessão de estudo

## Questline Builder + Templates — Fase 9

- CRUD de trilhas com módulos e missões
- Suporte a templates

## Progressão Engine — Fase 8

- Cálculo de XP, nível e progressão percentual

## RPG Pages + Temas — Fases 5–7

- Sistema de temas visuais persistente (Navy, Pixel Quest, Fantasy RPG)
- Identidade visual completa para cada tema

## Dashboard Foundation — Fase 4

- Design system Navy Premium
- Layout com Sidebar, Topbar e BottomNav
- Métricas de estudo no dashboard

## Fundação visual — Fase 1–3

- Projeto inicializado com Next.js + Tailwind + Zustand
- Design system base e estrutura de rotas
