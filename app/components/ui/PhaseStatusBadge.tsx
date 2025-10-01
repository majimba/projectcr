import React from 'react';

interface PhaseStatusBadgeProps {
  status: 'not-started' | 'in-progress' | 'completed';
}

const PhaseStatusBadge = React.memo(function PhaseStatusBadge({ status }: PhaseStatusBadgeProps) {
  // Map project phase status values to display values
  const statusMapping = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'completed': 'Completed',
  };
  
  const statusStyles = {
    'not-started': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
    'in-progress': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
    'completed': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
  };

  const displayStatus = statusMapping[status];
  const styleClass = statusStyles[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styleClass}`}>
      {displayStatus}
    </span>
  );
});

export default PhaseStatusBadge;
