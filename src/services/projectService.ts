/**
 * Project Service
 * Serviço para gerenciar operações relacionadas a projetos
 */

import { apiClient, API_ENDPOINTS, ApiError } from './api.config';
import { ProjectData } from '@/types/project';

/**
 * Interface para resposta da API de projeto por ID
 */
interface ProjectApiResponse {
  success: boolean;
  data: ProjectData;
  message?: string;
}

/**
 * Classe de serviço para operações com projetos
 */
class ProjectService {
  /**
   * Busca um projeto por ID
   * @param projectId - Código único do projeto (ex: PRJ0161122)
   * @returns Promise com os dados do projeto
   * @throws {ApiError} Lança erro se a requisição falhar
   * 
   * @example
   * ```typescript
   * try {
   *   const project = await projectService.getById('PRJ0161122');
   *   console.log(project.nome);
   * } catch (error) {
   *   console.error('Erro ao buscar projeto:', error);
   * }
   * ```
   */
  async getById(projectId: string): Promise<ProjectData> {
    this.validateProjectId(projectId);

    try {
      const response = await apiClient.get<ProjectApiResponse>(
        API_ENDPOINTS.projectById(projectId)
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Falha ao buscar projeto');
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(error as ApiError, `Erro ao buscar projeto ${projectId}`);
    }
  }

  /**
   * Busca múltiplos projetos por IDs
   * @param projectIds - Array de códigos de projetos
   * @returns Promise com array de projetos
   */
  async getByIds(projectIds: string[]): Promise<ProjectData[]> {
    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      throw new Error('Array de IDs de projetos não pode estar vazio');
    }

    try {
      // Busca em paralelo para melhor performance
      const promises = projectIds.map(id => this.getById(id));
      return await Promise.all(promises);
    } catch (error) {
      throw this.handleError(error as ApiError, 'Erro ao buscar múltiplos projetos');
    }
  }

  /**
   * Verifica se um projeto existe
   * @param projectId - Código do projeto
   * @returns Promise<boolean> indicando se o projeto existe
   */
  async exists(projectId: string): Promise<boolean> {
    try {
      await this.getById(projectId);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Valida o formato do ID do projeto
   * @param projectId - ID a ser validado
   * @throws {Error} Se o ID for inválido
   */
  private validateProjectId(projectId: string): void {
    if (!projectId || typeof projectId !== 'string') {
      throw new Error('ID do projeto é obrigatório e deve ser uma string');
    }

    if (projectId.trim().length === 0) {
      throw new Error('ID do projeto não pode estar vazio');
    }

    // Valida formato esperado: PRJ seguido de números (ex: PRJ0161122)
    const projectIdPattern = /^PRJ\d+$/;
    if (!projectIdPattern.test(projectId.trim())) {
      throw new Error(
        `Formato inválido do ID do projeto: ${projectId}. Esperado: PRJ seguido de números (ex: PRJ0161122)`
      );
    }
  }

  /**
   * Trata erros e adiciona contexto adicional
   * @param error - Erro original
   * @param context - Contexto adicional para o erro
   * @returns Erro formatado
   */
  private handleError(error: ApiError, context: string): Error {
    const errorMessage = `${context}: ${error.message}`;
    const enhancedError = new Error(errorMessage);
    
    // Preserva propriedades do erro original
    Object.assign(enhancedError, {
      status: error.status,
      code: error.code,
      details: error.details,
    });

    return enhancedError;
  }
}

/**
 * Instância singleton do serviço de projetos
 * Exporta uma instância única para ser usada em toda a aplicação
 */
export const projectService = new ProjectService();

/**
 * Exporta a classe para casos de uso avançados (testes, extensões)
 */
export { ProjectService };
