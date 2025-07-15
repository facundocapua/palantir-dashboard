import ReportsContent from "@/components/reports-content";
import { ReportsService } from "@/services/reportsService";
import { TeamService } from "@/services/teamService";
import { RoleService } from "@/services/roleService";

async function getReportsData() {
  try {
    const [stats, teams, roles] = await Promise.all([
      ReportsService.getTeamStats(),
      TeamService.getAllTeams(),
      RoleService.getAllRoles()
    ]);
    
    return { stats, teams, roles };
  } catch (error) {
    console.error('Error fetching reports data:', error);
    return {
      stats: {
        roleStats: [],
        seniorityStats: [],
        teamStats: [],
        totalPeople: 0
      },
      teams: [],
      roles: []
    };
  }
}

export default async function ReportsPage() {
  const { stats, teams, roles } = await getReportsData();

  return (
    <ReportsContent 
      initialStats={stats} 
      teams={teams} 
      roles={roles} 
    />
  );
}
