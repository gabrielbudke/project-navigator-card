/**
 * Tipos para respostas da API
 */

import { ProjectStatus } from "./project";

/**
 * Projeto retornado pela API (formato da lista)
 */
export interface ProjectListItem {
  id: string;
  title: string;
  subtitle: string;
  status: ProjectStatus;
  currentStep: number;
  stepWarnings?: number[];
  progress: number;
  progressVariant: "primary" | "stable" | "warning" | "critical";
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
