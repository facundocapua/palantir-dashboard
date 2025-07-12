# Copilot Instructions for Palantir

## Project Overview
Palantir is a Next.js 15 application with a Docker-based MySQL database for team and people management. The architecture follows a hybrid approach: the database runs in Docker while the Next.js app runs locally for development.

## Database Architecture
- **MySQL 8.0** in Docker container on port 3306
- Pre-populated with 160+ people records across teams (Atlas, Legion, Infraestructura, Valhalla)
- Schema includes `teams`, `roles`, and `people` tables with relationships
- Database credentials: `palantir:qwe123@localhost:3306/palantir`

## Development Workflow
```bash
# Start database first
npm run db:up

# Then start Next.js app
npm run dev  # Uses --turbopack for faster development

# Database operations
npm run db:logs     # View MySQL logs
npm run db:connect  # Connect to MySQL CLI
npm run db:down     # Stop database
```

## Technology Stack
- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: TailwindCSS 4 with PostCSS, Geist fonts (sans/mono)
- **Database**: MySQL 8.0 with Docker Compose
- **Build**: Standalone output configuration for deployment

## Key Conventions
- Uses `@/*` path aliases mapping to `./src/*`
- Follows Next.js App Router patterns in `src/app/`
- CSS-in-JS with Tailwind custom properties in `globals.css`
- ESLint extends `next/core-web-vitals` and `next/typescript`
- Everything should be written in English, including comments and documentation
- Don't create api routes unless necessary; use server components for data fetching

## Database Integration Points
When building database features:
- Connection string: `mysql://palantir:qwe123@localhost:3306/palantir`
- Key tables: `people` (with team_id, role, seniority), `teams`, `roles`
- Sample queries available in `DOCKER.md` for reference
- Data persists in Docker volume `mysql_data`

## Environment Setup
- No `.env` file currently exists (referenced in `DOCKER.md` but not present)
- Database runs on standard MySQL port 3306
- Next.js development server on port 3000
- All database configuration is in `docker-compose.yml`

## Project Structure
- `src/app/`: Next.js App Router pages and layouts
- `public/`: Static assets (SVG icons, favicon)
- Root config files: `next.config.ts`, `docker-compose.yml`, `tsconfig.json`
- Database documentation in `DOCKER.md` with sample queries

## Deployment Notes
- `next.config.ts` configured with `output: 'standalone'` for containerized deployment
- Database initialization happens automatically on first container start
- Use `npm run db:up` before any development work requiring database access
