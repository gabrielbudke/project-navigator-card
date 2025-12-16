import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, DollarSign, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProjectStepper from "@/components/ProjectStepper";
import ProgressBar from "@/components/ProgressBar";
import {
  ProjectHeader,
  MetricCard,
  DateRange,
  TeamSection,
  ExportButton,
  ActivityList,
} from "@/components/ProjectDetails";
import { useProjectData } from "@/hooks/useProjectData";
import { useExportSchedule } from "@/hooks/useExportSchedule";
import { formatCurrency, formatPercentage, formatHours } from "@/utils/formatters";

const ProjectDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { project, steps, error, isLoading } = useProjectData(id);
  const { isExporting, exportSchedule } = useExportSchedule(project);

  // Estado de carregamento
  if (isLoading) {
    return (
      <main className="min-h-screen bg-grayscale-5 px-4 py-6 sm:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-grayscale-20 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-grayscale-20 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  // Estado de erro/não encontrado
  if (error || !project) {
    return (
      <main className="min-h-screen bg-grayscale-5 px-4 py-6 sm:p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-h1 font-inter text-grayscale-100 mb-4">
            Projeto não encontrado
          </h1>
          <Button onClick={() => navigate("/")}>Voltar para projetos</Button>
        </div>
      </main>
    );
  }

  // Determina variante da rentabilidade
  const rentabilidadeVariant =
    project.rentabilidadeAtual >= project.rentabilidadePrevista
      ? "success"
      : project.rentabilidadeAtual >= project.rentabilidadePrevista * 0.8
      ? "warning"
      : "danger";

  return (
    <main className="min-h-screen bg-grayscale-5 px-4 py-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-grayscale-60 hover:text-grayscale-100"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Header title={project.nome} />

        {/* Card Principal */}
        <div className="bg-card rounded-lg shadow-sm overflow-hidden mb-6">
          {/* Header com status */}
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <ProjectHeader
              nome={project.nome}
              subtitle={project.subtitle}
              numeroSNOW={project.numeroSNOW}
              status={project.status}
            />
          </div>

          {/* Stepper */}
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <h3 className="text-label-bold font-inter text-grayscale-80 mb-4">
              Etapas do Projeto
            </h3>
            <ProjectStepper steps={steps} />
          </div>

          {/* Progresso */}
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <h3 className="text-label-bold font-inter text-grayscale-80 mb-4">
              Progresso Geral
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-small font-open-sans mb-1">
                  <span className="text-grayscale-60">Concluído</span>
                  <span className="text-grayscale-100">
                    {formatPercentage(project.percentualConcluido)}
                  </span>
                </div>
                <ProgressBar value={project.percentualConcluido} variant="primary" />
              </div>
              <div>
                <div className="flex justify-between text-small font-open-sans mb-1">
                  <span className="text-grayscale-60">Planejado</span>
                  <span className="text-grayscale-100">
                    {formatPercentage(project.percentualPlanejado)}
                  </span>
                </div>
                <ProgressBar value={project.percentualPlanejado} variant="stable" />
              </div>
            </div>
          </div>

          {/* Grid de Métricas Financeiras */}
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <h3 className="text-label-bold font-inter text-grayscale-80 mb-4">
              Informações Financeiras
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                icon={DollarSign}
                label="Valor Vendido"
                value={formatCurrency(project.valorVendido)}
                secondaryLabel="Valor Atingido"
                secondaryValue={formatCurrency(project.valorAtingido)}
              />
              <MetricCard
                icon={TrendingUp}
                label="Rentabilidade Prevista"
                value={formatPercentage(project.rentabilidadePrevista)}
                secondaryLabel="Rentabilidade Atual"
                secondaryValue={formatPercentage(project.rentabilidadeAtual)}
                variant={rentabilidadeVariant}
              />
            </div>
          </div>

          {/* Recursos */}
          <div className="p-4 sm:p-6 border-b border-grayscale-20">
            <h3 className="text-label-bold font-inter text-grayscale-80 mb-4">
              Recursos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                icon={Clock}
                label="Saldo de Horas"
                value={formatHours(project.saldoHoras)}
              />
              <MetricCard
                icon={Target}
                label="Reconhecido"
                value={formatCurrency(project.reconhecido)}
              />
            </div>
          </div>

          {/* Datas e Equipe */}
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <DateRange startDate={project.inicio} endDate={project.fim} />
            <TeamSection members={project.teamMembers} />
          </div>
        </div>

        {/* Seção de Atividades */}
        <ActivityList activities={project.activities} className="mb-6" />

        {/* Botão Exportar - Fixo em mobile */}
        <div className="sticky bottom-4 sm:relative sm:bottom-auto">
          <ExportButton
            onClick={exportSchedule}
            isLoading={isExporting}
            disabled={!project}
          />
        </div>
      </div>
    </main>
  );
};

export default ProjectDetailsPage;
