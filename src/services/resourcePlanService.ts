/**
 * Serviço para operações de planos de recurso
 */

import { apiClient, ApiError } from "./api";
import { ResourcePlanActivity, ResourcePlanResponse } from "@/types/api";

/**
 * Serviço de planos de recurso - camada de acesso à API
 */
export const resourcePlanService = {
  /**
   * Busca o plano de recurso por número do projeto
   */
  async getByProjectNumber(projectNumber: string): Promise<ResourcePlanActivity[]> {
    try {
      const response = await apiClient.get<ResourcePlanResponse>(
        `/resource-plans/${projectNumber}`
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 404) {
        return [];
      }
      console.error(`Erro ao buscar plano de recurso ${projectNumber}:`, apiError.message);
      throw apiError;
    }
  },
};
