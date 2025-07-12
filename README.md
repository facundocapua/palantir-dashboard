# Palantir - Development Team Management Dashboard

Palantir is a comprehensive dashboard designed to efficiently manage development teams. It provides tools to categorize team members, define projects, assemble teams, and obtain key metrics for informed decision-making.

## Project Purpose

The main objective of this project is to create a management dashboard that enables:

- **Team Member Categorization**: Classify developers by role, seniority, skills, and contract type
- **Project Definition**: Define and track development projects with clear objectives
- **Team Assembly**: Create balanced teams based on project requirements and member capabilities  
- **Key Metrics**: Generate insights and metrics for strategic decision-making
- **Resource Optimization**: Maximize team efficiency through data-driven team composition

## Features

- **People Management**: Track 160+ developers across different teams (Atlas, Legion, Infraestructura, Valhalla)
- **Team Organization**: Organize members into squads with specific roles and responsibilities
- **Role Management**: Define and manage different technical roles (Frontend, Backend, DevOps, Mobile, etc.)
- **Metrics Dashboard**: View team composition, role distribution, and resource allocation
- **Project Assignment**: Assign team members to projects based on skills and availability

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- MySQL client (optional, for database access)

### Development Setup

1. **Start the database:**

   ```bash
   npm run db:up
   ```

2. **Install dependencies and start the development server:**

   ```bash
   npm install
   npm run dev
   ```

3. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

The application uses Turbopack for faster development builds and hot reloading.

## Database Management

The project uses a MySQL database with pre-populated data:

- **160+ developer records** across multiple teams
- **Team structures** (Atlas, Legion, Infraestructura, Valhalla)
- **Role definitions** (Frontend, Backend, DevOps, Mobile, etc.)
- **Seniority levels** and contract types

### Database Commands

```bash
# View database logs
npm run db:logs

# Connect to MySQL CLI
npm run db:connect

# Stop database
npm run db:down
```

## Technology Stack

- **Frontend**: Next.js 15 with App Router and React 19
- **Styling**: TailwindCSS 4 with custom design system
- **Database**: MySQL 8.0 with Docker Compose
- **Development**: TypeScript, ESLint, Turbopack
- **Fonts**: Geist Sans and Geist Mono

## Architecture

The project follows a hybrid development approach:

- **Database**: Runs in Docker container for consistency
- **Application**: Runs locally for fast development iteration
- **Data**: Persists in Docker volumes for reliability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure database is running (`npm run db:up`)
5. Test your changes locally
6. Submit a pull request

## Documentation

- `DOCKER.md` - Detailed database setup and queries
- `.github/copilot-instructions.md` - AI coding assistant guidelines
