/**
 * Resource Plan Service
 * Serviço para gerenciar operações relacionadas a planos de recursos
 */

import { apiClient, API_ENDPOINTS, ApiError, buildQueryParams } from './api.config';
import {
  ResourcePlan,
  ResourcePlanApiResponse,
  ResourcePlanFilters,
  isResourcePlanApiResponse,
} from '@/types/resourcePlan';

/**
 * Interface para estatísticas agregadas de planos de recursos
 */
export interface ResourcePlanStats {
  totalPlans: number;
  totalHours: number;
  averageCompletion: number;
  professionalCount: number;
}

/**
 * Classe de serviço para operações com planos de recursos
 */
class ResourcePlanService {
  /**
   * Busca todos os planos de recursos de um projeto
   * @param projectCode - Código do projeto (ex: PRJ0161122)
   * @returns Promise com array de planos de recursos
   * @throws {ApiError} Lança erro se a requisição falhar
   * 
   * @example
   * ```typescript
   * try {
   *   const plans = await resourcePlanService.getByProjectCode('PRJ0161122');
   *   console.log(`Total de planos: ${plans.length}`);
   * } catch (error) {
   *   console.error('Erro ao buscar planos:', error);
   * }
   * ```
   */
  async getByProjectCode(projectCode: string): Promise<ResourcePlan[]> {
    this.validateProjectCode(projectCode);

    try {
      const response = await apiClient.get<ResourcePlanApiResponse>(
        API_ENDPOINTS.resourcePlans(projectCode)
      );

      this.validateResponse(response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || 'Falha ao buscar planos de recursos'
        );
      }

      return response.data.data;
    } catch (error) {
      throw this.handleError(
        error as ApiError,
        `Erro ao buscar planos de recursos do projeto ${projectCode}`
      );
    }
  }

  /**
   * Busca planos de recursos com filtros aplicados
   * @param projectCode - Código do projeto
   * @param filters - Filtros opcionais para refinar a busca
   * @returns Promise com array filtrado de planos de recursos
   * 
   * @example
   * ```typescript
   * const plans = await resourcePlanService.getByProjectCodeWithFilters('PRJ0161122', {
   *   professionalName: 'ADRIAN',
   *   startDate: '2025-09-01'
   * });
   * ```
   */
  async getByProjectCodeWithFilters(
    projectCode: string,
    filters?: ResourcePlanFilters
  ): Promise<ResourcePlan[]> {
    const allPlans = await this.getByProjectCode(projectCode);

    if (!filters) {
      return allPlans;
    }

    return this.applyFilters(allPlans, filters);
  }

  /**
   * Busca um plano de recurso específico por número
   * @param projectCode - Código do projeto
   * @param planNumber - Número do plano de recurso (ex: RPLN0166663)
   * @returns Promise com o plano de recurso ou undefined se não encontrado
   */
  async getByPlanNumber(
    projectCode: string,
    planNumber: string
  ): Promise<ResourcePlan | undefined> {
    this.validatePlanNumber(planNumber);

    const plans = await this.getByProjectCode(projectCode);
    return plans.find(plan => plan.numero === planNumber);
  }

  /**
   * Busca planos de recursos por profissional
   * @param projectCode - Código do projeto
   * @param professionalName - Nome do profissional (busca parcial)
   * @returns Promise com array de planos do profissional
   */
  async getByProfessional(
    projectCode: string,
    professionalName: string
  ): Promise<ResourcePlan[]> {
    if (!professionalName || professionalName.trim().length === 0) {
      throw new Error('Nome do profissional é obrigatório');
    }

    const plans = await this.getByProjectCode(projectCode);
    const searchTerm = professionalName.trim().toLowerCase();

    return plans.filter(plan =>
      plan.profissional_nome.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Calcula estatísticas agregadas dos planos de recursos
   * @param projectCode - Código do projeto
   * @returns Promise com estatísticas calculadas
   */
  async getStats(projectCode: string): Promise<ResourcePlanStats> {
    const plans = await this.getByProjectCode(projectCode);

    const totalHours = plans.reduce(
      (sum, plan) => sum + parseFloat(plan.saldo_horas || '0'),
      0
    );

    const totalCompletion = plans.reduce(
      (sum, plan) => sum + plan.perc_atingido,
      0
    );

    const uniqueProfessionals = new Set(
      plans.map(plan => plan.profissional_nome).filter(Boolean)
    );

    return {
      totalPlans: plans.length,
      totalHours: Math.round(totalHours * 100) / 100,
      averageCompletion: plans.length > 0 
        ? Math.round((totalCompletion / plans.length) * 100) / 100 
        : 0,
      professionalCount: uniqueProfessionals.size,
    };
  }

  /**
   * Busca planos ativos (que não terminaram ainda)
   * @param projectCode - Código do projeto
   * @param referenceDate - Data de referência (padrão: hoje)
   * @returns Promise com planos ativos
   */
  async getActivePlans(
    projectCode: string,
    referenceDate: Date = new Date()
  ): Promise<ResourcePlan[]> {
    const plans = await this.getByProjectCode(projectCode);
    const refDateStr = referenceDate.toISOString().split('T')[0];

    return plans.filter(plan => plan.fim >= refDateStr);
  }

  /**
   * Aplica filtros localmente aos planos de recursos
   * @param plans - Array de planos
   * @param filters - Filtros a aplicar
   * @returns Array filtrado
   */
  private applyFilters(
    plans: ResourcePlan[],
    filters: ResourcePlanFilters
  ): ResourcePlan[] {
    return plans.filter(plan => {
      if (filters.startDate && plan.inicio < filters.startDate) {
        return false;
      }

      if (filters.endDate && plan.fim > filters.endDate) {
        return false;
      }

      if (filters.professionalName) {
        const searchTerm = filters.professionalName.toLowerCase();
        if (!plan.profissional_nome.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Valida o código do projeto
   * @param projectCode - Código a ser validado
   * @throws {Error} Se o código for inválido
   */
  private validateProjectCode(projectCode: string): void {
    if (!projectCode || typeof projectCode !== 'string') {
      throw new Error('Código do projeto é obrigatório e deve ser uma string');
    }

    if (projectCode.trim().length === 0) {
      throw new Error('Código do projeto não pode estar vazio');
    }

    // Valida formato esperado: PRJ seguido de números
    const projectCodePattern = /^PRJ\d+$/;
    if (!projectCodePattern.test(projectCode.trim())) {
      throw new Error(
        `Formato inválido do código do projeto: ${projectCode}. Esperado: PRJ seguido de números (ex: PRJ0161122)`
      );
    }
  }

  /**
   * Valida o número do plano de recurso
   * @param planNumber - Número a ser validado
   * @throws {Error} Se o número for inválido
   */
  private validatePlanNumber(planNumber: string): void {
    if (!planNumber || typeof planNumber !== 'string') {
      throw new Error('Número do plano é obrigatório e deve ser uma string');
    }

    // Valida formato esperado: RPLN seguido de números
    const planNumberPattern = /^RPLN\d+/;
    if (!planNumberPattern.test(planNumber.trim())) {
      throw new Error(
        `Formato inválido do número do plano: ${planNumber}. Esperado: RPLN seguido de números (ex: RPLN0166663)`
      );
    }
  }

  /**
   * Valida a resposta da API
   * @param data - Dados da resposta
   * @throws {Error} Se a resposta for inválida
   */
  private validateResponse(data: unknown): void {
    if (!isResourcePlanApiResponse(data)) {
      throw new Error('Resposta da API em formato inválido');
    }
  }

  /**
   * Trata erros e adiciona contexto adicional
   * @param error - Erro original
   * @param context - Contexto adicional
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
 * Instância singleton do serviço de planos de recursos
 * Exporta uma instância única para ser usada em toda a aplicação
 */
export const resourcePlanService = new ResourcePlanService();

/**
 * Exporta a classe para casos de uso avançados (testes, extensões)
 */
export { ResourcePlanService };
