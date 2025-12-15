import { Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "completed" | "current" | "inactive";

export interface Step {
  label: string;
  shortLabel?: string;
  status: StepStatus;
  hasWarning?: boolean;
}

interface ProjectStepperProps {
  steps: Step[];
  className?: string;
}

const ProjectStepper = ({ steps, className }: ProjectStepperProps) => {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto scrollbar-hide pb-2 -mb-2",
        "sm:overflow-visible sm:pb-0 sm:-mb-0",
        className
      )}
    >
      <div className="min-w-max sm:min-w-0">
        {/* Circles and Lines Row */}
        <div className="flex items-center w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center",
                index < steps.length - 1 ? "flex-1" : "flex-none"
              )}
            >
              {/* Circle */}
              <div
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-small font-open-sans border-2 transition-colors flex-shrink-0 z-10",
                  step.hasWarning && "bg-status-warning border-status-warning",
                  !step.hasWarning && step.status === "completed" && "bg-grayscale-60 border-grayscale-60",
                  !step.hasWarning && step.status === "current" && "bg-background border-grayscale-60",
                  !step.hasWarning && step.status === "inactive" && "bg-background border-grayscale-20"
                )}
              >
                {step.hasWarning ? (
                  <AlertTriangle className="w-4 h-4 text-white" strokeWidth={2.5} />
                ) : step.status === "completed" ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : (
                  <span
                    className={cn(
                      "text-xs sm:text-small font-semibold",
                      step.status === "current" && "text-grayscale-60",
                      step.status === "inactive" && "text-grayscale-40"
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 -ml-[1px] -mr-[1px]">
                  <div
                    className={cn(
                      "h-full w-full transition-colors",
                      step.status === "completed" ? "bg-grayscale-60" : "bg-grayscale-20"
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Labels Row */}
        <div className="flex w-full mt-2 sm:mt-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center text-center",
                index < steps.length - 1 ? "flex-1" : "flex-none",
                index === 0 && "items-start",
                index === steps.length - 1 && "items-end"
              )}
              style={{
                width: index < steps.length - 1 ? undefined : "auto",
                minWidth: index === 0 || index === steps.length - 1 ? "fit-content" : undefined,
              }}
            >
              <span
                className={cn(
                  "text-[10px] sm:text-small font-open-sans leading-tight",
                  "max-w-[55px] sm:max-w-[80px]",
                  step.hasWarning && "text-status-warning font-semibold",
                  !step.hasWarning && step.status === "completed" && "text-grayscale-100 font-semibold",
                  !step.hasWarning && step.status === "current" && "text-grayscale-100 font-semibold",
                  !step.hasWarning && step.status === "inactive" && "text-grayscale-40"
                )}
              >
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{step.shortLabel || step.label}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectStepper;
