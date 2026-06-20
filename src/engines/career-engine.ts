export interface CareerStage {
  id: string;
  title: string;
  minLevel: number;
  description: string;
}

export const CAREER_STAGES: CareerStage[] = [
  { id: "aprendiz", title: "Aprendiz", minLevel: 1, description: "Dando os primeiros passos na jornada." },
  { id: "aventureiro", title: "Aventureiro", minLevel: 3, description: "Explorando o mundo do desenvolvimento." },
  { id: "desenvolvedor", title: "Desenvolvedor", minLevel: 5, description: "Construindo soluções com confiança." },
  { id: "especialista", title: "Especialista", minLevel: 10, description: "Dominando tecnologias avançadas." },
  { id: "mestre", title: "Mestre", minLevel: 15, description: "Guia e referência para outros aventureiros." },
  { id: "lenda", title: "Lenda", minLevel: 20, description: "Atingiu o patamar mais alto da jornada." },
];

export function getCareerStage(level: number): CareerStage {
  const stage = [...CAREER_STAGES].reverse().find((s) => level >= s.minLevel);
  return stage ?? CAREER_STAGES[0];
}

export function getNextCareerStage(level: number): CareerStage | null {
  const current = getCareerStage(level);
  const idx = CAREER_STAGES.findIndex((s) => s.id === current.id);
  return CAREER_STAGES[idx + 1] ?? null;
}
