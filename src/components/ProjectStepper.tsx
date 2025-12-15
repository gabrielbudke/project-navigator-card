import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "completed" | "current" | "inactive";

export interface Step {
  label: string;
  shortLabel?: string;
  status: StepStatus;
}

interface ProjectStepperProps {
  steps: Step[];
  className?: string;
}

const ProjectStepper = ({ steps, className }: ProjectStepperProps) => {
  return (
    <div 
      className={cn(
        "flex items-start w-full overflow-x-auto scrollbar-hide pb-2 -mb-2",
        "sm:overflow-visible sm:pb-0 sm:-mb-0",
        className
      )}
    >
      <div className="flex items-start min-w-max sm:min-w-0 sm:w-full sm:justify-between">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={cn(
              "flex items-start",
              index < steps.length - 1 ? "flex-1 min-w-[70px] sm:min-w-0" : "flex-none"
            )}
          >
            {/* Step Circle and Label */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-small font-open-sans border-2 transition-colors flex-shrink-0",
                  step.status === "completed" && "bg-primary border-primary",
                  step.status === "current" && "bg-primary border-primary",
                  step.status === "inactive" && "bg-grayscale-0 border-grayscale-20"
                )}
              >
                {step.status === "completed" ? (
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary-foreground" strokeWidth={3} />
                ) : (
                  <span
                    className={cn(
                      "text-[10px] sm:text-small font-bold",
                      step.status === "current" && "text-primary-foreground",
                      step.status === "inactive" && "text-grayscale-60"
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "mt-1.5 sm:mt-2 text-[10px] sm:text-small font-open-sans text-center leading-tight",
                  "max-w-[60px] sm:max-w-[80px]",
                  step.status === "completed" && "text-grayscale-100 font-semibold",
                  step.status === "current" && "text-grayscale-100 font-semibold",
                  step.status === "inactive" && "text-grayscale-60"
                )}
              >
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel || step.label}</span>
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-5 sm:h-6 flex items-center px-1 sm:px-2 min-w-[20px] sm:min-w-[30px]">
                <div
                  className={cn(
                    "h-0.5 w-full transition-colors",
                    step.status === "completed" || step.status === "current"
                      ? "bg-primary"
                      : "bg-grayscale-20"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectStepper;
