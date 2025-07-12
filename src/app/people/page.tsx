import AppLayout from "@/components/app-layout";
import { PersonService } from "@/services/personService";
import { TeamService } from "@/services/teamService";
import { RoleService } from "@/services/roleService";
import PeopleTable from "@/components/people-table";

async function getPeopleData() {
  try {
    const [people, teams, roles] = await Promise.all([
      PersonService.getAllPeople(),
      TeamService.getAllTeams(),
      RoleService.getAllRoles()
    ]);
    return { people, teams, roles };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { people: [], teams: [], roles: [] };
  }
}

export default async function PeoplePage() {
  const { people, teams, roles } = await getPeopleData();

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">People</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the people in your organization including their name, role, and team.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add person
            </button>
          </div>
        </div>

        <PeopleTable people={people} teams={teams} roles={roles} />
      </div>
    </AppLayout>
  );
}
