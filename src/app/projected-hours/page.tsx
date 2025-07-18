import ProjectedHoursForm from '@/components/projected-hours-form';
import { ProjectService } from '@/services/projectService';
import { ProjectedHoursService } from '@/services/projectedHoursService';
import { ProjectWithClientAndTeam } from '@/types/database';

interface PageProps {
  searchParams: {
    year?: string;
  };
}

export default async function ProjectedHoursPage({ searchParams }: PageProps) {
  const currentDate = new Date();
  const year = searchParams.year ? parseInt(searchParams.year) : currentDate.getFullYear();

  try {
    // Get all active projects with their related data
    const projects = await ProjectService.getAllProjectsWithDetails();
    const activeProjects = projects.filter((p: ProjectWithClientAndTeam) => p.status === 'Active' || p.status === 'On Hold');

    // Get projected hours for the selected year
    const projectedHours = await ProjectedHoursService.getProjectedHoursByYear(year);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projected Hours</h1>
            <p className="text-gray-600 mt-2">
              Set projected hours needed for each project by month
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <form method="GET" className="flex items-center space-x-3">
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  defaultValue={year}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <option key={2024 + i} value={2024 + i}>
                      {2024 + i}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Update
              </button>
            </form>
          </div>
        </div>

        <ProjectedHoursForm
          projects={activeProjects}
          initialProjectedHours={projectedHours}
          year={year}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading projected hours page:', error);

    return (
      <div className="text-center py-12">
        <div className="text-red-600">
          Error loading page. Please try again later.
        </div>
      </div>
    );
  }
}
