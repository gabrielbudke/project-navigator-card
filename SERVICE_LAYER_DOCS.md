# Camada de Serviço - Documentação de Uso

## 📋 Visão Geral

Camada de serviço completa para integração com API externa, seguindo as melhores práticas de programação TypeScript e React.

## 🏗️ Arquitetura

```
src/
├── types/
│   └── resourcePlan.ts          # Tipos e interfaces
├── services/
│   ├── api.config.ts            # Configuração centralizada da API
│   ├── projectService.ts        # Serviço de projetos
│   ├── resourcePlanService.ts   # Serviço de planos de recursos
│   └── index.ts                 # Barrel exports
└── hooks/
    └── useResourcePlans.ts      # Hooks React Query
```

## 🚀 Como Usar

### 1. Buscar Planos de Recursos por Código do Projeto

#### Com React Query (Recomendado):

```tsx
import { useResourcePlans } from '@/hooks/useResourcePlans';

function ProjectResourcePlans() {
  const { data, isLoading, error } = useResourcePlans('PRJ0161122');

  if (isLoading) return <div>Carregando planos...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      <h2>Total de Planos: {data?.length}</h2>
      {data?.map(plan => (
        <div key={plan.numero}>
          <h3>{plan.nome}</h3>
          <p>Profissional: {plan.profissional_nome}</p>
          <p>Período: {plan.inicio} até {plan.fim}</p>
          <p>Progresso: {plan.perc_atingido}%</p>
        </div>
      ))}
    </div>
  );
}
```

#### Diretamente com o Serviço:

```typescript
import { resourcePlanService } from '@/services';

async function fetchResourcePlans() {
  try {
    const plans = await resourcePlanService.getByProjectCode('PRJ0161122');
    console.log('Planos encontrados:', plans.length);
    return plans;
  } catch (error) {
    console.error('Erro ao buscar planos:', error);
    throw error;
  }
}
```

### 2. Buscar com Filtros

```tsx
import { useResourcePlansFiltered } from '@/hooks/useResourcePlans';

function FilteredPlans() {
  const { data } = useResourcePlansFiltered('PRJ0161122', {
    professionalName: 'ADRIAN',
    startDate: '2025-09-01',
    endDate: '2025-12-31'
  });

  return (
    <div>
      {data?.map(plan => (
        <div key={plan.numero}>{plan.nome}</div>
      ))}
    </div>
  );
}
```

### 3. Buscar Estatísticas

```tsx
import { useResourcePlanStats } from '@/hooks/useResourcePlans';

function ProjectStats() {
  const { data: stats } = useResourcePlanStats('PRJ0161122');

  return (
    <div>
      <p>Total de Planos: {stats?.totalPlans}</p>
      <p>Total de Horas: {stats?.totalHours}</p>
      <p>Média de Conclusão: {stats?.averageCompletion}%</p>
      <p>Profissionais: {stats?.professionalCount}</p>
    </div>
  );
}
```

### 4. Buscar Plano Específico

```tsx
import { useResourcePlan } from '@/hooks/useResourcePlans';

function PlanDetails({ planNumber }: { planNumber: string }) {
  const { data: plan } = useResourcePlan('PRJ0161122', planNumber);

  if (!plan) return <div>Plano não encontrado</div>;

  return (
    <div>
      <h2>{plan.nome}</h2>
      <p>Profissional: {plan.profissional_nome}</p>
      <p>Saldo de Horas: {plan.saldo_horas}</p>
    </div>
  );
}
```

### 5. Buscar por Profissional

```typescript
import { resourcePlanService } from '@/services';

const adrianPlans = await resourcePlanService.getByProfessional(
  'PRJ0161122',
  'ADRIAN STEINSTRASSER'
);

console.log(`Adrian tem ${adrianPlans.length} planos neste projeto`);
```

### 6. Buscar Planos Ativos

```tsx
import { useActiveResourcePlans } from '@/hooks/useResourcePlans';

function ActivePlans() {
  const { data: activePlans } = useActiveResourcePlans('PRJ0161122');

  return (
    <div>
      <h2>Planos Ativos: {activePlans?.length}</h2>
      {activePlans?.map(plan => (
        <div key={plan.numero}>{plan.nome}</div>
      ))}
    </div>
  );
}
```

## 🔧 Configuração

### Alterar Token ou BaseURL

Edite [src/services/api.config.ts](src/services/api.config.ts):

```typescript
const API_CONFIG = {
  baseURL: 'http://10.248.192.198:3001/api',
  token: 'SEU_NOVO_TOKEN_AQUI',
  timeout: 30000,
};
```

