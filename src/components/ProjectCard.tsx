import { Rocket, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import ProjectStepper, { Step } from "./ProjectStepper";
import ProgressBar, { ProgressVariant } from "./ProgressBar";

export type ProjectStatus = "stable" | "warning" | "critical" | "outdated";

interface ProjectCardProps {
  title: string;
  subtitle: string;
  status: ProjectStatus;
  currentStep: number;
  progress?: number;
  progressVariant?: ProgressVariant;
  className?: string;
  onDetailsClick?: () => void;
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
  { full: "Pré-Iniciação", short: "Pré-Inic." },
  { full: "Iniciação", short: "Iniciação" },
  { full: "Planejamento", short: "Planej." },
  { full: "Execução", short: "Execução" },
  { full: "Encerramento", short: "Encerr." },
  { full: "Encerrado", short: "Encerr." },
];

const getSteps = (currentStep: number): Step[] => {
  return PROJECT_STEPS.map((step, index) => ({
    label: step.full,
    shortLabel: step.short,
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
  progress,
  progressVariant = "primary",
  className,
  onDetailsClick,
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
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
        {/* Mobile: Badge on top right */}
        <div className="flex items-start justify-between sm:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-grayscale-10 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-4 h-4 text-grayscale-70" />
            </div>
            <div className="min-w-0">
              <h3 className="text-label-bold font-inter text-grayscale-100 truncate">
                {title}
              </h3>
              <p className="text-small font-open-sans text-grayscale-60 truncate">
                {subtitle}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold font-open-sans flex-shrink-0",
              statusBadgeColors[status]
            )}
          >
            {statusLabels[status]}
          </span>
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden sm:flex sm:items-start sm:gap-3 sm:flex-1">
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
      </div>

      {/* Stepper */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <ProjectStepper steps={steps} />
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="px-3 pb-3 sm:px-4 sm:pb-4">
          <ProgressBar value={progress} variant={progressVariant} />
        </div>
      )}

      {/* Details Button */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto font-open-sans text-small border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          onClick={onDetailsClick}
        >
          Ver Detalhes
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Slot Content */}
      {children && (
        <div className="bg-grayscale-5 p-4 sm:p-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
