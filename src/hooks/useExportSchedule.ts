import { useState, useCallback } from "react";
import jsPDF from "jspdf";
import { ProjectData } from "@/types/project";
import { formatDate } from "@/utils/formatters";
import {
  generateScheduleHealthReport,
  getStatusLabel,
  ActivityHealth,
} from "@/utils/scheduleHealth";

interface UseExportScheduleReturn {
  isExporting: boolean;
  exportSchedule: () => Promise<void>;
}

/**
 * Hook para gerenciar exportação do cronograma em PDF
 */
export const useExportSchedule = (project: ProjectData | null): UseExportScheduleReturn => {
  const [isExporting, setIsExporting] = useState(false);

  const exportSchedule = useCallback(async () => {
    if (!project || isExporting) return;

    setIsExporting(true);

    try {
      const report = generateScheduleHealthReport(project.activities);
      
      // Cria o PDF em orientação horizontal (landscape)
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Função auxiliar para normalizar texto (remove acentos para compatibilidade)
      const normalizeText = (text: string): string => {
        return text
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^\x00-\x7F]/g, (char) => {
            const map: Record<string, string> = {
              'ç': 'c', 'Ç': 'C',
              'ã': 'a', 'Ã': 'A',
              'õ': 'o', 'Õ': 'O',
              'á': 'a', 'Á': 'A',
              'é': 'e', 'É': 'E',
              'í': 'i', 'Í': 'I',
              'ó': 'o', 'Ó': 'O',
              'ú': 'u', 'Ú': 'U',
              'â': 'a', 'Â': 'A',
              'ê': 'e', 'Ê': 'E',
              'î': 'i', 'Î': 'I',
              'ô': 'o', 'Ô': 'O',
              'û': 'u', 'Û': 'U',
              'à': 'a', 'À': 'A',
              '≥': '>=',
              '≤': '<=',
            };
            return map[char] || char;
          });
      };

      const pageWidth = 297;
      const margin = 15;
      let yPos = margin;

      // Configura fonte padrão
      pdf.setFont("helvetica", "normal");

      // === HEADER ===
      pdf.setFontSize(20);
      pdf.setTextColor(31, 41, 55);
      pdf.text(normalizeText("Relatorio de Cronograma"), margin, yPos);
      yPos += 8;

      pdf.setFontSize(14);
      pdf.setTextColor(107, 114, 128);
      pdf.text(normalizeText(project.nome), margin, yPos);
      yPos += 6;

      pdf.setFontSize(10);
      pdf.text(normalizeText(`Periodo: ${formatDate(project.inicio)} - ${formatDate(project.fim)}`), margin, yPos);
      yPos += 10;

      // === LEGENDA ===
      pdf.setFontSize(9);
      pdf.setTextColor(55, 65, 81);
      
      // No Prazo
      pdf.setFillColor(34, 197, 94);
      pdf.rect(margin, yPos - 3, 4, 4, "F");
      pdf.text("No Prazo (SPI >= 0.9)", margin + 6, yPos);
      
      // Atencao
      pdf.setFillColor(245, 158, 11);
      pdf.rect(margin + 55, yPos - 3, 4, 4, "F");
      pdf.text("Atencao (0.7 <= SPI < 0.9)", margin + 61, yPos);
      
      // Atrasado
      pdf.setFillColor(239, 68, 68);
      pdf.rect(margin + 125, yPos - 3, 4, 4, "F");
      pdf.text("Atrasado (SPI < 0.7)", margin + 131, yPos);
      yPos += 10;

      // === GRÁFICO DE GANTT ===
      const chartStartX = margin + 60;
      const chartWidth = pageWidth - chartStartX - margin;
      const rowHeight = 8;
      const headerHeight = 10;

      // Calcula range de datas
      const startDate = new Date(project.inicio);
      const endDate = new Date(project.fim);
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;

      // Header do gráfico - meses
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, yPos, pageWidth - margin * 2, headerHeight, "F");
      pdf.setDrawColor(229, 231, 235);
      pdf.rect(margin, yPos, pageWidth - margin * 2, headerHeight, "S");

      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.text("Atividade", margin + 2, yPos + 6);
      
      // Desenha meses
      const monthWidth = chartWidth / 12;
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(startDate);
        monthDate.setMonth(startDate.getMonth() + i);
        if (monthDate <= endDate) {
          const monthLabel = normalizeText(monthDate.toLocaleDateString("pt-BR", { month: "short" }));
          pdf.text(monthLabel, chartStartX + i * monthWidth + 2, yPos + 6);
        }
      }
      yPos += headerHeight;

      // Linhas das atividades
      report.activities.forEach((activityHealth: ActivityHealth, index: number) => {
        const isEven = index % 2 === 0;
        
        // Background da linha
        if (!isEven) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin, yPos, pageWidth - margin * 2, rowHeight, "F");
        }
        
        // Borda da linha
        pdf.setDrawColor(229, 231, 235);
        pdf.rect(margin, yPos, pageWidth - margin * 2, rowHeight, "S");

        // Nome da atividade
        pdf.setFontSize(7);
        pdf.setTextColor(31, 41, 55);
        const actName = normalizeText(activityHealth.activity.nome.substring(0, 25));
        pdf.text(actName, margin + 2, yPos + 5);

        // Barra do Gantt
        const actStart = new Date(activityHealth.activity.inicio);
        const actEnd = new Date(activityHealth.activity.fim);
        
        const startOffset = Math.max(0, (actStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const duration = Math.ceil((actEnd.getTime() - actStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        const barX = chartStartX + (startOffset / totalDays) * chartWidth;
        const barWidth = Math.max((duration / totalDays) * chartWidth, 2);

        // Cor baseada no status
        if (activityHealth.status === "no-prazo") {
          pdf.setFillColor(34, 197, 94);
        } else if (activityHealth.status === "atencao") {
          pdf.setFillColor(245, 158, 11);
        } else {
          pdf.setFillColor(239, 68, 68);
        }
        
        pdf.roundedRect(barX, yPos + 2, barWidth, rowHeight - 4, 1, 1, "F");

        yPos += rowHeight;
      });

      yPos += 10;

      // === SEÇÃO DE OBSERVAÇÕES ===
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55);
      pdf.text("Observacoes", margin, yPos);
      yPos += 8;

      // Métricas
      const metricWidth = (pageWidth - margin * 2) / 3 - 5;
      
      // SPI Médio
      pdf.setFillColor(240, 253, 244);
      pdf.roundedRect(margin, yPos, metricWidth, 15, 2, 2, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(22, 101, 52);
      pdf.text("SPI Medio Ponderado", margin + 3, yPos + 5);
      pdf.setFontSize(14);
      pdf.text(report.spiMedioPonderado.toFixed(2), margin + 3, yPos + 12);

      // Desvio Padrão
      pdf.setFillColor(254, 243, 199);
      pdf.roundedRect(margin + metricWidth + 5, yPos, metricWidth, 15, 2, 2, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(146, 64, 14);
      pdf.text("Desvio Padrao", margin + metricWidth + 8, yPos + 5);
      pdf.setFontSize(14);
      pdf.text(report.desvioPadrao.toFixed(2), margin + metricWidth + 8, yPos + 12);

      // Atividades em Risco
      pdf.setFillColor(254, 242, 242);
      pdf.roundedRect(margin + (metricWidth + 5) * 2, yPos, metricWidth, 15, 2, 2, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(153, 27, 27);
      pdf.text("Atividades em Risco", margin + (metricWidth + 5) * 2 + 3, yPos + 5);
      pdf.setFontSize(14);
      pdf.text(`${report.percentualEmRisco.toFixed(0)}%`, margin + (metricWidth + 5) * 2 + 3, yPos + 12);

      yPos += 20;

      // Atividades Atrasadas
      if (report.atividadesAtrasadas.length > 0) {
        pdf.setFontSize(10);
        pdf.setTextColor(220, 38, 38);
        pdf.text(`Atividades Atrasadas (${report.atividadesAtrasadas.length})`, margin, yPos);
        yPos += 5;
        
        pdf.setFontSize(8);
        pdf.setTextColor(55, 65, 81);
        report.atividadesAtrasadas.forEach((ah) => {
          const text = normalizeText(`- ${ah.activity.nome}: SPI ${ah.spi.toFixed(2)} - ${ah.activity.percentualAtingido}% atingido vs ${ah.activity.percentualPlanejado}% planejado`);
          pdf.text(text, margin + 2, yPos);
          yPos += 4;
        });
        yPos += 3;
      }

      // Atividades em Atenção
      if (report.atividadesAtencao.length > 0) {
        pdf.setFontSize(10);
        pdf.setTextColor(217, 119, 6);
        pdf.text("Atividades em Atencao (" + report.atividadesAtencao.length + ")", margin, yPos);
        yPos += 5;
        
        pdf.setFontSize(8);
        pdf.setTextColor(55, 65, 81);
        report.atividadesAtencao.forEach((ah) => {
          const text = normalizeText(`- ${ah.activity.nome}: SPI ${ah.spi.toFixed(2)} - ${ah.activity.percentualAtingido}% atingido vs ${ah.activity.percentualPlanejado}% planejado`);
          pdf.text(text, margin + 2, yPos);
          yPos += 4;
        });
        yPos += 3;
      }

      // Resumo
      yPos += 3;
      pdf.setFillColor(243, 244, 246);
      pdf.roundedRect(margin, yPos, pageWidth - margin * 2, 12, 2, 2, "F");
      
      pdf.setFontSize(8);
      pdf.setTextColor(75, 85, 99);
      const summaryText = normalizeText(`Resumo: ${report.activities.length} atividades - ${report.atividadesNoPrazo.length} no prazo (${((report.atividadesNoPrazo.length / report.activities.length) * 100).toFixed(0)}%), ${report.atividadesAtencao.length} em atencao, ${report.atividadesAtrasadas.length} atrasadas.`);
      pdf.text(summaryText, margin + 3, yPos + 7);

      // Rodapé
      yPos = 200;
      pdf.setFontSize(7);
      pdf.setTextColor(156, 163, 175);
      pdf.text(normalizeText(`Relatorio gerado em ${new Date().toLocaleDateString("pt-BR")} as ${new Date().toLocaleTimeString("pt-BR")}`), margin, yPos);

      // Salva o PDF
      const fileName = `relatorio-cronograma-${project.nome
        .toLowerCase()
        .replace(/\s+/g, "-")}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
    } finally {
      setIsExporting(false);
    }
  }, [project, isExporting]);

  return {
    isExporting,
    exportSchedule,
  };
};
