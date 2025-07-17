'use client';

import { Suspense, useEffect, useState } from 'react';
import { getAllProjectsWithDetails } from '@/actions/projects';
import { ProjectsList } from '@/components/projects-list';
import { ProjectWithClientAndTeam } from '@/types/database';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithClientAndTeam[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const projectsData = await getAllProjectsWithDetails();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Projects
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage projects, assign teams, and track progress
        </p>
      </div>

      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsList projects={projects} onUpdate={loadProjects} />
      </Suspense>
    </div>
  );
}
