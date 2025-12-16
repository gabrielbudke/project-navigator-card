/**
 * Utilitários de formatação para dados do projeto
 */

/**
 * Formata valor monetário para o padrão brasileiro (R$ 1.234,56)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata percentual com símbolo % e até 2 casas decimais
 */
export const formatPercentage = (value: number): string => {
  if(!value) return '0';
  return `${value.toFixed(1).replace('.', ',')}%`;
};

/**
 * Formata número com separadores de milhares
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

/**
 * Formata data para o padrão dd/mm/yyyy
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formata horas restantes
 */
export const formatHours = (hours: number): string => {
  return `${formatNumber(hours)}h`;
};
