import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type StepStatus = "completed" | "current" | "inactive";

export interface Step {
  label: string;
  status: StepStatus;
}

interface ProjectStepperProps {
  steps: Step[];
  className?: string;
}

const ProjectStepper = ({ steps, className }: ProjectStepperProps) => {
  return (
    <div className={cn("flex items-start justify-between w-full", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start flex-1 last:flex-none">
          {/* Step Circle and Label */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-small font-open-sans border-2 transition-colors",
                step.status === "completed" && "bg-primary border-primary",
                step.status === "current" && "bg-primary border-primary",
                step.status === "inactive" && "bg-grayscale-0 border-grayscale-20"
              )}
            >
              {step.status === "completed" ? (
                <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
              ) : (
                <span
                  className={cn(
                    "text-small-bold",
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
                "mt-2 text-small font-open-sans text-center max-w-[80px]",
                step.status === "completed" && "text-grayscale-100 font-semibold",
                step.status === "current" && "text-grayscale-100 font-semibold",
                step.status === "inactive" && "text-grayscale-60"
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="flex-1 h-6 flex items-center px-2">
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
  );
};

export default ProjectStepper;
