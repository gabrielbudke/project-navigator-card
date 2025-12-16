/**
 * Resource Plans Hook
 * Hook customizado para integração com React Query
 * Gerencia busca e cache de planos de recursos
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { resourcePlanService, type ResourcePlanStats } from '@/services';
import { ResourcePlan, ResourcePlanFilters } from '@/types/resourcePlan';

/**
 * Chaves para o cache do React Query
 * Uso de factory pattern para garantir consistência
 */
export const resourcePlanKeys = {
  all: ['resourcePlans'] as const,
  byProject: (projectCode: string) => ['resourcePlans', projectCode] as const,
  byProjectFiltered: (projectCode: string, filters: ResourcePlanFilters) =>
    ['resourcePlans', projectCode, filters] as const,
  byPlanNumber: (projectCode: string, planNumber: string) =>
    ['resourcePlans', projectCode, 'plan', planNumber] as const,
  byProfessional: (projectCode: string, professionalName: string) =>
    ['resourcePlans', projectCode, 'professional', professionalName] as const,
  stats: (projectCode: string) => ['resourcePlans', projectCode, 'stats'] as const,
  active: (projectCode: string) => ['resourcePlans', projectCode, 'active'] as const,
};

/**
 * Configurações padrão para queries
 */
const DEFAULT_QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
  retry: 2,
  refetchOnWindowFocus: false,
};

/**
 * Hook para buscar planos de recursos por código do projeto
 * @param projectCode - Código do projeto
 * @param enabled - Se a query deve ser executada (padrão: true)
 * @returns Query result com os planos de recursos
 * 
 * @example
 * ```tsx
 * function ProjectResourcePlans({ projectCode }: { projectCode: string }) {
 *   const { data, isLoading, error } = useResourcePlans(projectCode);
 *   
 *   if (isLoading) return <div>Carregando...</div>;
 *   if (error) return <div>Erro: {error.message}</div>;
 *   
 *   return (
 *     <div>
 *       {data?.map(plan => (
 *         <div key={plan.numero}>{plan.nome}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useResourcePlans(
  projectCode: string,
  enabled: boolean = true
): UseQueryResult<ResourcePlan[], Error> {
  return useQuery({
    queryKey: resourcePlanKeys.byProject(projectCode),
    queryFn: () => resourcePlanService.getByProjectCode(projectCode),
    enabled: enabled && !!projectCode,
    ...DEFAULT_QUERY_CONFIG,
  });
}

/**
 * Hook para buscar planos de recursos com filtros
 * @param projectCode - Código do projeto
 * @param filters - Filtros a aplicar
 * @param enabled - Se a query deve ser executada
 * @returns Query result com os planos filtrados
 * 
 * @example
 * ```tsx
 * const { data } = useResourcePlansFiltered('PRJ0161122', {
 *   professionalName: 'ADRIAN',
 *   startDate: '2025-09-01'
 * });
 * ```
 */
export function useResourcePlansFiltered(
  projectCode: string,
  filters: ResourcePlanFilters,
  enabled: boolean = true
): UseQueryResult<ResourcePlan[], Error> {
  return useQuery({
    queryKey: resourcePlanKeys.byProjectFiltered(projectCode, filters),
    queryFn: () => 
      resourcePlanService.getByProjectCodeWithFilters(projectCode, filters),
    enabled: enabled && !!projectCode,
    ...DEFAULT_QUERY_CONFIG,
  });
}

/**
 * Hook para buscar um plano de recurso específico
 * @param projectCode - Código do projeto
 * @param planNumber - Número do plano
 * @param enabled - Se a query deve ser executada
 * @returns Query result com o plano específico
 * 
 * @example
 * ```tsx
 * const { data: plan } = useResourcePlan('PRJ0161122', 'RPLN0166663');
 * ```
 */
export function useResourcePlan(
  projectCode: string,
  planNumber: string,
  enabled: boolean = true
): UseQueryResult<ResourcePlan | undefined, Error> {
  return useQuery({
    queryKey: resourcePlanKeys.byPlanNumber(projectCode, planNumber),
    queryFn: () => 
      resourcePlanService.getByPlanNumber(projectCode, planNumber),
    enabled: enabled && !!projectCode && !!planNumber,
    ...DEFAULT_QUERY_CONFIG,
  });
}

/**
 * Hook para buscar planos por profissional
 * @param projectCode - Código do projeto
 * @param professionalName - Nome do profissional
 * @param enabled - Se a query deve ser executada
 * @returns Query result com os planos do profissional
 * 
 * @example
 * ```tsx
 * const { data: plans } = useResourcePlansByProfessional(
 *   'PRJ0161122', 
 *   'ADRIAN STEINSTRASSER'
 * );
 * ```
 */
export function useResourcePlansByProfessional(
  projectCode: string,
  professionalName: string,
  enabled: boolean = true
): UseQueryResult<ResourcePlan[], Error> {
  return useQuery({
    queryKey: resourcePlanKeys.byProfessional(projectCode, professionalName),
    queryFn: () => 
      resourcePlanService.getByProfessional(projectCode, professionalName),
    enabled: enabled && !!projectCode && !!professionalName,
    ...DEFAULT_QUERY_CONFIG,
  });
}

/**
 * Hook para buscar estatísticas de planos de recursos
 * @param projectCode - Código do projeto
 * @param enabled - Se a query deve ser executada
 * @returns Query result com estatísticas agregadas
 * 
 * @example
 * ```tsx
 * const { data: stats } = useResourcePlanStats('PRJ0161122');
 * 
 * // stats.totalPlans, stats.totalHours, stats.averageCompletion
 * ```
 */
export function useResourcePlanStats(
  projectCode: string,
  enabled: boolean = true
): UseQueryResult<ResourcePlanStats, Error> {
  return useQuery({
    queryKey: resourcePlanKeys.stats(projectCode),
    queryFn: () => resourcePlanService.getStats(projectCode),
    enabled: enabled && !!projectCode,
    ...DEFAULT_QUERY_CONFIG,
  });
}

/**
 * Hook para buscar planos ativos
 * @param projectCode - Código do projeto
 * @param referenceDate - Data de referência (opcional)
 * @param enabled - Se a query deve ser executada
 * @returns Query result com planos ativos
 * 
 * @example
 * ```tsx
 * const { data: activePlans } = useActiveResourcePlans('PRJ0161122');
 * ```
 */
export function useActiveResourcePlans(
  projectCode: string,
  referenceDate?: Date,
  enabled: boolean = true
): UseQueryResult<ResourcePlan[], Error> {
  return useQuery({
    queryKey: resourcePlanKeys.active(projectCode),
    queryFn: () => 
      resourcePlanService.getActivePlans(projectCode, referenceDate),
    enabled: enabled && !!projectCode,
    ...DEFAULT_QUERY_CONFIG,
  });
}
