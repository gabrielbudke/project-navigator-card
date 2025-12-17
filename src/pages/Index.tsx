import { useNavigate } from "react-router-dom";
import ProjectCard from "@/components/ProjectCard";
import Header from "@/components/Header";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const { projects, isLoading, isError, error, refetch } = useProjects();

  return (
    <main className="min-h-screen bg-grayscale-5 px-4 py-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Header title="Meus Projetos" />

        {isLoading && (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <AlertCircle className="h-12 w-12 text-status-critical mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-grayscale-90 mb-2">
              Erro ao carregar projetos
            </h3>
            <p className="text-grayscale-60 mb-4">
              {error?.message || "Não foi possível carregar a lista de projetos."}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        )}

        {!isLoading && !isError && projects.length === 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <p className="text-grayscale-60">Nenhum projeto encontrado.</p>
          </div>
        )}

        {!isLoading && !isError && projects.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.nome}
                subtitle={project.subtitle}
                status={project.status}
                currentStep={project.etapa}
                stepWarnings={project.stepWarnings}
                progress={project.progress}
                progressVariant={project.progressVariant}
                onDetailsClick={() => navigate(`/projeto/${project.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Index;
