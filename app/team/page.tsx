'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import TeamMemberDetail from '../components/TeamMemberDetail';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  tasks: string;
  avatar_url?: string | null;
  bio: string;
  phone: string;
  is_active: boolean;
  joined_at: string;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/team-members');
      
      if (!response.ok) {
        throw new Error('Failed to fetch team members');
      }
      
      const data = await response.json();
      setTeamMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="flex h-screen bg-[#101922]">
      <Sidebar currentPage="team" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-8">
              {/* Page Header */}
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Team Members</h1>
                <p className="text-gray-500 dark:text-gray-400">View and manage the team members involved in Project CR.</p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-300">Loading team members...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Error loading team members
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        {error}
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={fetchTeamMembers}
                        >
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Members Table */}
              {!loading && !error && (
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700/50 bg-white dark:bg-gray-800/30 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700/50">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Assigned Tasks
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" scope="col">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#101922] divide-y divide-gray-200 dark:divide-gray-700/50">
                      {teamMembers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                            No team members found. Please add team members to get started.
                          </td>
                        </tr>
                      ) : (
                        teamMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                                  {member.avatar_url ? (
                                    <Image
                                      src={member.avatar_url}
                                      alt={member.name}
                                      width={40}
                                      height={40}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                                      {member.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {member.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {member.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                              {member.role}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
                              {member.tasks}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewDetails(member)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Team Member Detail Modal */}
      <TeamMemberDetail
        member={selectedMember}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}