import { cn } from "@/lib/utils";

export type ProgressVariant = "primary" | "stable" | "warning" | "critical";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  className?: string;
}

const variantColors: Record<ProgressVariant, string> = {
  primary: "bg-primary",
  stable: "bg-status-stable",
  warning: "bg-status-warning",
  critical: "bg-status-critical",
};

const ProgressBar = ({
  value,
  max = 100,
  variant = "primary",
  showLabel = true,
  className,
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-5 sm:h-6 bg-grayscale-10 rounded overflow-hidden">
        <div
          className={cn(
            "h-full rounded transition-all duration-300 flex items-center",
            variantColors[variant]
          )}
          style={{ width: `${percentage}%` }}
        >
          {showLabel && percentage >= 15 && (
            <span className="px-2 text-[10px] sm:text-small font-open-sans font-semibold text-primary-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        {showLabel && percentage < 15 && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] sm:text-small font-open-sans font-semibold text-grayscale-60">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
