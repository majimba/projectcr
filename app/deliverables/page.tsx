'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import InlineAssignee from '../components/ui/InlineAssignee';
import { Deliverable } from '@/types/database';

export default function DeliverablesPage() {
  const router = useRouter();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWeek, setFilterWeek] = useState('all');

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

  useEffect(() => {
    const fetchDeliverables = async () => {
      try {
        const response = await fetch('/api/deliverables');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched deliverables:', data);
          setDeliverables(data);
        } else if (response.status === 401) {
          console.log('User not authenticated, redirecting to login');
          router.push('/login');
        } else {
          console.error('Failed to fetch deliverables:', response.status, response.statusText);
          // Try to get error message
          try {
            const errorData = await response.json();
            console.error('Error details:', errorData);
          } catch {
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
    };

    fetchDeliverables();
  }, [router]);

  // Filter deliverables based on search and filters
  const filteredDeliverables = deliverables.filter(deliverable => {
    const matchesSearch = deliverable.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliverable.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deliverable.project_area.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || deliverable.status === filterStatus;
    const matchesWeek = filterWeek === 'all' || deliverable.week_number?.toString() === filterWeek;
    
    return matchesSearch && matchesStatus && matchesWeek;
  });

  if (loading) {
    return (
      <div className="flex h-screen bg-[#101922]">
        <Sidebar currentPage="deliverables" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1173d4] mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading deliverables...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#101922]">
      <Sidebar currentPage="deliverables" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-8">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Deliverables</h1>
                  <p className="text-gray-500 dark:text-gray-400">Track the progress of all project deliverables.</p>
                </div>
                <Link href="/task/create">
                  <Button>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Task
                  </Button>
                </Link>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#1173d4] focus:border-[#1173d4] placeholder:text-gray-400 dark:placeholder:text-gray-500" 
                    placeholder="Search deliverables..." 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#1173d4] focus:border-[#1173d4]"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="not-started">Not Started</option>
                    <option value="to-do">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="in-review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                  <select
                    className="rounded-md border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-[#1173d4] focus:border-[#1173d4]"
                    value={filterWeek}
                    onChange={(e) => setFilterWeek(e.target.value)}
                  >
                    <option value="all">All Weeks</option>
                    <option value="1">Week 1</option>
                    <option value="2">Week 2</option>
                    <option value="3">Week 3</option>
                    <option value="4">Week 4</option>
                  </select>
                </div>
              </div>

              {/* Deliverables Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/50">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                        Assignee
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
                        Project Area
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                        Week
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-[#101922] divide-y divide-gray-200 dark:divide-gray-700/50">
                    {filteredDeliverables.map((item) => (
                      <tr 
                        key={item.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                      >
                        <td 
                          className="px-6 py-4 cursor-pointer"
                          onClick={() => {
                            console.log('Clicked on deliverable:', item.id, item.title);
                            router.push(`/task/${item.id}`);
                          }}
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.description.length > 100 
                                ? `${item.description.substring(0, 100)}...` 
                                : item.description}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <InlineAssignee
                            currentAssignee={item.assignee_name || ''}
                            taskId={item.id}
                            onAssigneeChange={handleAssigneeChange}
                          />
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer"
                          onClick={() => {
                            console.log('Clicked on deliverable:', item.id, item.title);
                            router.push(`/task/${item.id}`);
                          }}
                        >
                          <StatusBadge status={item.status} />
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm cursor-pointer"
                          onClick={() => {
                            console.log('Clicked on deliverable:', item.id, item.title);
                            router.push(`/task/${item.id}`);
                          }}
                        >
                          <ProgressBar progress={item.progress} />
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                          onClick={() => {
                            console.log('Clicked on deliverable:', item.id, item.title);
                            router.push(`/task/${item.id}`);
                          }}
                        >
                          {item.due_date ? new Date(item.due_date).toLocaleDateString() : '-'}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                          onClick={() => {
                            console.log('Clicked on deliverable:', item.id, item.title);
                            router.push(`/task/${item.id}`);
                          }}
                        >
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {item.project_area}
                          </span>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 cursor-pointer"
                          onClick={() => {
                            console.log('Clicked on deliverable:', item.id, item.title);
                            router.push(`/task/${item.id}`);
                          }}
                        >
                          {item.week_number ? `Week ${item.week_number}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}