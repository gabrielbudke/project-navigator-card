import { cn } from "@/lib/utils";

interface DetailFieldProps {
  label: string;
  value: string | number;
  className?: string;
}

/**
 * Campo individual de informação (label + valor)
 */
const DetailField = ({ label, value, className }: DetailFieldProps) => {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-small font-open-sans text-grayscale-60">{label}</p>
      <p className="text-body font-inter font-medium text-grayscale-100">{value}</p>
    </div>
  );
};

export default DetailField;
