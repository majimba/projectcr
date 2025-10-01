import React from 'react';

interface StatusBadgeProps {
  status: 'not-started' | 'to-do' | 'in-progress' | 'in-review' | 'done';
}

const StatusBadge = React.memo(function StatusBadge({ status }: StatusBadgeProps) {
  // Map database status values to display values
  const statusMapping = {
    'not-started': 'Not Started',
    'to-do': 'To Do',
    'in-progress': 'In Progress',
    'in-review': 'In Review',
    'done': 'Done',
  };
  
  const statusStyles = {
    'not-started': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
    'to-do': 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300',
    'in-progress': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
    'in-review': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
    'done': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
  };

  const displayStatus = statusMapping[status];
  const styleClass = statusStyles[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styleClass}`}>
      {displayStatus}
    </span>
  );
});

export default StatusBadge;
