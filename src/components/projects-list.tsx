'use client';

import { useState } from 'react';
import { ProjectWithClientAndTeam } from '@/types/database';
import { deleteProject } from '@/actions/projects';
import { ProjectForm } from './project-form';
import ConfirmDialog from './confirm-dialog';
import toast from 'react-hot-toast';

interface ProjectsListProps {
  projects: ProjectWithClientAndTeam[];
  onUpdate: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Completed':
      return 'bg-blue-100 text-blue-800';
    case 'On Hold':
      return 'bg-yellow-100 text-yellow-800';
    case 'Inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function ProjectsList({ projects, onUpdate }: ProjectsListProps) {
  const [editingProject, setEditingProject] = useState<ProjectWithClientAndTeam | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deletingProject, setDeletingProject] = useState<ProjectWithClientAndTeam | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (project: ProjectWithClientAndTeam) => {
    setDeletingProject(project);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;

    setIsDeleting(true);
    try {
      const result = await deleteProject(deletingProject.id);
      if (result.success) {
        toast.success(`Project "${deletingProject.name}" has been deleted successfully.`);
        onUpdate();
      } else {
        toast.error(result.error || 'Failed to delete project');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
      setDeletingProject(null);
    }
  };

  const handleFormSuccess = () => {
    setEditingProject(null);
    setShowCreateForm(false);
    onUpdate();
  };

  const handleFormClose = () => {
    setEditingProject(null);
    setShowCreateForm(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Project
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  {project.description && (
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {project.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.team.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(project.start_date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found.</p>
          </div>
        )}
      </div>

      {showCreateForm && (
        <ProjectForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {editingProject && (
        <ProjectForm
          project={editingProject}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {deletingProject && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Project"
          message={`Are you sure you want to delete "${deletingProject.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProject(null)}
          isProcessing={isDeleting}
        />
      )}
    </div>
  );
}
