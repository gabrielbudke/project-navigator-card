/**
 * Serviço para operações de projetos
 */

import { apiClient, ApiError } from "./api";
import { ProjectListItem, ProjectsApiResponse } from "@/types/api";

/**
 * Serviço de projetos - camada de acesso à API
 */
export const projectService = {
  /**
   * Busca todos os projetos
   */
  async getAll(): Promise<ProjectListItem[]> {
    try {
      const response = await apiClient.get<ProjectsApiResponse>("/projects");
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Erro ao buscar projetos:", apiError.message);
      throw apiError;
    }
  },

  /**
   * Busca um projeto por ID
   */
  async getById(id: string): Promise<ProjectListItem | null> {
    try {
      const response = await apiClient.get<ProjectListItem>(`/projects/${id}`);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 404) {
        return null;
      }
      console.error(`Erro ao buscar projeto ${id}:`, apiError.message);
      throw apiError;
    }
  },
};
