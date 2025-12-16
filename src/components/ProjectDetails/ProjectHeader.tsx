import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/types/project";
import { STATUS_LABELS, STATUS_BADGE_COLORS } from "@/utils/constants";

interface ProjectHeaderProps {
  nome: string;
  subtitle: string;
  numeroSNOW: string;
  status: ProjectStatus;
}

/**
 * Cabeçalho do projeto com informações principais
 */
const ProjectHeader = ({ nome, subtitle, numeroSNOW, status }: ProjectHeaderProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-grayscale-10 flex items-center justify-center flex-shrink-0">
        <Rocket className="w-6 h-6 text-grayscale-70" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
          <h2 className="text-h2-bold font-inter text-grayscale-100 truncate">{nome}</h2>
          <span
            className={cn(
              "px-2 py-1 rounded text-small-bold font-open-sans whitespace-nowrap",
              STATUS_BADGE_COLORS[status]
            )}
          >
            {STATUS_LABELS[status]}
          </span>
        </div>
        <p className="text-body font-open-sans text-grayscale-60">{subtitle}</p>
        <p className="text-small font-open-sans text-grayscale-50 mt-1">SNOW: {numeroSNOW}</p>
      </div>
    </div>
  );
};

export default ProjectHeader;
