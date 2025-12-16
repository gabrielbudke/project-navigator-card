import { Calendar } from "lucide-react";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/lib/utils";

interface DateRangeProps {
  startDate: string;
  endDate: string;
  startLabel?: string;
  endLabel?: string;
  className?: string;
}

/**
 * Componente para exibir período (início - fim)
 */
const DateRange = ({
  startDate,
  endDate,
  startLabel = "Início",
  endLabel = "Previsão",
  className,
}: DateRangeProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-grayscale-50" />
        <h3 className="text-label-bold font-inter text-grayscale-80">Datas</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-small font-open-sans text-grayscale-60">{startLabel}</p>
          <p className="text-body font-inter text-grayscale-100">{formatDate(startDate)}</p>
        </div>
        <div>
          <p className="text-small font-open-sans text-grayscale-60">{endLabel}</p>
          <p className="text-body font-inter text-grayscale-100">{formatDate(endDate)}</p>
        </div>
      </div>
    </div>
  );
};

export default DateRange;
