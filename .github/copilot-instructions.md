# Copilot Instructions for Palantir

## Project Overview
Palantir is a Next.js 15 application with a Docker-based MySQL database for team and people management. The architecture follows a hybrid approach: the database runs in Docker while the Next.js app runs locally for development.

## Database Architecture
- **MySQL 8.0** in Docker container on port 3306
- Pre-populated with 160+ people records across teams (Atlas, Legion, Infraestructura, Valhalla)
- Schema includes `teams`, `roles`, `people`, `clients`, `projects`, `github_statistics` tables with relationships
- Database credentials: `palantir:qwe123@localhost:3306/palantir`
- Migrations in `src/migrations/` track schema evolution

## Development Workflow
```bash
# Start database first (REQUIRED before any development)
npm run db:up

# Then start Next.js app
npm run dev  # Uses --turbopack for faster development

# Database operations
npm run db:logs     # View MySQL logs
npm run db:connect  # Connect to MySQL CLI
npm run db:down     # Stop database

# GitHub statistics collection
npm run github-stats-cron  # Manual run of weekly cron job
```

## Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: TailwindCSS 4 with PostCSS, Geist fonts (sans/mono)
- **Database**: MySQL 8.0 with Docker Compose
- **Build**: Standalone output configuration for deployment
- **Runtime**: tsx for TypeScript script execution

## Key Architecture Patterns

### Service Layer Pattern
All database operations use service classes (`src/services/`) with static methods:
```typescript
// Pattern: Service classes handle all database logic
export class PersonService {
  static async getAllPeople(): Promise<PersonWithTeamAndRole[]> {
    // Uses executeQuery from src/lib/db.ts
  }
}
```

### Server Actions Layer
Client-server communication uses Next.js server actions (`src/actions/`) that wrap services:
```typescript
// Pattern: Actions handle validation, caching, and revalidation
export async function createPerson(personData: Omit<Person, 'id'>) {
  const newPerson = await PersonService.createPerson(personData);
  revalidatePath('/people'); // Key: Always revalidate after mutations
  return { success: true, data: newPerson };
}
```

### Database Connection
- Single pool connection exported from `src/lib/db.ts`
- Use `executeQuery(query, params)` helper, never raw pool access
- Connection string: `mysql://palantir:qwe123@localhost:3306/palantir`

### Type System
- Complete type definitions in `src/types/database.ts`
- Extended interfaces for joined data (e.g., `PersonWithTeamAndRole`)
- Raw query result interfaces separate from API types

## Critical Conventions
- Uses `@/*` path aliases mapping to `./src/*`
- Everything in English (comments, documentation, variable names)
- **NEVER create API routes** unless necessary; use server components for data fetching
- All mutations go through server actions with `revalidatePath()` calls
- Service methods are always static and async
- Database queries use parameterized statements exclusively

## GitHub Statistics Feature
- **Service**: `GitHubStatisticsService` with retry logic for GitHub's 202 responses
- **Endpoint**: Uses `code_frequency` API for actual additions/deletions data
- **Cron**: `scripts/github-stats-cron.ts` for weekly collection
- **Environment**: `GITHUB_TOKEN` optional but recommended for rate limits

## Database Integration Points
When building database features:
- Start with type definition in `src/types/database.ts`
- Create service class in `src/services/` using existing patterns
- Add server actions in `src/actions/` with proper error handling
- Use migrations in `src/migrations/` for schema changes
- Key tables: `people`, `teams`, `roles`, `clients`, `projects`, `github_statistics`

## Common Patterns

### Form Handling
```typescript
// Pattern: FormData extraction in server actions
const name = formData.get('name') as string;
if (!name?.trim()) return { success: false, error: 'Required field' };
```

### Database Queries with Joins
```typescript
// Pattern: JOIN queries with proper type mapping
const query = `
  SELECT p.*, t.name as team_name, r.name as role_name
  FROM people p
  LEFT JOIN teams t ON p.team_id = t.id
  LEFT JOIN roles r ON p.role_id = r.id
`;
```

### Component Architecture
- Page components fetch data server-side when possible
- Client components marked with `'use client'` only when needed
- Shared components in `src/components/` with consistent naming

## Environment Setup
- No `.env` file exists; all config in code or docker-compose.yml
- Database runs on port 3306, Next.js on 3000
- **MUST run** `npm run db:up` before any development work

## Deployment Notes
- `next.config.ts` configured with `output: 'standalone'`
- Database initialization automatic on first container start
- GitHub statistics require `GITHUB_TOKEN` and `CRON_SECRET` in production
