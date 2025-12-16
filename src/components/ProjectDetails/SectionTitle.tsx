import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  className?: string;
}

/**
 * Título de seção com separador - padrão visual do projeto
 */
const SectionTitle = ({ title, className }: SectionTitleProps) => {
  return (
    <div className={cn("mb-4 sm:mb-6", className)}>
      <h3 className="text-label-bold font-inter text-grayscale-80 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <div className="h-px bg-grayscale-20" />
    </div>
  );
};

export default SectionTitle;
