interface StatusBadgeProps {
  status: 'Done' | 'In Progress' | 'In Review' | 'To Do' | 'Not Started' | 'Completed';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status === 'Completed' ? 'Done' : status;
  
  const statusStyles = {
    'Done': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
    'In Progress': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
    'In Review': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
    'To Do': 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300',
    'Not Started': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[normalizedStatus as keyof typeof statusStyles]}`}>
      {status}
    </span>
  );
}
