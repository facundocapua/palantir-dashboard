# GitHub Statistics Feature

## Overview

The GitHub Statistics feature automatically collects weekly repository activity metrics from GitHub for all projects with configured repositories. This helps track code activity and development patterns over time.

## Database Schema

### `github_statistics` Table

```sql
CREATE TABLE github_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  week_date DATE NOT NULL COMMENT 'Start date of the week (Monday)',
  additions INT DEFAULT 0 COMMENT 'Total lines added during the week',
  deletions INT DEFAULT 0 COMMENT 'Total lines deleted during the week',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE KEY unique_project_week (project_id, week_date),
  INDEX idx_github_stats_project (project_id),
  INDEX idx_github_stats_week (week_date),
  INDEX idx_github_stats_project_week (project_id, week_date)
);
```

## Features

- **Automated Data Collection**: Weekly cron job collects GitHub statistics
- **Duplicate Prevention**: Only adds new statistics, skips existing weeks
- **Repository Support**: Works with any GitHub repository URL format
- **Rate Limiting**: Includes delays to respect GitHub API limits
- **Error Handling**: Graceful handling of API errors and invalid repositories

## Setup

### 1. Database Migration

Run the migration to create the `github_statistics` table:

```bash
mysql -h localhost -P 3306 -u palantir -pqwe123 palantir < src/migrations/005_create_github_statistics.sql
```

Or using Docker:

```bash
docker compose exec mysql mysql -u palantir -pqwe123 palantir -e "$(cat src/migrations/005_create_github_statistics.sql)"
```

### 2. Environment Variables

Set up the GitHub API token (optional but recommended for higher rate limits):

```bash
# .env.local
GITHUB_TOKEN=your_github_personal_access_token_here
CRON_SECRET=your_secure_cron_secret_here
```

### 3. Cron Job Setup

Set up a weekly cron job to automatically collect statistics:

```bash
# Run every Monday at 2 AM
0 2 * * 1 cd /path/to/palantir && npm run github-stats-cron >> /var/log/github-stats.log 2>&1
```

## Usage

### Manual Collection

Run the GitHub statistics collection manually:

```bash
npm run github-stats-cron
```

### API Endpoints

#### GET `/api/github-stats`
Fetch all GitHub statistics for display.

#### POST `/api/cron/github-stats`
Trigger statistics collection via API (requires authorization).

```bash
curl -X POST http://localhost:3000/api/cron/github-stats \
  -H "Authorization: Bearer your_cron_secret"
```

### Web Interface

Visit `/github-stats` to view and manage GitHub statistics through the web interface.

## GitHub API Integration

The system uses the GitHub API's [code frequency endpoint](https://docs.github.com/en/rest/metrics/statistics?apiVersion=2022-11-28#get-the-weekly-commit-activity):

```
GET /repos/{owner}/{repo}/stats/code_frequency
```

This endpoint returns weekly aggregated data in the following format:
```json
[
  [timestamp, additions, deletions],
  [1719705600, 31090, 0],
  [1720310400, 0, 0],
  ...
]
```

Where:
- `timestamp`: Unix timestamp of the start of the week
- `additions`: Number of lines added during the week
- `deletions`: Number of lines deleted during the week (negative number in response)

### Retry Logic

The code frequency endpoint computes statistics on-demand, which can be expensive. The API may return:
- **202 Accepted**: Statistics are being computed, retry after a short delay
- **200 OK**: Statistics are ready and included in the response

The system implements automatic retry logic:
- **Max retries**: 10 attempts
- **Retry delay**: 5 seconds between attempts
- **Timeout handling**: Graceful fallback if statistics can't be computed

### Rate Limits

- **Unauthenticated**: 60 requests per hour
- **Authenticated**: 5,000 requests per hour

The system includes automatic delays between requests to respect rate limits.

### Data Processing

The system:

1. Fetches weekly code frequency from GitHub using retry logic for 202 responses
2. Converts Unix timestamps to MySQL-compatible week dates (Monday start)  
3. Extracts actual additions and deletions from the API response
4. Stores only new statistics (prevents duplicates)
5. Filters out weeks with zero activity to reduce noise

## Supported Repository Formats

The system supports various GitHub repository URL formats:

- `https://github.com/owner/repo`
- `https://github.com/owner/repo.git`
- `git@github.com:owner/repo.git`
- `owner/repo`

## Files Structure

```
src/
├── migrations/
│   └── 005_create_github_statistics.sql
├── services/
│   └── githubStatisticsService.ts
├── actions/
│   └── githubStatistics.ts
├── components/
│   └── github-stats.tsx
├── app/
│   ├── github-stats/
│   │   └── page.tsx
│   └── api/
│       ├── github-stats/
│       │   └── route.ts
│       └── cron/
│           └── github-stats/
│               └── route.ts
└── types/
    └── database.ts (GitHubStatistic interface)

scripts/
└── github-stats-cron.ts
```

## Development

### Testing

Test the GitHub statistics collection:

```bash
# Test with a specific project
npm run github-stats-cron

# Check the database
docker compose exec mysql mysql -u palantir -pqwe123 palantir -e "SELECT * FROM github_statistics LIMIT 10;"
```

### Debugging

Enable detailed logging by checking the console output when running the cron job or visiting the web interface.

## Security

- API endpoints require proper authorization
- Database queries use parameterized statements
- Rate limiting respects GitHub's API guidelines
- No sensitive data is stored in statistics

## Future Enhancements

Potential improvements:

1. **Detailed Metrics**: Fetch actual line additions/deletions from individual commits
2. **Historical Backfill**: Add option to collect historical data beyond the last year
3. **Repository Health**: Track additional metrics like commit frequency, contributor count
4. **Notifications**: Alert on unusual activity patterns
5. **Dashboard**: Enhanced visualization with charts and trends
6. **Project Filtering**: Filter statistics by team, client, or project status
