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
  currentStep: number;
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
  profissional: string;
  inicio: string;
  fim: string;
  percentualAtingido: number;
  percentualPlanejado: number;
  horasApontadas: number;
  saldoHoras: number;
}

/**
 * Resposta da API de plano de recurso
 */
export type ResourcePlanResponse = ResourcePlanActivity[];
