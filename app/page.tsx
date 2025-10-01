'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import KpiCard from './components/ui/KpiCard';
import StatusBadge from './components/ui/StatusBadge';
import ProgressBar from './components/ui/ProgressBar';
import { Deliverable } from '@/types/database';

export default function Dashboard() {
  const router = useRouter();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isDeliverablesExpanded, setIsDeliverablesExpanded] = useState(false);

  const fetchDeliverables = useCallback(async () => {
    try {
      const response = await fetch('/api/deliverables');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched deliverables:', data);
        setDeliverables(data);
      } else if (response.status === 401) {
        console.log('User not authenticated, using mock data');
        // User not authenticated, use mock data
        setDeliverables([]);
      } else {
        console.error('Failed to fetch deliverables:', response.status, response.statusText);
        // Try to get error message
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
        } catch (e) {
          console.error('Could not parse error response');
        }
        setDeliverables([]);
      }
    } catch (error) {
      console.error('Error fetching deliverables:', error);
      setDeliverables([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliverables();
  }, [fetchDeliverables]);

  // Calculate KPIs from real data
  const totalDeliverables = deliverables.length;
  const completedDeliverables = deliverables.filter(d => d.status === 'done').length;
  const inProgressDeliverables = deliverables.filter(d => d.status === 'in-progress').length;

  // Filter deliverables by selected week
  const filteredDeliverables = selectedWeek 
    ? deliverables.filter(d => d.week_number === selectedWeek)
    : deliverables;

  // Get deliverables count for each week
  const getWeekDeliverablesCount = (weekNumber: number) => {
    return deliverables.filter(d => d.week_number === weekNumber).length;
  };

  const getWeekCompletedCount = (weekNumber: number) => {
    return deliverables.filter(d => d.week_number === weekNumber && d.status === 'done').length;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#101922]">
        <Sidebar currentPage="dashboard" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1173d4] mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Fallback mock data if no real data - matches database schema
  const mockDeliverables: Deliverable[] = [
    {
      id: "1",
      title: "Website Redesign",
      description: "Complete redesign of the company website with modern UI/UX",
      status: "done" as const,
      assignee_id: "user-1",
      assignee_name: "Alice Johnson",
      project_area: "Branding & Identity",
      due_date: "2025-03-15",
      week_number: 1,
      document_link: null,
      progress: 100,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-15T00:00:00Z",
      created_by: "user-1"
    },
    {
      id: "2",
      title: "Mobile App Development",
      description: "Develop mobile application for iOS and Android platforms",
      status: "in-progress" as const,
      assignee_id: "user-2",
      assignee_name: "Bob Williams",
      project_area: "Operations & Systems",
      due_date: "2025-04-20",
      week_number: 2,
      document_link: null,
      progress: 60,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-15T00:00:00Z",
      created_by: "user-1"
    },
    {
      id: "3",
      title: "Marketing Campaign Launch",
      description: "Launch comprehensive marketing campaign across all channels",
      status: "in-review" as const,
      assignee_id: "user-3",
      assignee_name: "Charlie Brown",
      project_area: "Social Media & Marketing",
      due_date: "2025-05-10",
      week_number: 3,
      document_link: null,
      progress: 90,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-15T00:00:00Z",
      created_by: "user-1"
    },
    {
      id: "4",
      title: "Customer Support Training",
      description: "Train customer support team on new processes and tools",
      status: "to-do" as const,
      assignee_id: "user-4",
      assignee_name: "Diana Miller",
      project_area: "HR & People",
      due_date: "2025-06-01",
      week_number: 4,
      document_link: null,
      progress: 0,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-15T00:00:00Z",
      created_by: "user-1"
    },
    {
      id: "5",
      title: "Product Documentation Update",
      description: "Update all product documentation with latest features",
      status: "done" as const,
      assignee_id: "user-5",
      assignee_name: "Eva Wilson",
      project_area: "Operations & Systems",
      due_date: "2025-02-28",
      week_number: 1,
      document_link: null,
      progress: 100,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-15T00:00:00Z",
      created_by: "user-1"
    }
  ];

  const displayDeliverables = deliverables.length > 0 ? deliverables : mockDeliverables;

  return (
    <div className="flex h-screen bg-[#101922]">
      <Sidebar currentPage="dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-8">
              {/* Page Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Project CR Dashboard</h1>
                  <p className="text-gray-500 dark:text-gray-400">Track the real-time status of all deliverables for Project CR.</p>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard label="Total Deliverables" value={totalDeliverables} />
                <KpiCard label="Deliverables Completed" value={completedDeliverables} />
                <KpiCard label="Deliverables In Progress" value={inProgressDeliverables} />
              </div>

              {/* Week Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((weekNumber) => {
                  const weekDeliverables = getWeekDeliverablesCount(weekNumber);
                  const weekCompleted = getWeekCompletedCount(weekNumber);
                  const isSelected = selectedWeek === weekNumber;
                  
                  return (
                    <div
                      key={weekNumber}
                      className={`rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-[#1173d4] bg-[#1173d4]/10 dark:bg-[#1173d4]/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 hover:border-[#1173d4]/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                      onClick={() => setSelectedWeek(isSelected ? null : weekNumber)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Week {weekNumber}
                        </h3>
                        {isSelected && (
                          <div className="w-2 h-2 bg-[#1173d4] rounded-full"></div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Tasks</span>
                          <span className="font-medium text-gray-900 dark:text-white">{weekDeliverables}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Completed</span>
                          <span className="font-medium text-green-600 dark:text-green-400">{weekCompleted}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                          <div 
                            className="bg-[#1173d4] h-2 rounded-full transition-all duration-300"
                            style={{ width: weekDeliverables > 0 ? `${(weekCompleted / weekDeliverables) * 100}%` : '0%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Week Tasks */}
              {selectedWeek && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Week {selectedWeek} Tasks
                    </h2>
                    <button
                      onClick={() => setSelectedWeek(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {filteredDeliverables.length > 0 ? (
                    <div className="space-y-3">
                      {filteredDeliverables.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                          onClick={() => {
                            console.log('Clicked on deliverable from week view:', item.id, item.title);
                            router.push(`/task/${item.id}`);
                          }}
                        >
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.assignee_name || 'Unassigned'} • {item.project_area}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={item.status} />
                            <ProgressBar progress={item.progress} size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No tasks found for Week {selectedWeek}
                    </p>
                  )}
                </div>
              )}

              {/* Collapsible Deliverables Summary */}
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30">
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  onClick={() => setIsDeliverablesExpanded(!isDeliverablesExpanded)}
                >
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Deliverables Summary</h2>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isDeliverablesExpanded ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDeliverablesExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input 
                            className="w-full rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#1173d4] focus:border-[#1173d4] placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                            placeholder="Search deliverables..." 
                            type="text"
                          />
                        </div>
                        <button className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          <span>Filters</span>
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700/50">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/50">
                        <thead className="bg-gray-50 dark:bg-gray-800/30">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Deliverable</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Assignee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Progress</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">Due Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#101922] divide-y divide-gray-200 dark:divide-gray-700/50">
                          {displayDeliverables.map((item) => (
                            <tr 
                              key={item.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/20 cursor-pointer transition-colors"
                              onClick={() => {
                                console.log('Clicked on deliverable from dashboard:', item.id, item.title);
                                router.push(`/task/${item.id}`);
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.title}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.assignee_name || 'Unassigned'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <StatusBadge status={item.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <ProgressBar progress={item.progress} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.due_date || 'No due date'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}