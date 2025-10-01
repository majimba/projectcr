'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import KpiCard from './components/ui/KpiCard';
import StatusBadge from './components/ui/StatusBadge';
import ProgressBar from './components/ui/ProgressBar';
import InlineAssignee from './components/ui/InlineAssignee';
import ProjectProgressStatusBar from './components/ProjectProgressStatusBar';
import { Deliverable } from '@/types/database';

export default function Dashboard() {
  const router = useRouter();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [isDeliverablesExpanded, setIsDeliverablesExpanded] = useState(false);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    week: 'all',
    projectArea: 'all',
    assignee: 'all'
  });
  const [teamMembers, setTeamMembers] = useState<Array<{id: string, name: string, role: string}>>([]);

  // Handle assignee changes
  const handleAssigneeChange = (taskId: string, newAssignee: string) => {
    setDeliverables(prev => 
      prev.map(deliverable => 
        deliverable.id === taskId 
          ? { ...deliverable, assignee_name: newAssignee }
          : deliverable
      )
    );
  };

  // Fetch team members for assignee filter
  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await fetch('/api/team-members');
      if (response.ok) {
        const members = await response.json();
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  }, []);

  // Filter change handlers
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setShowFilters(false); // Close dropdown after selection
  };

  const clearAllFilters = () => {
    setFilters({
      status: 'all',
      week: 'all',
      projectArea: 'all',
      assignee: 'all'
    });
    setShowFilters(false); // Close dropdown after clearing
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== 'all').length;
  };

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
    fetchTeamMembers();
  }, [fetchDeliverables, fetchTeamMembers]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const filterButton = document.querySelector('[data-filter-button]');
      const filterDropdown = document.querySelector('[data-filter-dropdown]');
      
      if (filterButton && filterDropdown && 
          !filterButton.contains(event.target as Node) && 
          !filterDropdown.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showFilters]);

  // Calculate KPIs from real data
  const totalDeliverables = deliverables.length;
  const completedDeliverables = deliverables.filter(d => d.status === 'done').length;
  const inProgressDeliverables = deliverables.filter(d => d.status === 'in-progress').length;

  // Filter deliverables by all active filters
  const filteredDeliverables = deliverables.filter(deliverable => {
    // Status filter
    if (filters.status !== 'all' && deliverable.status !== filters.status) {
      return false;
    }
    
    // Week filter
    if (filters.week !== 'all' && deliverable.week_number !== parseInt(filters.week)) {
      return false;
    }
    
    // Project area filter
    if (filters.projectArea !== 'all' && deliverable.project_area !== filters.projectArea) {
      return false;
    }
    
    // Assignee filter
    if (filters.assignee !== 'all') {
      if (filters.assignee === 'unassigned' && deliverable.assignee_name) {
        return false;
      }
      if (filters.assignee !== 'unassigned' && deliverable.assignee_name !== filters.assignee) {
        return false;
      }
    }
    
    return true;
  });


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

  // Fallback mock data if no real data - matches database schema and real team members
  const mockDeliverables: Deliverable[] = [
    {
      id: "1",
      title: "Website Redesign",
      description: "Complete redesign of the company website with modern UI/UX",
      status: "done" as const,
      assignee_id: "user-1",
      assignee_name: "Chawana Masaka",
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
      assignee_name: "Maynard Muchangwe",
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
      assignee_name: "Chawana Masaka",
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
      assignee_name: "",
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
      assignee_name: "Maynard Muchangwe",
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

              {/* Project Progress Status Bar */}
              <ProjectProgressStatusBar deliverables={displayDeliverables} />

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
                        <div className="relative">
                          <button 
                            data-filter-button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Filters</span>
                            {getActiveFiltersCount() > 0 && (
                              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                {getActiveFiltersCount()}
                              </span>
                            )}
                          </button>
                          
                          {showFilters && (
                            <div data-filter-dropdown className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 p-4">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Deliverables</h3>
                                  <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                  >
                                    Clear All
                                  </button>
                                </div>
                                
                                {/* Status Filter */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Status
                                  </label>
                                  <select
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="all">All Status</option>
                                    <option value="not-started">Not Started</option>
                                    <option value="to-do">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="in-review">In Review</option>
                                    <option value="done">Done</option>
                                  </select>
                                </div>
                                
                                {/* Week Filter */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Week
                                  </label>
                                  <select
                                    value={filters.week}
                                    onChange={(e) => handleFilterChange('week', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="all">All Weeks</option>
                                    <option value="1">Week 1</option>
                                    <option value="2">Week 2</option>
                                    <option value="3">Week 3</option>
                                    <option value="4">Week 4</option>
                                  </select>
                                </div>
                                
                                {/* Project Area Filter */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Project Area
                                  </label>
                                  <select
                                    value={filters.projectArea}
                                    onChange={(e) => handleFilterChange('projectArea', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="all">All Areas</option>
                                    <option value="Strategy Layer">Strategy Layer</option>
                                    <option value="Branding & Identity">Branding & Identity</option>
                                    <option value="Social Media & Marketing">Social Media & Marketing</option>
                                    <option value="HR & People">HR & People</option>
                                    <option value="Finance & Administration">Finance & Administration</option>
                                    <option value="Operations & Systems">Operations & Systems</option>
                                    <option value="Client-Facing Readiness">Client-Facing Readiness</option>
                                  </select>
                                </div>
                                
                                {/* Assignee Filter */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Assignee
                                  </label>
                                  <select
                                    value={filters.assignee}
                                    onChange={(e) => handleFilterChange('assignee', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="all">All Assignees</option>
                                    <option value="unassigned">Unassigned</option>
                                    {teamMembers.map((member) => (
                                      <option key={member.id} value={member.name}>
                                        {member.name} ({member.role})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
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
                          {filteredDeliverables.map((item) => (
                            <tr 
                              key={item.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                            >
                              <td 
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() => {
                                  console.log('Clicked on deliverable title from dashboard:', item.id, item.title);
                                  router.push(`/task/${item.id}`);
                                }}
                              >
                                {item.title}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                <InlineAssignee
                                  currentAssignee={item.assignee_name || ''}
                                  taskId={item.id}
                                  onAssigneeChange={handleAssigneeChange}
                                />
                              </td>
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