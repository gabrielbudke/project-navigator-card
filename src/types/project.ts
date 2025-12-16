/**
 * Tipos relacionados a projetos
 */

export type ProjectStatus = "stable" | "warning" | "critical" | "outdated";

export interface ProjectTask {
  name: string;
  completed: boolean;
}

export interface ProjectData {
  nome: string;
  subtitle: string;
  numeroSNOW: string;
  status: ProjectStatus;
  currentStep: number;
  stepWarnings: number[];
  inicio: string;
  fim: string;
  percentualConcluido: number;
  percentualPlanejado: number;
  valorVendido: number;
  valorAtingido: number;
  rentabilidadePrevista: number;
  rentabilidadeAtual: number;
  saldoHoras: number;
  reconhecido: number;
  description: string;
  teamMembers: string[];
  tasks: ProjectTask[];
}
