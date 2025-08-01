'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { WeeklyCodeMetrics, ProjectCodeMetrics } from '@/services/codeMetricsService';

interface WeeklyCodeChartProps {
  data: WeeklyCodeMetrics[];
  loading?: boolean;
}

export function WeeklyCodeChart({ data, loading = false }: WeeklyCodeChartProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Líneas de Código por Semana</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos de código disponibles
        </div>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map(item => ({
    ...item,
    week: new Date(item.week_date).toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Líneas de Código por Semana
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name === 'total_additions' ? 'Adiciones' :
                name === 'total_deletions' ? 'Eliminaciones' : 
                'Cambios Totales'
              ]}
              labelFormatter={(label) => `Semana: ${label}`}
            />
            <Legend 
              formatter={(value) => 
                value === 'total_additions' ? 'Adiciones' :
                value === 'total_deletions' ? 'Eliminaciones' : 
                'Cambios Totales'
              }
            />
            <Line 
              type="monotone" 
              dataKey="total_additions" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="total_deletions" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="total_changes" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface ProjectCodeChartProps {
  data: ProjectCodeMetrics[];
  loading?: boolean;
}

export function ProjectCodeChart({ data, loading = false }: ProjectCodeChartProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Líneas de Código por Proyecto</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos de proyectos disponibles
        </div>
      </div>
    );
  }

  // Sort data by total additions and take top 10
  const sortedData = data
    .sort((a, b) => b.total_additions - a.total_additions)
    .slice(0, 10)
    .map(item => ({
      ...item,
      name: item.project_name.length > 15 
        ? item.project_name.substring(0, 15) + '...' 
        : item.project_name
    }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Líneas de Código por Proyecto (Top 10)
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              width={150}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value.toLocaleString(),
                name === 'total_additions' ? 'Adiciones' :
                name === 'total_deletions' ? 'Eliminaciones' : 
                'Cambios Totales'
              ]}
              labelFormatter={(label) => `Proyecto: ${label}`}
            />
            <Legend 
              formatter={(value) => 
                value === 'total_additions' ? 'Adiciones' :
                value === 'total_deletions' ? 'Eliminaciones' : 
                'Cambios Totales'
              }
            />
            <Bar dataKey="total_additions" fill="#10b981" />
            <Bar dataKey="total_deletions" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface CodeMetricsStatsProps {
  stats: {
    total_additions: number;
    total_deletions: number;
    total_changes: number;
    projects_tracked: number;
    weeks_with_data: number;
  };
  loading?: boolean;
}

export function CodeMetricsStats({ stats, loading = false }: CodeMetricsStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Adiciones',
      value: stats.total_additions.toLocaleString(),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Eliminaciones',
      value: stats.total_deletions.toLocaleString(),
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Cambios Totales',
      value: stats.total_changes.toLocaleString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Proyectos Rastreados',
      value: stats.projects_tracked.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Semanas Rastreadas',
      value: stats.weeks_with_data.toString(),
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} p-6 rounded-lg shadow`}>
          <div className="text-sm font-medium text-gray-600 mb-1">
            {stat.title}
          </div>
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ProjectDistributionChartProps {
  data: ProjectCodeMetrics[];
  loading?: boolean;
}

export function ProjectDistributionChart({ data, loading = false }: ProjectDistributionChartProps) {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Distribución de Código por Proyecto</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  // Prepare data for pie chart - take top 8 projects and group the rest as "Others"
  const sortedData = data.sort((a, b) => b.total_additions - a.total_additions);
  const topProjects = sortedData.slice(0, 8);
  const otherProjects = sortedData.slice(8);
  
  const chartData = [
    ...topProjects.map(project => ({
      name: project.project_name,
      value: project.total_additions,
      percentage: ((project.total_additions / data.reduce((sum, p) => sum + p.total_additions, 0)) * 100).toFixed(1)
    }))
  ];

  if (otherProjects.length > 0) {
    const otherTotal = otherProjects.reduce((sum, project) => sum + project.total_additions, 0);
    chartData.push({
      name: `Otros (${otherProjects.length})`,
      value: otherTotal,
      percentage: ((otherTotal / data.reduce((sum, p) => sum + p.total_additions, 0)) * 100).toFixed(1)
    });
  }

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Distribución de Código por Proyecto
      </h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString(), 'Líneas de Código']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
