/**
 * Hook para gerenciar lista de projetos
 */

import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import { ProjectListItem } from "@/types/api";

interface UseProjectsReturn {
  projects: ProjectListItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook para buscar e gerenciar a lista de projetos
 */
export const useProjects = (): UseProjectsReturn => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });

  return {
    projects: data ?? [],
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
};