### Personalizar Configuração do React Query

Edite [src/hooks/useResourcePlans.ts](src/hooks/useResourcePlans.ts):

```typescript
const DEFAULT_QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,      // Tempo antes de considerar stale
  cacheTime: 10 * 60 * 1000,     // Tempo de cache
  retry: 2,                       // Número de tentativas
  refetchOnWindowFocus: false,   // Recarregar ao focar janela
};
```

## 🎯 Melhores Práticas Implementadas

### ✅ Separação de Responsabilidades
- **Types**: Interfaces TypeScript centralizadas
- **Services**: Lógica de negócio e comunicação com API
- **Hooks**: Integração com React Query
- **Config**: Configuração centralizada

### ✅ Tipagem Forte
- Todas as interfaces definidas em TypeScript
- Type guards para validação em runtime
- Exports tipados com `as const`

### ✅ Tratamento de Erros
- Interceptors Axios para tratamento centralizado
- Erros customizados com contexto adicional
- Validações em múltiplas camadas

### ✅ Validações
- Formato de código do projeto (PRJ + números)
- Formato de número de plano (RPLN + números)
- Validação de parâmetros obrigatórios
- Type guards para respostas da API

### ✅ Performance
- Cache inteligente com React Query
- Queries em paralelo quando possível
- Stale time configurável
- Barrel exports para imports limpos

### ✅ Manutenibilidade
- Documentação JSDoc completa
- Exemplos de uso em cada método
- Código autoexplicativo com nomes claros
- Padrão Singleton para serviços

### ✅ Escalabilidade
- Factory pattern para query keys
- Configuração centralizada
- Fácil adição de novos endpoints
- Estrutura modular

## 📝 Exemplos Avançados

### Invalidar Cache Após Mutação

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { resourcePlanKeys } from '@/hooks/useResourcePlans';

function Component() {
  const queryClient = useQueryClient();

  const invalidateCache = () => {
    queryClient.invalidateQueries({
      queryKey: resourcePlanKeys.byProject('PRJ0161122')
    });
  };

  return <button onClick={invalidateCache}>Recarregar</button>;
}
```

### Prefetch de Dados

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { resourcePlanService } from '@/services';
import { resourcePlanKeys } from '@/hooks/useResourcePlans';

function Component() {
  const queryClient = useQueryClient();

  const prefetchPlans = async (projectCode: string) => {
    await queryClient.prefetchQuery({
      queryKey: resourcePlanKeys.byProject(projectCode),
      queryFn: () => resourcePlanService.getByProjectCode(projectCode),
    });
  };

  return <button onClick={() => prefetchPlans('PRJ0161122')}>
    Carregar em Background
  </button>;
}
```

### Uso com Loading States

```tsx
import { useResourcePlans } from '@/hooks/useResourcePlans';

function ResourcePlansList() {
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    isFetching,
    refetch 
  } = useResourcePlans('PRJ0161122');

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorAlert message={error.message} onRetry={refetch} />;

  return (
    <div>
      {isFetching && <RefreshIndicator />}
      <PlansList plans={data} />
    </div>
  );
}
```

## 🧪 Testes

### Testando Serviços

```typescript
import { resourcePlanService } from '@/services';

describe('ResourcePlanService', () => {
  it('deve buscar planos por código do projeto', async () => {
    const plans = await resourcePlanService.getByProjectCode('PRJ0161122');
    expect(plans).toBeInstanceOf(Array);
    expect(plans.length).toBeGreaterThan(0);
  });

  it('deve validar código do projeto', async () => {
    await expect(
      resourcePlanService.getByProjectCode('INVALID')
    ).rejects.toThrow('Formato inválido');
  });
});
```

## 📦 Dependências Necessárias

Certifique-se de ter instalado:

```bash
npm install axios @tanstack/react-query
```

## 🔐 Segurança

⚠️ **IMPORTANTE**: O token está hardcoded no código. Para produção:

1. Use variáveis de ambiente (`.env`)
2. Configure no backend para rotação de tokens
3. Implemente refresh token se necessário

Exemplo com variáveis de ambiente:

```typescript
// .env
VITE_API_BASE_URL=http://10.248.192.198:3001/api
VITE_API_TOKEN=CrcH1Cix2fDzj032JU2srs9UCdv2HqIr

// api.config.ts
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  token: import.meta.env.VITE_API_TOKEN,
  timeout: 30000,
};
```

## 📚 Referências

- [Axios Documentation](https://axios-http.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
