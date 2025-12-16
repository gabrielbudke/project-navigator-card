import { ProjectActivity } from "@/types/project";

export type ActivityHealthStatus = "no-prazo" | "atencao" | "atrasado";

export interface ActivityHealth {
  activity: ProjectActivity;
  spi: number;
  sv: number;
  status: ActivityHealthStatus;
  horasPlanejadas: number;
}

export interface ScheduleHealthReport {
  activities: ActivityHealth[];
  spiMedioPonderado: number;
  desvioPadrao: number;
  percentualEmRisco: number;
  atividadesAtrasadas: ActivityHealth[];
  atividadesAtencao: ActivityHealth[];
  atividadesNoPrazo: ActivityHealth[];
}

/**
 * Calcula o SPI (Schedule Performance Index) de uma atividade
 * SPI = percentualAtingido / percentualPlanejado
 * SPI >= 1.0 = no prazo ou adiantado
 * SPI < 1.0 = atrasado
 */
export const calculateSPI = (percentualAtingido: number, percentualPlanejado: number): number => {
  if (percentualPlanejado === 0) {
    return percentualAtingido > 0 ? 1.5 : 1.0;
  }
  return percentualAtingido / percentualPlanejado;
};

/**
 * Calcula o SV (Schedule Variance) de uma atividade
 * SV = percentualAtingido - percentualPlanejado
 */
export const calculateSV = (percentualAtingido: number, percentualPlanejado: number): number => {
  return percentualAtingido - percentualPlanejado;
};

/**
 * Determina o status de saúde de uma atividade baseado no SPI
 */
export const getActivityStatus = (spi: number): ActivityHealthStatus => {
  if (spi >= 0.9) return "no-prazo";
  if (spi >= 0.7) return "atencao";
  return "atrasado";
};

/**
 * Calcula o desvio padrão de um conjunto de valores
 */
export const calculateStandardDeviation = (values: number[]): number => {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return Math.sqrt(avgSquaredDiff);
};

/**
 * Gera o relatório de saúde do cronograma
 */
export const generateScheduleHealthReport = (activities: ProjectActivity[]): ScheduleHealthReport => {
  if (!activities || activities.length === 0) {
    return {
      activities: [],
      spiMedioPonderado: 1.0,
      desvioPadrao: 0,
      percentualEmRisco: 0,
      atividadesAtrasadas: [],
      atividadesAtencao: [],
      atividadesNoPrazo: [],
    };
  }

  const activityHealths: ActivityHealth[] = activities.map(activity => {
    const horasPlanejadas = activity.horasApontadas + activity.saldoHoras;
    const spi = calculateSPI(activity.percentualAtingido, activity.percentualPlanejado);
    const sv = calculateSV(activity.percentualAtingido, activity.percentualPlanejado);
    const status = getActivityStatus(spi);

    return {
      activity,
      spi,
      sv,
      status,
      horasPlanejadas,
    };
  });

  // Calcula SPI médio ponderado por horas planejadas
  const totalHoras = activityHealths.reduce((sum, ah) => sum + ah.horasPlanejadas, 0);
  const spiMedioPonderado = totalHoras > 0
    ? activityHealths.reduce((sum, ah) => sum + ah.spi * ah.horasPlanejadas, 0) / totalHoras
    : 1.0;

  // Calcula desvio padrão dos SPIs
  const spis = activityHealths.map(ah => ah.spi);
  const desvioPadrao = calculateStandardDeviation(spis);

  // Classifica atividades
  const atividadesAtrasadas = activityHealths.filter(ah => ah.status === "atrasado");
  const atividadesAtencao = activityHealths.filter(ah => ah.status === "atencao");
  const atividadesNoPrazo = activityHealths.filter(ah => ah.status === "no-prazo");

  // Percentual em risco (atrasadas + atenção)
  const percentualEmRisco = ((atividadesAtrasadas.length + atividadesAtencao.length) / activities.length) * 100;

  return {
    activities: activityHealths,
    spiMedioPonderado,
    desvioPadrao,
    percentualEmRisco,
    atividadesAtrasadas,
    atividadesAtencao,
    atividadesNoPrazo,
  };
};

/**
 * Retorna a cor do status para uso em gráficos
 */
export const getStatusColor = (status: ActivityHealthStatus): string => {
  switch (status) {
    case "no-prazo":
      return "#22c55e"; // green
    case "atencao":
      return "#f59e0b"; // amber
    case "atrasado":
      return "#ef4444"; // red
  }
};

/**
 * Retorna o label do status
 */
export const getStatusLabel = (status: ActivityHealthStatus): string => {
  switch (status) {
    case "no-prazo":
      return "No Prazo";
    case "atencao":
      return "Atenção";
    case "atrasado":
      return "Atrasado";
  }
};
