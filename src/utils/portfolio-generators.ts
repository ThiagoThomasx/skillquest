import type { PortfolioProject } from "@/stores/portfolio-store";

export function generateReadmeDraft(project: PortfolioProject): string {
  const skillsList = project.skills.length > 0
    ? project.skills.map((s) => `- ${s}`).join("\n")
    : "- (adicionar tecnologias utilizadas)";

  const deliverablesList = project.deliverables.length > 0
    ? project.deliverables.map((d) => `- [ ] ${d}`).join("\n")
    : "- [ ] (adicionar entregáveis)";

  return `# ${project.title}

## Objetivo

${project.description || "(descreva o objetivo principal do projeto)"}

## Contexto

Este projeto foi desenvolvido como parte da jornada de aprendizado no SkillQuest${project.category ? `, dentro da trilha de **${project.category}**` : ""}.

## Tecnologias / Skills

${skillsList}

## O que foi construído

${deliverablesList}

## Como executar / reproduzir

\`\`\`bash
# Clone o repositório
git clone ${project.repositoryUrl || "<url-do-repositorio>"}

# Instale as dependências
npm install

# Execute o projeto
npm run dev
\`\`\`

${project.liveUrl ? `🔗 **Demo ao vivo:** ${project.liveUrl}\n` : ""}
## Aprendizados

${project.notes || "(descreva os principais aprendizados obtidos neste projeto)"}

## Próximos passos

- [ ] Melhorar cobertura de testes
- [ ] Adicionar documentação detalhada
- [ ] Deploy em produção
`;
}

export function generateLinkedInDraft(project: PortfolioProject): string {
  const skillTags = project.skills.map((s) => `#${s.replace(/\s+/g, "")}`).join(" ");
  const skillsLine = project.skills.length > 0
    ? project.skills.slice(0, 4).join(", ")
    : "novas tecnologias";

  return `🚀 Acabei de concluir mais um projeto na minha jornada de aprendizado!

**${project.title}**

${project.description || "Um projeto prático que me ajudou a consolidar conhecimentos importantes."}

🛠️ Skills praticadas: ${skillsLine}

💡 Principal aprendizado:
${project.notes || "Cada projeto é uma oportunidade de crescer. A prática constante é o que transforma conhecimento em habilidade real."}

${project.repositoryUrl ? `🔗 GitHub: ${project.repositoryUrl}` : ""}
${project.liveUrl ? `🌐 Demo: ${project.liveUrl}` : ""}

➡️ Próximo passo: continuar construindo e aprendendo.

${skillTags} #aprendizado #desenvolvimento #portfolio #skillquest
`;
}

// Skills predefined by category
export const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  Frontend: ["React", "TypeScript", "CSS", "Next.js", "TailwindCSS", "JavaScript", "HTML", "Zustand"],
  Backend: ["Node.js", "APIs REST", "Autenticação", "Banco de Dados", "Express", "Python"],
  Cybersecurity: ["Linux", "Networking", "OWASP", "Blue Team", "Pentest", "CTF", "Security"],
  Python: ["Automação", "APIs", "Data Handling", "Web Scraping", "Scripts"],
  "Tech Recruiting": ["Hunting", "Triagem", "Stakeholder Management", "Relatório de Candidatos"],
  "Data Science": ["Python", "Pandas", "Machine Learning", "Visualização", "Estatística"],
  DevOps: ["Docker", "CI/CD", "Git", "Cloud", "Linux", "Kubernetes"],
  Mobile: ["React Native", "Flutter", "iOS", "Android", "APIs"],
};

export const ALL_SKILLS = Array.from(new Set(Object.values(SKILLS_BY_CATEGORY).flat())).sort();
