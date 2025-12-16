import { useMemo } from "react";
import { ProjectData } from "@/types/project";
import { PROJECT_STEPS } from "@/utils/constants";
import { Step } from "@/components/ProjectStepper";

/**
 * Mock data - em produção viria de uma API
 */
const projectsData: Record<string, ProjectData> = {
  "1": {
    nome: "Projeto Alpha",
    subtitle: "Sistema de Gestão Interna",
    numeroSNOW: "INC123456",
    status: "stable",
    currentStep: 3,
    stepWarnings: [],
    inicio: "2024-03-01",
    fim: "2024-09-30",
    percentualConcluido: 65.5,
    percentualPlanejado: 70.0,
    valorVendido: 500000.0,
    valorAtingido: 325000.0,
    rentabilidadePrevista: 25.5,
    rentabilidadeAtual: 22.3,
    saldoHoras: 1250,
    reconhecido: 300000.0,
    description: "Desenvolvimento de um sistema completo de gestão interna para otimização de processos corporativos.",
    teamMembers: ["Ana Silva", "Carlos Santos", "Maria Oliveira"],
    tasks: [
      { name: "Levantamento de requisitos", completed: true },
      { name: "Prototipagem", completed: true },
      { name: "Desenvolvimento frontend", completed: true },
      { name: "Desenvolvimento backend", completed: false },
      { name: "Testes de integração", completed: false },
    ],
    activities: [
      {
        nome: "Desenvolvimento do módulo de autenticação",
        numero: "ACT-001",
        profissional: "Ana Silva",
        inicio: "2024-03-15",
        fim: "2024-04-15",
        percentualAtingido: 100,
        percentualPlanejado: 100,
        horasApontadas: 120,
        saldoHoras: 0,
      },
      {
        nome: "Implementação da dashboard",
        numero: "ACT-002",
        profissional: "Carlos Santos",
        inicio: "2024-04-01",
        fim: "2024-05-30",
        percentualAtingido: 85,
        percentualPlanejado: 90,
        horasApontadas: 180,
        saldoHoras: 40,
      },
      {
        nome: "API de integração com sistemas legados",
        numero: "ACT-003",
        profissional: "Maria Oliveira",
        inicio: "2024-05-01",
        fim: "2024-07-15",
        percentualAtingido: 45,
        percentualPlanejado: 60,
        horasApontadas: 95,
        saldoHoras: 85,
      },
    ],
  },
  "2": {
    nome: "Projeto Beta",
    subtitle: "Aplicativo Mobile",
    numeroSNOW: "INC789012",
    status: "warning",
    currentStep: 2,
    stepWarnings: [1],
    inicio: "2024-04-15",
    fim: "2024-12-15",
    percentualConcluido: 30.0,
    percentualPlanejado: 45.0,
    valorVendido: 250000.0,
    valorAtingido: 75000.0,
    rentabilidadePrevista: 20.0,
    rentabilidadeAtual: 15.5,
    saldoHoras: 800,
    reconhecido: 70000.0,
    description: "Aplicativo mobile para gestão de tarefas e produtividade pessoal.",
    teamMembers: ["João Pedro", "Fernanda Costa"],
    tasks: [
      { name: "Definição de escopo", completed: true },
      { name: "Design de interfaces", completed: false },
      { name: "Desenvolvimento", completed: false },
    ],
    activities: [
      {
        nome: "Design de wireframes",
        numero: "ACT-101",
        profissional: "João Pedro",
        inicio: "2024-04-20",
        fim: "2024-05-15",
        percentualAtingido: 100,
        percentualPlanejado: 100,
        horasApontadas: 60,
        saldoHoras: 0,
      },
      {
        nome: "Prototipagem em Figma",
        numero: "ACT-102",
        profissional: "Fernanda Costa",
        inicio: "2024-05-10",
        fim: "2024-06-30",
        percentualAtingido: 40,
        percentualPlanejado: 70,
        horasApontadas: 45,
        saldoHoras: 75,
      },
    ],
  },
  "3": {
    nome: "Projeto Gamma",
    subtitle: "Plataforma E-commerce",
    numeroSNOW: "INC345678",
    status: "critical",
    currentStep: 4,
    stepWarnings: [2, 3],
    inicio: "2024-01-01",
    fim: "2024-06-30",
    percentualConcluido: 85.0,
    percentualPlanejado: 95.0,
    valorVendido: 750000.0,
    valorAtingido: 637500.0,
    rentabilidadePrevista: 30.0,
    rentabilidadeAtual: 18.5,
    saldoHoras: 350,
    reconhecido: 600000.0,
    description: "Plataforma de e-commerce completa com integração de pagamentos e logística.",
    teamMembers: ["Roberto Lima", "Patrícia Mendes", "Lucas Ferreira", "Julia Santos"],
    tasks: [
      { name: "Arquitetura do sistema", completed: true },
      { name: "Módulo de produtos", completed: true },
      { name: "Módulo de pagamentos", completed: true },
      { name: "Integração logística", completed: false },
      { name: "Deploy em produção", completed: false },
    ],
    activities: [
      {
        nome: "Integração com gateway de pagamento",
        numero: "ACT-301",
        profissional: "Roberto Lima",
        inicio: "2024-03-01",
        fim: "2024-04-30",
        percentualAtingido: 100,
        percentualPlanejado: 100,
        horasApontadas: 200,
        saldoHoras: 0,
      },
      {
        nome: "Sistema de gestão de estoque",
        numero: "ACT-302",
        profissional: "Patrícia Mendes",
        inicio: "2024-04-01",
        fim: "2024-05-31",
        percentualAtingido: 95,
        percentualPlanejado: 100,
        horasApontadas: 175,
        saldoHoras: 15,
      },
      {
        nome: "Integração com transportadoras",
        numero: "ACT-303",
        profissional: "Lucas Ferreira",
        inicio: "2024-05-01",
        fim: "2024-06-15",
        percentualAtingido: 60,
        percentualPlanejado: 90,
        horasApontadas: 90,
        saldoHoras: 60,
      },
      {
        nome: "Otimização de performance",
        numero: "ACT-304",
        profissional: "Julia Santos",
        inicio: "2024-05-15",
        fim: "2024-06-30",
        percentualAtingido: 30,
        percentualPlanejado: 80,
        horasApontadas: 40,
        saldoHoras: 100,
      },
    ],
  },
};

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

interface UseProjectDataReturn {
  project: ProjectData | null;
  steps: Step[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook para gerenciar dados do projeto
 */
export const useProjectData = (projectId: string | undefined): UseProjectDataReturn => {
  const project = useMemo(() => {
    if (!projectId) return null;
    return projectsData[projectId] || null;
  }, [projectId]);

  const steps = useMemo(() => {
    if (!project) return [];
    return generateSteps(project.currentStep, project.stepWarnings);
  }, [project]);

  return {
    project,
    steps,
    isLoading: false,
    error: project ? null : "Projeto não encontrado",
  };
};
