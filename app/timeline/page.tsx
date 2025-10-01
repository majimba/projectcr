'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import StatusBadge from '../components/ui/StatusBadge';
import PhaseStatusBadge from '../components/ui/PhaseStatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import { ProjectPhase, Deliverable } from '@/types/database';

export default function TimelinePage() {
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch phases
        const phasesResponse = await fetch('/api/project-phases');
        if (phasesResponse.ok) {
          const phasesData = await phasesResponse.json();
          setPhases(phasesData);
        }

        // Fetch deliverables
        const deliverablesResponse = await fetch('/api/deliverables');
        if (deliverablesResponse.ok) {
          const deliverablesData = await deliverablesResponse.json();
          setDeliverables(deliverablesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#101922]">
        <Sidebar currentPage="timeline" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1173d4] mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading timeline...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#101922]">
      <Sidebar currentPage="timeline" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-8">
              {/* Page Header */}
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Project CR Timeline</h1>
                <p className="text-gray-500 dark:text-gray-400">Track the progress of Project CR deliverables and milestones.</p>
              </div>

              {/* Timeline Phases */}
              <div className="space-y-4">
                {phases.map((phase, index) => {
                  const phaseDeliverables = deliverables.filter(d => d.week_number === phase.order_index);
                  const completedTasks = phaseDeliverables.filter(d => d.status === 'done').length;
                  const totalTasks = phaseDeliverables.length;
                  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                  return (
                    <div key={phase.id} className="flex items-start gap-4">
                      {/* Timeline Line */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-[#1173d4] flex items-center justify-center text-2xl">
                          {phase.icon || '📋'}
                        </div>
                        {index < phases.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-700"></div>
                        )}
                      </div>
                      
                      {/* Phase Details */}
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{phase.name}</h3>
                          <PhaseStatusBadge status={phase.status} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {phase.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {phase.start_date ? `Start: ${new Date(phase.start_date).toLocaleDateString()}` : ''}
                          </span>
                          <span>
                            {phase.due_date ? `Due: ${new Date(phase.due_date).toLocaleDateString()}` : ''}
                          </span>
                          <span className="font-medium">
                            {completedTasks}/{totalTasks} tasks completed
                          </span>
                        </div>
                        {totalTasks > 0 && (
                          <div className="mt-3">
                            <ProgressBar progress={progress} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Task Breakdown */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project CR Tasks</h2>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/50">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Task
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Project Area
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Week
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Assignee
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#101922] divide-y divide-gray-200 dark:divide-gray-700/50">
                      {deliverables.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </div>
                            {task.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {task.description.length > 80 
                                  ? `${task.description.substring(0, 80)}...` 
                                  : task.description}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {task.project_area}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {task.week_number ? `Week ${task.week_number}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <StatusBadge status={task.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <ProgressBar progress={task.progress} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {task.assignee_name || 'Unassigned'}
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