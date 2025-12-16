import { ProjectStatus } from "@/types/project";

/**
 * Labels de status do projeto
 */
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  stable: "Estável",
  warning: "Atenção",
  critical: "Crítico",
  outdated: "Desatualizado",
};

/**
 * Cores de badge por status
 */
export const STATUS_BADGE_COLORS: Record<ProjectStatus, string> = {
  stable: "bg-status-stable/10 text-status-stable",
  warning: "bg-status-warning/10 text-status-warning",
  critical: "bg-status-critical/10 text-status-critical",
  outdated: "bg-status-outdated/10 text-status-outdated",
};

/**
 * Etapas do projeto
 */
export const PROJECT_STEPS = [
  { full: "Pré-Iniciação", short: "Pré-Inic." },
  { full: "Iniciação", short: "Iniciação" },
  { full: "Planejamento", short: "Planej." },
  { full: "Execução", short: "Execução" },
  { full: "Encerramento", short: "Encerr." },
  { full: "Encerrado", short: "Encerr." },
];
