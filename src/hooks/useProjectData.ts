import { useQuery } from "@tanstack/react-query";
import { ProjectData, ProjectActivity } from "@/types/project";
import { ProjectListItem, ResourcePlanActivity } from "@/types/api";
import { PROJECT_STEPS } from "@/utils/constants";
import { Step } from "@/components/ProjectStepper";
import { projectService } from "@/services/projectService";
import { resourcePlanService } from "@/services/resourcePlanService";

/**
 * Gera os steps do stepper baseado no estado atual
 */
const generateSteps = (currentStep: number, stepWarnings: number[] = []): Step[] => {
  const firstWarningIndex = stepWarnings.length > 0 ? Math.min(...stepWarnings) : -1;

  return PROJECT_STEPS.map((step, index) => {
    const hasWarning = stepWarnings.includes(index);

    let status: "completed" | "current" | "inactive";
    if (firstWarningIndex >= 0 && index > firstWarningIndex) {
      status = "inactive";
    } else if (index < currentStep && !hasWarning) {
      status = "completed";
    } else if (index === currentStep || (hasWarning && index < currentStep)) {
      status = "current";
    } else {
      status = "inactive";
    }

    return {
      label: step.full,
      shortLabel: step.short,
      status,
      hasWarning,
    };
  });
};

/**
 * Mapeia atividades da API para o formato interno
 */
const mapActivities = (activities: ResourcePlanActivity[]): ProjectActivity[] => {
  return activities.map((activity) => ({
    nome: activity.nome,
    numero: activity.numero,
    profissional: activity.profissional,
    inicio: activity.inicio,
    fim: activity.fim,
    percentualAtingido: activity.percentualAtingido,
    percentualPlanejado: activity.percentualPlanejado,
    horasApontadas: activity.horasApontadas,
    saldoHoras: activity.saldoHoras,
  }));
};

/**
 * Mapeia projeto da API para o formato interno
 */
const mapProjectToProjectData = (
  project: ProjectListItem,
  activities: ResourcePlanActivity[]
): ProjectData => {
  return {
    nome: project.title,
    subtitle: project.subtitle,
    numeroSNOW: project.id,
    status: project.status,
    currentStep: project.currentStep,
    stepWarnings: project.stepWarnings || [],
    inicio: "", // Será preenchido pela API de detalhes quando disponível
    fim: "",
    percentualConcluido: project.progress,
    percentualPlanejado: 100, // Default até ter na API
    valorVendido: 0,
    valorAtingido: 0,
    rentabilidadePrevista: 0,
    rentabilidadeAtual: 0,
    saldoHoras: 0,
    reconhecido: 0,
    description: "",
    teamMembers: [],
    tasks: [],
    activities: mapActivities(activities),
  };
};

interface UseProjectDataReturn {
  project: ProjectData | null;
  steps: Step[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para gerenciar dados do projeto via API
 */
export const useProjectData = (projectId: string | undefined): UseProjectDataReturn => {
  // Busca dados do projeto
  const {
    data: projectData,
    isLoading: isLoadingProject,
    error: projectError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectService.getById(projectId!),
    enabled: !!projectId,
  });

  // Busca atividades do plano de recurso
  const {
    data: activities,
    isLoading: isLoadingActivities,
    error: activitiesError,
  } = useQuery({
    queryKey: ["resourcePlan", projectId],
    queryFn: () => resourcePlanService.getByProjectNumber(projectId!),
    enabled: !!projectId,
  });

  const isLoading = isLoadingProject || isLoadingActivities;
  const error = projectError || activitiesError;

  // Monta o projeto completo com atividades
  const project = projectData
    ? mapProjectToProjectData(projectData, activities || [])
    : null;

  // Gera os steps baseado no projeto
  const steps = project
    ? generateSteps(project.currentStep, project.stepWarnings)
    : [];

  return {
    project,
    steps,
    isLoading,
    error: error ? "Erro ao carregar dados do projeto" : project ? null : "Projeto não encontrado",
  };
};
