import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import ProjectStepper, { Step } from "./ProjectStepper";

export type ProjectStatus = "stable" | "warning" | "critical" | "outdated";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  status: ProjectStatus;
  currentStep: number;
  className?: string;
  children?: React.ReactNode;
}

const statusBorderColors: Record<ProjectStatus, string> = {
  stable: "border-status-stable",
  warning: "border-status-warning",
  critical: "border-status-critical",
  outdated: "border-status-outdated",
};

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
  "Pré Iniciação",
  "Iniciação",
  "Planejamento",
  "Execução",
  "Encerramento",
  "Encerrado",
];

const getSteps = (currentStep: number): Step[] => {
  return PROJECT_STEPS.map((label, index) => ({
    label,
    status:
      index < currentStep
        ? "completed"
        : index === currentStep
        ? "current"
        : "inactive",
  }));
};

const ProjectCard = ({
  title,
  subtitle,
  status,
  currentStep,
  className,
  children,
}: ProjectCardProps) => {
  const steps = getSteps(currentStep);

  return (
    <div
      className={cn(
        "bg-card rounded-lg border-l-4 shadow-sm overflow-hidden",
        statusBorderColors[status],
        className
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-grayscale-10 flex items-center justify-center flex-shrink-0">
          <Rocket className="w-5 h-5 text-grayscale-70" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-h3-bold font-inter text-grayscale-100 truncate">
            {title}
          </h3>
          <p className="text-small font-open-sans text-grayscale-60">
            {subtitle}
          </p>
        </div>
        <span
          className={cn(
            "px-2 py-1 rounded text-small-bold font-open-sans flex-shrink-0",
            statusBadgeColors[status]
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      {/* Stepper */}
      <div className="px-4 pb-4">
        <ProjectStepper steps={steps} />
      </div>

      {/* Slot Content */}
      {children && (
        <div className="bg-grayscale-5 p-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
