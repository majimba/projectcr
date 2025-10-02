'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  tasks: string;
  avatar_url: string | null;
  bio: string;
  phone: string;
  is_active: boolean;
  joined_at: string;
}

interface InlineAssigneeProps {
  currentAssignee: string;
  taskId: string;
  onAssigneeChange: (taskId: string, newAssignee: string) => void;
}

const InlineAssignee: React.FC<InlineAssigneeProps> = ({ 
  currentAssignee, 
  taskId, 
  onAssigneeChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch team members when dropdown opens
  const fetchTeamMembers = async () => {
    if (teamMembers.length > 0) return; // Already fetched
    
    setLoading(true);
    try {
      const response = await fetch('/api/team-members');
      if (response.ok) {
        const members = await response.json();
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle assignee selection
  const handleAssigneeSelect = async (newAssignee: string) => {
    if (newAssignee === currentAssignee) {
      setIsOpen(false);
      return;
    }

    setUpdating(true);
    try {
      // Update via API
      const response = await fetch(`/api/deliverables/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignee_name: newAssignee
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        
        // Send assignment notification if task was assigned to someone
        if (newAssignee && newAssignee !== 'Unassigned') {
          try {
            await fetch('/api/email/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'assignment',
                taskData: updatedTask,
                assigneeName: newAssignee
              })
            });
            console.log('Assignment email sent successfully');
          } catch (emailError) {
            console.error('Failed to send assignment email:', emailError);
            // Don't fail the assignment if email fails
          }
        }
        
        // Call parent callback to update local state
        onAssigneeChange(taskId, newAssignee);
        setIsOpen(false);
      } else {
        console.error('Failed to update assignee');
      }
    } catch (error) {
      console.error('Error updating assignee:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Handle dropdown toggle
  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    if (!isOpen) {
      await fetchTeamMembers();
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const displayName = currentAssignee || 'Unassigned';
  const isUnassigned = !currentAssignee;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        disabled={updating}
        className={`
          px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
          ${isUnassigned 
            ? 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700' 
            : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50'
          }
          ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
          flex items-center gap-2 min-w-0
        `}
      >
        <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {isUnassigned ? '?' : displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="truncate flex-1">{displayName}</span>
        {updating ? (
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : (
          <svg 
            className={`w-3 h-3 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
          <div className="py-1">
            {/* Unassigned option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAssigneeSelect('');
              }}
              className={`
                w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                ${!currentAssignee ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''}
                flex items-center gap-2
              `}
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">?</span>
              </div>
              <div>
                <div className="font-medium">Unassigned</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">No one assigned</div>
              </div>
            </button>
            
            {/* Loading state */}
            {loading && (
              <div className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                Loading team members...
              </div>
            )}
            
            {/* Team members */}
            {!loading && teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAssigneeSelect(member.name);
                }}
                className={`
                  w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                  ${currentAssignee === member.name ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''}
                  flex items-center gap-2
                `}
              >
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{member.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.role}</div>
                </div>
                {currentAssignee === member.name && (
                  <div className="w-4 h-4 text-blue-600 dark:text-blue-400">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
            
            {/* Empty state */}
            {!loading && teamMembers.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                No team members found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineAssignee;
