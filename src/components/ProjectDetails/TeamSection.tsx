import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamSectionProps {
  members: string[];
  className?: string;
}

/**
 * Seção de equipe do projeto
 */
const TeamSection = ({ members, className }: TeamSectionProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-grayscale-50" />
        <h3 className="text-label-bold font-inter text-grayscale-80">Equipe</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <span
            key={member}
            className="px-2 py-1 bg-grayscale-10 rounded text-small font-open-sans text-grayscale-70"
          >
            {member}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
