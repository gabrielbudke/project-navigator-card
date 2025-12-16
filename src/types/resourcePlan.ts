/**
 * Resource Plan Types
 * Tipos para gerenciamento de planos de recursos do projeto
 */

/**
 * Interface representando um plano de recurso individual
 */
export interface ResourcePlan {
  /** Nome/identificador descritivo do plano de recurso */
  nome: string;
  
  /** Número único do plano de recurso (ex: RPLN0166663) */
  numero: string;
  
  /** Número do plano de recurso de origem */
  origem: string;
  
  /** Data de início do plano (formato ISO: YYYY-MM-DD) */
  inicio: string;
  
  /** Data de fim do plano (formato ISO: YYYY-MM-DD) */
  fim: string;
  
  /** Percentual atingido do plano (0-100) */
  perc_atingido: number;
  
  /** Percentual planejado (0-100) */
  perc_planejado: number;
  
  /** Percentual planejado real (0-100) */
  perc_planejado_real: number;
  
  /** Saldo de horas disponível (string numérica) */
  saldo_horas: string;
  
  /** Nome do profissional alocado */
  profissional_nome: string;
  
  /** Função/cargo do profissional */
  profissional_funcao: string;
}

/**
 * Interface para a resposta da API de planos de recursos
 */
export interface ResourcePlanApiResponse {
  /** Indica se a requisição foi bem-sucedida */
  success: boolean;
  
  /** Array de planos de recursos retornados */
  data: ResourcePlan[];
  
  /** Mensagem de erro (opcional, presente quando success = false) */
  message?: string;
}

/**
 * Interface para parâmetros de filtro/busca de planos de recursos
 */
export interface ResourcePlanFilters {
  /** Código do projeto (ex: PRJ0161122) */
  projectCode?: string;
  
  /** Data de início mínima */
  startDate?: string;
  
  /** Data de fim máxima */
  endDate?: string;
  
  /** Nome do profissional para filtrar */
  professionalName?: string;
}

/**
 * Type guard para verificar se a resposta da API é válida
 */
export function isResourcePlanApiResponse(data: unknown): data is ResourcePlanApiResponse {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  
  const response = data as ResourcePlanApiResponse;
  
  return (
    typeof response.success === 'boolean' &&
    Array.isArray(response.data)
  );
}
