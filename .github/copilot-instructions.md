# AI Coding Agent Instructions

## Project Overview

**Project Navigator Card** is a project management dashboard built with React, TypeScript, and Vite. It displays project portfolio cards with status indicators, progress tracking, and detailed project views with financial metrics, team information, and task tracking.

**Key URLs:**
- Main listing: `/` (Index.tsx)
- Project details: `/projeto/:id` (ProjectDetails.tsx)
- Built with Lovable platform, auto-commits to GitHub

## Tech Stack & Build

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite with SWC
- **Styling:** Tailwind CSS with custom theme
- **Component Library:** shadcn-ui (Radix UI primitives)
- **State Management:** React Query (@tanstack/react-query)
- **Routing:** React Router (BrowserRouter with dynamic routes)
- **Build Commands:**
  - `npm run dev` - Start dev server (port 8080)
  - `npm run build` - Production build
  - `npm run lint` - ESLint (unused vars disabled)

## Architecture Patterns

### Data Flow: Mock-First Design
All project data is **mocked in hooks** (not API calls). In `useProjectData.ts`, projects are stored in `projectsData` object keyed by ID. Update mock data there for new projects or fields.

### Component Structure
- **Pages** (`src/pages/`): Route-level components (Index, ProjectDetails)
- **Components** (`src/components/`): Reusable UI components
  - `ProjectCard.tsx` - Displays project preview with status badge & progress
  - `ProjectStepper.tsx` - Shows phase progression with warnings
  - `ProgressBar.tsx` - Styled progress indicator with variants (success/warning/danger)
  - `ProjectDetails/` folder - Compound components for detail view:
    - `ProjectHeader.tsx`, `MetricCard.tsx`, `DateRange.tsx`, `TeamSection.tsx`, `TaskList.tsx`
    - All imported via `index.ts` (barrel export)
- **UI** (`src/components/ui/`): shadcn-ui wrapper components (pre-built, don't edit directly)

### Key Types & Enums
Located in `src/types/project.ts`:
```typescript
type ProjectStatus = "stable" | "warning" | "critical" | "outdated";
interface ProjectData { /* full project structure */ }
interface ProjectTask { name: string; completed: boolean; }
```

### Formatting & Constants
- **Formatters** (`src/utils/formatters.ts`): All locale-specific formatting (pt-BR)
  - `formatCurrency()` - BRL format (R$ 1.234,56)
  - `formatPercentage()` - Comma decimal (23,5%)
  - `formatDate()` - dd/mm/yyyy
  - `formatHours()` - Number with locale separators
- **Constants** (`src/utils/constants.ts`):
  - `PROJECT_STEPS` - 6 phase labels (Pré-Iniciação → Encerrado)
  - `STATUS_LABELS` & `STATUS_BADGE_COLORS` - Status mappings

## Design System

### Tailwind Theme Extensions
Custom font sizes: `h1`, `h2`, `h2-alt`, `h2-bold`, `h3`, `label`, `label-bold`, `small`  
Custom colors (in `tailwind.config.ts`):
- `status-stable`, `status-warning`, `status-critical`, `status-outdated`
- `grayscale-*` (5, 20, 60, 80, 100)

### Component Conventions
- Always use `cn()` utility (`src/lib/utils.ts`) for conditional class merging
- Status-based styling: Map `ProjectStatus` to color constants in components (see `ProjectCard.tsx` pattern)
- Icons: Use `lucide-react` (e.g., `ArrowLeft`, `TrendingUp`, `DollarSign`)

## Routing & Navigation

Routes defined in `App.tsx`:
- `/` → Index (project listing)
- `/projeto/:id` → ProjectDetails (detail view)
- `*` → NotFound (catch-all)

Use `useNavigate()` and `useParams()` from React Router. Extract `:id` in components, then fetch from mock data.

## Development Workflow

### Error Handling
- Components check `if (error || !project)` and show fallback UI
- Export functionality: `useExportSchedule()` hook manages state independently

### New Features
1. **Add mock data** → Update `useProjectData.ts` with new `ProjectData` object
2. **Add new type fields** → Update `ProjectData` interface in `src/types/project.ts`
3. **Add formatters** → Create in `src/utils/formatters.ts` (locale-aware)
4. **New status variants** → Add to `ProjectStatus` type, then add to `STATUS_*` constants
5. **Component composition** → Create in `src/components/`, use named exports, compose in pages

### Common Tasks
- **Change colors/spacing:** Modify `tailwind.config.ts` (extend theme)
- **Update formatting:** Edit locale logic in `src/utils/formatters.ts` (pt-BR locale)
- **Add project fields:** Update `ProjectData` type + mock data + component rendering
- **New UI component:** Use shadcn-ui CLI or copy from existing templates in `src/components/ui/`

## Code Quality

- **Linting:** ESLint with React Hooks rules (unused vars disabled)
- **Type Safety:** Strict TypeScript enabled
- **Naming Conventions:**
  - Components: PascalCase (e.g., `ProjectCard.tsx`)
  - Hooks: camelCase with `use` prefix (e.g., `useProjectData.ts`)
  - Constants: UPPER_SNAKE_CASE (e.g., `PROJECT_STEPS`)
  - Files: Match export name (e.g., `ProjectCard.tsx` exports `ProjectCard`)

## Integration Points

- **Query Client:** Initialized in `App.tsx`, provides React Query context (currently unused for API, ready for backend)
- **Tooltip Provider:** Wraps app for shadcn tooltips
- **Toast Notifications:** Both Radix UI toast and Sonner toast available (see `Toaster` components in App)
- **Lovable Tagger:** Development mode only (`vite.config.ts`), tags components for builder sync
