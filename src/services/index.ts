/**
 * Services Barrel Export
 * Exporta todos os serviços da camada de serviço da aplicação
 */

// API Configuration
export { apiClient, API_ENDPOINTS, buildQueryParams, config } from './api.config';
export type { ApiError } from './api.config';

// Project Service
export { projectService, ProjectService } from './projectService';

// Resource Plan Service
export { 
  resourcePlanService, 
  ResourcePlanService,
  type ResourcePlanStats 
} from './resourcePlanService';

/**
 * Objeto agregador com todos os serviços
 * Útil para injeção de dependências ou testes
 */
export const services = {
  project: projectService,
  resourcePlan: resourcePlanService,
} as const;
