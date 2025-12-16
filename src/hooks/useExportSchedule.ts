import { useState, useCallback } from "react";
import { ProjectData } from "@/types/project";
import { formatCurrency, formatDate, formatPercentage, formatHours } from "@/utils/formatters";

interface UseExportScheduleReturn {
  isExporting: boolean;
  exportSchedule: () => Promise<void>;
}

/**
 * Hook para gerenciar exportação do cronograma
 */
export const useExportSchedule = (project: ProjectData | null): UseExportScheduleReturn => {
  const [isExporting, setIsExporting] = useState(false);

  const exportSchedule = useCallback(async () => {
    if (!project || isExporting) return;

    setIsExporting(true);

    try {
      // Simula processamento de exportação
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Gera conteúdo do cronograma
      const scheduleContent = `
CRONOGRAMA DO PROJETO: ${project.nome}
=====================================
Número SNOW: ${project.numeroSNOW}

PERÍODO
-------
Início: ${formatDate(project.inicio)}
Término: ${formatDate(project.fim)}

PROGRESSO
---------
Concluído: ${formatPercentage(project.percentualConcluido)}
Planejado: ${formatPercentage(project.percentualPlanejado)}

FINANCEIRO
----------
Valor Vendido: ${formatCurrency(project.valorVendido)}
Valor Atingido: ${formatCurrency(project.valorAtingido)}
Reconhecido: ${formatCurrency(project.reconhecido)}

RENTABILIDADE
-------------
Prevista: ${formatPercentage(project.rentabilidadePrevista)}
Atual: ${formatPercentage(project.rentabilidadeAtual)}

RECURSOS
--------
Saldo de Horas: ${formatHours(project.saldoHoras)}

TAREFAS
-------
${project.tasks.map((t) => `[${t.completed ? "X" : " "}] ${t.name}`).join("\n")}

EQUIPE
------
${project.teamMembers.join(", ")}
      `.trim();

      // Cria e baixa o arquivo
      const blob = new Blob([scheduleContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cronograma-${project.nome.toLowerCase().replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar cronograma:", error);
    } finally {
      setIsExporting(false);
    }
  }, [project, isExporting]);

  return {
    isExporting,
    exportSchedule,
  };
};
