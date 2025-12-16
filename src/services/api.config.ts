/**
 * API Configuration
 * Configuração centralizada para comunicação com a API externa
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Configuração base da API
 */
const API_CONFIG = {
  baseURL: 'http://10.248.192.198:3001/api',
  token: 'CrcH1Cix2fDzj032JU2srs9UCdv2HqIr',
  timeout: 30000, // 30 segundos
} as const;

/**
 * Interface para erros customizados da API
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Cria e configura uma instância do Axios com interceptors
 */
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Interceptor para adicionar o token em todas as requisições
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (API_CONFIG.token) {
        config.headers.Authorization = `Bearer ${API_CONFIG.token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(handleApiError(error));
    }
  );

  // Interceptor para tratamento de respostas
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      return Promise.reject(handleApiError(error));
    }
  );

  return client;
}

/**
 * Trata erros da API e retorna um objeto padronizado
 */
function handleApiError(error: AxiosError): ApiError {
  if (error.response) {
    // O servidor respondeu com um status code fora do range 2xx
    const responseData = error.response.data as { message?: string };
    
    return {
      message: responseData?.message || error.message || 'Erro ao processar requisição',
      status: error.response.status,
      code: error.code,
      details: error.response.data,
    };
  } else if (error.request) {
    // A requisição foi feita mas não houve resposta
    return {
      message: 'Servidor não respondeu. Verifique sua conexão.',
      code: error.code,
      details: error.request,
    };
  } else {
    // Algo aconteceu ao configurar a requisição
    return {
      message: error.message || 'Erro desconhecido',
      code: error.code,
    };
  }
}

/**
 * Instância configurada do Axios para uso nos serviços
 */
export const apiClient = createApiClient();

/**
 * Endpoints da API
 */
export const API_ENDPOINTS = {
  /** Planos de recursos por código do projeto */
  resourcePlans: (projectCode: string) => `/resource-plans/${projectCode}`,
  
  /** Projeto por ID (exemplo, ajustar conforme API real) */
  projectById: (projectId: string) => `/projects/${projectId}`,
} as const;

/**
 * Utilitário para construir query params
 */
export function buildQueryParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Configuração exportada para uso em testes ou override
 */
export const config = {
  get baseURL() {
    return API_CONFIG.baseURL;
  },
  get timeout() {
    return API_CONFIG.timeout;
  },
} as const;
