import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Rocket, Calendar, Users, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProjectStepper, { Step } from "@/components/ProjectStepper";
import ProgressBar from "@/components/ProgressBar";
import { cn } from "@/lib/utils";

type ProjectStatus = "stable" | "warning" | "critical" | "outdated";

const statusLabels: Record<ProjectStatus, string> = {
  stable: "Estável",
  warning: "Atenção",
  critical: "Crítico",
  outdated: "Desatualizado",
};

const statusBadgeColors: Record<ProjectStatus, string> = {
  stable: "bg-status-stable/10 text-status-stable",
  warning: "bg-status-warning/10 text-status-warning",
  critical: "bg-status-critical/10 text-status-critical",
  outdated: "bg-status-outdated/10 text-status-outdated",
};

const PROJECT_STEPS = [
  { full: "Pré-Iniciação", short: "Pré-Inic." },
  { full: "Iniciação", short: "Iniciação" },
  { full: "Planejamento", short: "Planej." },
  { full: "Execução", short: "Execução" },
  { full: "Encerramento", short: "Encerr." },
  { full: "Encerrado", short: "Encerr." },
];

// Mock data - in a real app this would come from an API
const projectsData: Record<string, {
  title: string;
  subtitle: string;
  status: ProjectStatus;
  currentStep: number;
  stepWarnings: number[];
  progress: number;
  description: string;
  startDate: string;
  endDate: string;
  teamMembers: string[];
  tasks: { name: string; completed: boolean }[];
}> = {
  "1": {
    title: "Projeto Alpha",
    subtitle: "Sistema de Gestão Interna",
    status: "stable",
    currentStep: 3,
    stepWarnings: [],
    progress: 65,
    description: "Desenvolvimento de um sistema completo de gestão interna para otimização de processos corporativos.",
    startDate: "01/03/2024",
    endDate: "30/09/2024",
    teamMembers: ["Ana Silva", "Carlos Santos", "Maria Oliveira"],
    tasks: [
      { name: "Levantamento de requisitos", completed: true },
      { name: "Prototipagem", completed: true },
      { name: "Desenvolvimento frontend", completed: true },
      { name: "Desenvolvimento backend", completed: false },
      { name: "Testes de integração", completed: false },
    ],
  },
  "2": {
    title: "Projeto Beta",
    subtitle: "Aplicativo Mobile",
    status: "warning",
    currentStep: 2,
    stepWarnings: [1],
    progress: 30,
    description: "Aplicativo mobile para gestão de tarefas e produtividade pessoal.",
    startDate: "15/04/2024",
    endDate: "15/12/2024",
    teamMembers: ["João Pedro", "Fernanda Costa"],
    tasks: [
      { name: "Definição de escopo", completed: true },
      { name: "Design de interfaces", completed: false },
      { name: "Desenvolvimento", completed: false },
    ],
  },
  "3": {
    title: "Projeto Gamma",
    subtitle: "Plataforma E-commerce",
    status: "critical",
    currentStep: 4,
    stepWarnings: [2, 3],
    progress: 85,
    description: "Plataforma de e-commerce completa com integração de pagamentos e logística.",
    startDate: "01/01/2024",
    endDate: "30/06/2024",
    teamMembers: ["Roberto Lima", "Patrícia Mendes", "Lucas Ferreira", "Julia Santos"],
    tasks: [
      { name: "Arquitetura do sistema", completed: true },
      { name: "Módulo de produtos", completed: true },
      { name: "Módulo de pagamentos", completed: true },
      { name: "Integração logística", completed: false },
      { name: "Deploy em produção", completed: false },
    ],
  },
};

const getSteps = (currentStep: number, stepWarnings: number[] = []): Step[] => {
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

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const project = id ? projectsData[id] : null;

  if (!project) {
    return (
      <main className="min-h-screen bg-grayscale-5 px-4 py-6 sm:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-h1 font-inter text-grayscale-100 mb-4">Projeto não encontrado</h1>
          <Button onClick={() => navigate("/")}>Voltar para projetos</Button>
        </div>
      </main>
    );
  }

  const steps = getSteps(project.currentStep, project.stepWarnings);

  return (
    <main className="min-h-screen bg-grayscale-5 px-4 py-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-grayscale-60 hover:text-grayscale-100"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Header title={project.title} />

        {/* Main Card */}
        <div className="bg-card rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Header with status */}
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-grayscale-10 flex items-center justify-center flex-shrink-0">
                <Rocket className="w-6 h-6 text-grayscale-70" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-h2-bold font-inter text-grayscale-100">{project.title}</h2>
                  <span className={cn("px-2 py-1 rounded text-small-bold font-open-sans", statusBadgeColors[project.status])}>
                    {statusLabels[project.status]}
                  </span>
                </div>
                <p className="text-body font-open-sans text-grayscale-60">{project.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <h3 className="text-label-bold font-inter text-grayscale-80 mb-4">Etapas do Projeto</h3>
            <ProjectStepper steps={steps} />
          </div>

          {/* Progress */}
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <h3 className="text-label-bold font-inter text-grayscale-80 mb-4">Progresso Geral</h3>
            <ProgressBar value={project.progress} variant="primary" showLabel />
          </div>

          {/* Description */}
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <h3 className="text-label-bold font-inter text-grayscale-80 mb-2">Descrição</h3>
            <p className="text-body font-open-sans text-grayscale-70">{project.description}</p>
          </div>

          {/* Info Grid */}
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Dates */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-grayscale-50" />
                <h3 className="text-label-bold font-inter text-grayscale-80">Datas</h3>
              </div>
              <div className="space-y-2">
                <p className="text-small font-open-sans text-grayscale-60">
                  <span className="text-grayscale-80">Início:</span> {project.startDate}
                </p>
                <p className="text-small font-open-sans text-grayscale-60">
                  <span className="text-grayscale-80">Previsão:</span> {project.endDate}
                </p>
              </div>
            </div>

            {/* Team */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-grayscale-50" />
                <h3 className="text-label-bold font-inter text-grayscale-80">Equipe</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.teamMembers.map((member) => (
                  <span key={member} className="px-2 py-1 bg-grayscale-10 rounded text-small font-open-sans text-grayscale-70">
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-card rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-grayscale-50" />
              <h3 className="text-label-bold font-inter text-grayscale-80">Tarefas</h3>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <ul className="space-y-3">
              {project.tasks.map((task, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle 
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      task.completed ? "text-status-stable" : "text-grayscale-30"
                    )} 
                  />
                  <span className={cn(
                    "text-body font-open-sans",
                    task.completed ? "text-grayscale-70 line-through" : "text-grayscale-100"
                  )}>
                    {task.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProjectDetails;
