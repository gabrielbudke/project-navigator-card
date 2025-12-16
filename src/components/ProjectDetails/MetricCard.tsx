import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type MetricVariant = "default" | "success" | "warning" | "danger";

interface MetricCardProps {
  label: string;
  value: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  icon?: LucideIcon;
  variant?: MetricVariant;
  className?: string;
}

const variantStyles: Record<MetricVariant, string> = {
  default: "border-grayscale-20",
  success: "border-status-stable",
  warning: "border-status-warning",
  danger: "border-status-critical",
};

const variantValueStyles: Record<MetricVariant, string> = {
  default: "text-grayscale-100",
  success: "text-status-stable",
  warning: "text-status-warning",
  danger: "text-status-critical",
};

/**
 * Card para métricas com destaque visual
 */
const MetricCard = ({
  label,
  value,
  secondaryLabel,
  secondaryValue,
  icon: Icon,
  variant = "default",
  className,
}: MetricCardProps) => {
  return (
    <div
      className={cn(
        "bg-card rounded-lg border-l-4 p-4",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-grayscale-10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-grayscale-60" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-small font-open-sans text-grayscale-60 mb-1">{label}</p>
          <p className={cn("text-h3-bold font-inter truncate", variantValueStyles[variant])}>
            {value}
          </p>
          {secondaryLabel && secondaryValue && (
            <div className="mt-2 pt-2 border-t border-grayscale-10">
              <p className="text-small font-open-sans text-grayscale-50">{secondaryLabel}</p>
              <p className="text-body font-inter text-grayscale-80">{secondaryValue}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
