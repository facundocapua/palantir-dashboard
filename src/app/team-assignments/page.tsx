import { TeamService } from '@/services/teamService';
import { PersonService } from '@/services/personService';
import TeamAssignmentsContent from '@/components/team-assignments-content';

export default async function TeamAssignmentsPage() {
  try {
    const [teams, people] = await Promise.all([
      TeamService.getAllTeams(),
      PersonService.getAllPeople()
    ]);

    return <TeamAssignmentsContent teams={teams} people={people} />;
  } catch (error) {
    console.error('Error loading team assignments:', error);
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading team assignments. Please try again.
        </div>
      </div>
    );
  }
}
