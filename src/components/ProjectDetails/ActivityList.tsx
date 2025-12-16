import { cn } from "@/lib/utils";
import { ProjectActivity } from "@/types/project";
import { formatDate, formatPercentage, formatHours } from "@/utils/formatters";
import SectionTitle from "./SectionTitle";
import ProgressBar from "@/components/ProgressBar";

interface ActivityListProps {
  activities: ProjectActivity[];
  className?: string;
}

interface ActivityFieldProps {
  label: string;
  value: string | number;
  className?: string;
}

const ActivityField = ({ label, value, className }: ActivityFieldProps) => (
  <div className={cn("min-w-0", className)}>
    <span className="text-small font-open-sans text-grayscale-50 block truncate">
      {label}
    </span>
    <span className="text-label font-open-sans text-grayscale-100 block truncate">
      {value}
    </span>
  </div>
);

interface ActivityCardProps {
  activity: ProjectActivity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div className="bg-card border border-grayscale-20 rounded-lg p-4 sm:p-5">
      {/* Header - Nome e Número */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h4 className="text-h3-bold font-inter text-grayscale-100 truncate">
          {activity.nome}
        </h4>
        <span className="text-small font-open-sans text-grayscale-50 shrink-0">
          #{activity.numero}
        </span>
      </div>

      {/* Profissional */}
      <div className="mb-4">
        <ActivityField label="Profissional" value={activity.profissional} />
      </div>

      {/* Grid de informações */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <ActivityField label="Início" value={formatDate(activity.inicio)} />
        <ActivityField label="Fim" value={formatDate(activity.fim)} />
        <ActivityField label="Horas Apontadas" value={formatHours(activity.horasApontadas)} />
        <ActivityField label="Saldo de Horas" value={formatHours(activity.saldoHoras)} />
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-small font-open-sans mb-1">
            <span className="text-grayscale-50">Atingido</span>
            <span className="text-grayscale-100">
              {formatPercentage(activity.percentualAtingido)}
            </span>
          </div>
          <ProgressBar value={activity.percentualAtingido} variant="primary" />
        </div>
        <div>
          <div className="flex justify-between text-small font-open-sans mb-1">
            <span className="text-grayscale-50">Planejado</span>
            <span className="text-grayscale-100">
              {formatPercentage(activity.percentualPlanejado)}
            </span>
          </div>
          <ProgressBar value={activity.percentualPlanejado} variant="stable" />
        </div>
      </div>
    </div>
  );
};

/**
 * Lista de atividades/tarefas do projeto
 */
const ActivityList = ({ activities, className }: ActivityListProps) => {
  if (!activities || activities.length === 0) {
    return (
      <div className={cn("bg-card rounded-lg shadow-sm p-4 sm:p-6", className)}>
        <SectionTitle title="Atividades" />
        <p className="text-body font-open-sans text-grayscale-50">
          Nenhuma atividade cadastrada.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-lg shadow-sm p-4 sm:p-6", className)}>
      <SectionTitle title="Atividades" />
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityCard key={`${activity.numero}-${index}`} activity={activity} />
        ))}
      </div>
    </div>
  );
};

export default ActivityList;
