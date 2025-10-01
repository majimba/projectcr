interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({ progress, showLabel = true, size = 'md' }: ProgressBarProps) {
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-gray-200 dark:bg-gray-700 rounded-full ${sizeStyles[size]}`}>
        <div 
          className={`bg-[#1173d4] ${sizeStyles[size]} rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 min-w-[3rem]">
          {progress}%
        </span>
      )}
    </div>
  );
}
