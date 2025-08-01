'use client';

import React, { useEffect, useState } from 'react';
import { getCodeReportData } from '@/actions/codeMetrics';
import { CodeReportData } from '@/services/codeMetricsService';
import { 
  WeeklyCodeChart, 
  ProjectCodeChart, 
  CodeMetricsStats, 
  ProjectDistributionChart 
} from '@/components/code-metrics-charts';
import { processAllGitHubStatistics as processGitHubStats } from '@/actions/githubStatistics';
import toast from 'react-hot-toast';

export default function CodeMetricsPage() {
  const [data, setData] = useState<CodeReportData>({
    weeklyMetrics: [],
    projectMetrics: [],
    totalStats: {
      total_additions: 0,
      total_deletions: 0,
      total_changes: 0,
      projects_tracked: 0,
      weeks_with_data: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getCodeReportData();
      
      if (result.success && result.data) {
        setData(result.data);
      } else {
        toast.error('Error al cargar los datos de métricas');
      }
    } catch (error) {
      console.error('Error loading code metrics data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    try {
      setProcessing(true);
      toast.loading('Procesando estadísticas de GitHub...');
      
      const result = await processGitHubStats();
      
      if (result.success) {
        toast.dismiss();
        toast.success('Estadísticas actualizadas correctamente');
        await loadData(); // Reload data after processing
      } else {
        toast.dismiss();
        toast.error(result.message || 'Error al procesar estadísticas');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Error al procesar estadísticas de GitHub');
      console.error('Error processing GitHub statistics:', error);
    } finally {
      setProcessing(false);
    }
  };

  const hasData = data.weeklyMetrics.length > 0 || data.projectMetrics.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Métricas de Código
              </h1>
              <p className="text-gray-600 mt-2">
                Análisis de líneas de código y actividad de desarrollo por proyecto y semana
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cargando...
                  </>
                ) : (
                  'Actualizar'
                )}
              </button>
              <button
                onClick={handleRefreshData}
                disabled={processing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  'Procesar GitHub'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mb-8">
          <CodeMetricsStats stats={data.totalStats} loading={loading} />
        </div>

        {hasData ? (
          <>
            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              <WeeklyCodeChart data={data.weeklyMetrics} loading={loading} />
              <ProjectDistributionChart data={data.projectMetrics} loading={loading} />
            </div>

            {/* Project Metrics Chart */}
            <div className="mb-8">
              <ProjectCodeChart data={data.projectMetrics} loading={loading} />
            </div>

            {/* Project Details Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles por Proyecto
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Métricas detalladas de líneas de código por proyecto
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proyecto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Adiciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Eliminaciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cambios Totales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semanas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Repositorio
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.projectMetrics
                      .sort((a, b) => b.total_additions - a.total_additions)
                      .map((project) => (
                      <tr key={project.project_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.project_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          +{project.total_additions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                          -{project.total_deletions.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                          {project.total_changes.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.weeks_tracked}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.repository ? (
                            <a
                              href={project.repository}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 truncate max-w-xs block"
                            >
                              {project.repository.replace('https://github.com/', '')}
                            </a>
                          ) : (
                            'Sin repositorio'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : !loading ? (
          /* No Data State */
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay datos disponibles
            </h3>
            <p className="text-gray-500 mb-4">
              No se encontraron métricas de código. Procesa las estadísticas de GitHub para generar datos.
            </p>
            <button
              onClick={handleRefreshData}
              disabled={processing}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Procesando...' : 'Procesar Estadísticas de GitHub'}
            </button>
          </div>
        ) : null}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            Acerca de las Métricas de Código
          </h3>
          <div className="text-blue-800 space-y-2">
            <p>
              Las métricas se basan en las estadísticas de GitHub que se recopilan semanalmente 
              para todos los proyectos con repositorios configurados.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Adiciones:</strong> Líneas de código agregadas por semana</li>
              <li><strong>Eliminaciones:</strong> Líneas de código eliminadas por semana</li>
              <li><strong>Cambios Totales:</strong> Suma de adiciones y eliminaciones</li>
            </ul>
            <p className="text-sm text-blue-700 mt-4">
              Los datos se actualizan automáticamente cada lunes a las 2 AM mediante un cron job, 
              o puedes procesarlos manualmente usando el botón &quot;Procesar GitHub&quot;.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
