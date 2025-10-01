'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Deliverable, ProjectPhase } from '@/types/database';

export default function ReportsPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredDeliverables, setFilteredDeliverables] = useState<Deliverable[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch deliverables
        const deliverablesResponse = await fetch('/api/deliverables');
        if (deliverablesResponse.ok) {
          const deliverablesData = await deliverablesResponse.json();
          setDeliverables(deliverablesData);
          setFilteredDeliverables(deliverablesData);
        }

        // Fetch phases
        const phasesResponse = await fetch('/api/project-phases');
        if (phasesResponse.ok) {
          const phasesData = await phasesResponse.json();
          setPhases(phasesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate status data from real deliverables
  const statusData = [
    { 
      name: 'Done', 
      value: deliverables.filter(d => d.status === 'done').length, 
      fill: '#10B981' 
    },
    { 
      name: 'In Progress', 
      value: deliverables.filter(d => d.status === 'in-progress').length, 
      fill: '#F59E0B' 
    },
    { 
      name: 'Not Started', 
      value: deliverables.filter(d => d.status === 'not-started').length, 
      fill: '#6B7280' 
    },
  ];

  // Calculate progress by week
  const progressData = phases.map(phase => {
    const phaseDeliverables = deliverables.filter(d => d.week_number === phase.order_index);
    const completedTasks = phaseDeliverables.filter(d => d.status === 'done').length;
    const totalTasks = phaseDeliverables.length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      week: `Week ${phase.order_index}`,
      value: progress,
      completed: completedTasks,
      total: totalTasks
    };
  });

  // Calculate overall progress
  const totalDeliverables = deliverables.length;
  const completedDeliverables = deliverables.filter(d => d.status === 'done').length;
  const overallProgress = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;

  const projectAreaOptions = [
    { value: 'all', label: 'All Areas' },
    { value: 'Strategy Layer', label: 'Strategy Layer' },
    { value: 'Branding & Identity', label: 'Branding & Identity' },
    { value: 'Social Media & Marketing', label: 'Social Media & Marketing' },
    { value: 'HR & People', label: 'HR & People' },
    { value: 'Finance & Administration', label: 'Finance & Administration' },
    { value: 'Operations & Systems', label: 'Operations & Systems' },
    { value: 'Client-Facing Readiness', label: 'Client-Facing Readiness' },
  ];

  const assigneeOptions = [
    { value: 'all', label: 'All Assignees' },
    { value: 'chawana', label: 'Chawana Maseka' },
    { value: 'unassigned', label: 'Unassigned' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-[#101922]">
        <Sidebar currentPage="reports" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1173d4] mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading reports...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#101922]">
      <Sidebar currentPage="reports" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-8">
              {/* Page Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Generate custom reports to track project progress and performance.
                </p>
              </div>

              {/* Report Filters */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Report Filters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select 
                    label="Project Area" 
                    options={projectAreaOptions}
                    defaultValue="all"
                  />
                  <Select 
                    label="Assignee" 
                    options={assigneeOptions}
                    defaultValue="all"
                  />
                  <Input 
                    label="Start Date" 
                    type="date"
                    placeholder="mm/dd/yyyy"
                  />
                  <Input 
                    label="End Date" 
                    type="date"
                    placeholder="mm/dd/yyyy"
                  />
                </div>
                <div className="mt-4">
                  <Button>Generate Report</Button>
                </div>
              </div>

              {/* Report Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deliverables Status */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Project CR Status</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <p className="text-4xl font-bold text-gray-900 dark:text-white">{overallProgress}%</p>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {completedDeliverables} of {totalDeliverables} tasks completed
                      </span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Bar dataKey="value" fill="#1173d4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Progress Over Time */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Progress by Week</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <p className="text-4xl font-bold text-gray-900 dark:text-white">{overallProgress}%</p>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Overall Project CR completion
                      </span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="week" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#1173d4" 
                        strokeWidth={3}
                        dot={{ fill: '#1173d4', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Data */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project CR Tasks</h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700/50">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/50">
                    <thead className="bg-gray-50 dark:bg-gray-800/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Area</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assignee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#101922] divide-y divide-gray-200 dark:divide-gray-700/50">
                      {filteredDeliverables.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.title}
                            </div>
                            {item.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {item.description.length > 60 
                                  ? `${item.description.substring(0, 60)}...` 
                                  : item.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {item.project_area}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.week_number ? `Week ${item.week_number}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <StatusBadge status={item.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.assignee_name || 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {item.due_date ? new Date(item.due_date).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="w-32">
                              <ProgressBar progress={item.progress} size="sm" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}