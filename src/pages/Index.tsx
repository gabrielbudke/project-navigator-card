import ProjectCard, { ProjectStatus } from "@/components/ProjectCard";
import { ProgressVariant } from "@/components/ProgressBar";
import Header from "@/components/Header";
import { toast } from "sonner";

const Index = () => {
  const breadcrumbs = [
    { label: "Módulos", href: "/" },
    { label: "Gestão", href: "/" },
    { label: "Projetos" },
  ];

  const projects: Array<{
    title: string;
    subtitle: string;
    status: ProjectStatus;
    currentStep: number;
    stepWarnings?: number[];
    progress: number;
    progressVariant: ProgressVariant;
  }> = [
    {
      title: "00001-HCM-PETROBRAS-SAP",
      subtitle: "Implantação SAP SuccessFactors",
      status: "stable",
      currentStep: 3,
      progress: 65,
      progressVariant: "stable",
    },
    {
      title: "00002-HCM-VALE-FOLHA",
      subtitle: "Modernização Folha de Pagamento",
      status: "warning",
      currentStep: 2,
      stepWarnings: [1],
      progress: 35,
      progressVariant: "warning",
    },
    {
      title: "00003-HCM-AMBEV-RH",
      subtitle: "Gestão de Talentos",
      status: "critical",
      currentStep: 4,
      stepWarnings: [2, 3],
      progress: 15,
      progressVariant: "critical",
    },
    {
      title: "00004-HCM-ITAU-BENEFICIOS",
      subtitle: "Portal de Benefícios",
      status: "outdated",
      currentStep: 5,
      progress: 80,
      progressVariant: "primary",
    },
  ];

  const handleDetailsClick = (title: string) => {
    toast.info(`Ver detalhes de: ${title}`);
  };

  return (
    <main className="min-h-screen bg-grayscale-5 px-4 py-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Header title="Meus Projetos" breadcrumbs={breadcrumbs} />

        <div className="space-y-3 sm:space-y-4">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              subtitle={project.subtitle}
              status={project.status}
              currentStep={project.currentStep}
              stepWarnings={project.stepWarnings}
              progress={project.progress}
              progressVariant={project.progressVariant}
              onDetailsClick={() => handleDetailsClick(project.title)}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Index;
