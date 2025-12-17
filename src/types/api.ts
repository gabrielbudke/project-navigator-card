/**
 * Tipos para respostas da API
 */

import { ProjectStatus } from "./project";

/**
 * Projeto retornado pela API (formato da lista)
 */
export interface ProjectListItem {
  id: string;
  nome: string;
  numero_snow: string;
  inicio: string;
  fim: string;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  etapa: string;
  stepWarnings?: number[];
  progress: number;
  progressVariant: "primary" | "stable" | "warning" | "critical";
  perc_concluido: number;
  perc_planejado: number;
  vlr_vendido: number;
  vlr_atingido: number;
  rent_prevista: number;
  rent_atual: number;
  saldo_horas: number;
  reconhecido: number;
}

/**
 * Resposta da API de listagem de projetos
 */
export type ProjectsApiResponse = ProjectListItem[];

/**
 * Atividade do plano de recurso retornada pela API
 */
export interface ResourcePlanActivity {
  nome: string;
  numero: string;
  profissional_nome: string;
  inicio: string;
  fim: string;
  perc_atingido: number;
  perc_planejado: number;
  horasApontadas: number;
  saldo_horas: number;
}

export interface ResourcePlanActivities {
  data: ResourcePlanActivity[];
}
/**
 * Resposta da API de plano de recurso
 */
export type ResourcePlanResponse = ResourcePlanActivities;
