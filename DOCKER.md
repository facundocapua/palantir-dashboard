# Docker Setup for Palantir Database

This project uses Docker Compose to set up a MySQL 8 database for development. The Next.js application runs locally while connecting to the containerized database.

## Prerequisites

- Docker
- Docker Compose
- Node.js (for running the Next.js app locally)

## Services

- **MySQL 8**: Database server on port 3306 (Docker)
- **Next.js App**: Web application on port 3000 (Local)

## Quick Start

1. **Clone the repository and navigate to the project directory**

2. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Start the MySQL database:**
   ```bash
   npm run db:up
   ```

4. **Install dependencies and start the app locally:**
   ```bash
   npm install
   npm run dev
   ```

5. **View database logs:**
   ```bash
   npm run db:logs
   ```

## Database Configuration

- **Host**: localhost
- **Port**: 3306
- **Database**: palantir
- **Username**: palantir
- **Password**: qwe123
- **Root Password**: qwe123

### Database Schema

The database includes the following tables with sample data:

- **`teams`** - Teams/squads (Atlas, Legion, Infraestructura, Valhalla, etc.)
- **`roles`** - Available roles (Frontend, Backend, DevOps, Mobile, etc.)
- **`people`** - People with their information including seniority, role, contract type, and team assignment

The database is automatically populated with real data including 160+ people records when the MySQL container starts for the first time.

### Sample Queries

Once connected to the database, you can try these useful queries:

```sql
-- Count records in each table
SELECT COUNT(*) as people_count FROM people;
SELECT COUNT(*) as teams_count FROM teams;
SELECT COUNT(*) as roles_count FROM roles;

-- View people by team
SELECT p.name, p.role, p.seniority, t.name as team_name 
FROM people p 
LEFT JOIN teams t ON p.team_id = t.id 
WHERE t.name = 'Legion';

-- Count people by role
SELECT role, COUNT(*) as count 
FROM people 
GROUP BY role 
ORDER BY count DESC;

-- View team composition
SELECT t.name as team, COUNT(p.id) as members
FROM teams t
LEFT JOIN people p ON t.id = p.team_id
GROUP BY t.id, t.name
ORDER BY members DESC;
```

## Useful Commands

```bash
# Start MySQL database
npm run db:up

# Stop MySQL database
npm run db:down

# View MySQL logs
npm run db:logs

# Connect to MySQL database
npm run db:connect

# Or manually connect
docker compose exec mysql mysql -u palantir -p palantir

# Start Next.js app locally
npm run dev
```

## Database Access

### From Host Machine (Recommended)
```bash
mysql -h localhost -P 3306 -u palantir -p palantir
```

### From Docker Container
```bash
docker compose exec mysql mysql -u palantir -p palantir
```

## Environment Variables

All environment variables are defined in `.env` file. Copy `.env.example` to `.env` and modify as needed.

The `DATABASE_URL` should point to `localhost:3306` since the app runs locally.

## Data Persistence

MySQL data is persisted in a Docker volume named `mysql_data`. The data will survive container restarts but will be lost if you run `docker-compose down -v`.

## Development Workflow

1. **Start the database:**
   ```bash
   npm run db:up
   ```

2. **Start the Next.js development server:**
   ```bash
   npm run dev
   ```

3. **When done developing:**
   ```bash
   npm run db:down
   ```

## Troubleshooting

1. **Port 3306 conflict**: If port 3306 is already in use, modify the port mapping in `docker-compose.yml`

2. **Database connection issues**: Ensure the MySQL container is fully started before connecting. You can check with:
   ```bash
   npm run db:logs
   ```

3. **Permission issues**: If you encounter permission issues, try:
   ```bash
   npm run db:down
   npm run db:up
   ```

## Connecting from Your Application

Use the following connection string in your Next.js application:

```
DATABASE_URL=mysql://palantir:qwe123@localhost:3306/palantir
```

This setup gives you the flexibility of local development while using a consistent, containerized database environment.
