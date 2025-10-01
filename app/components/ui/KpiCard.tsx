interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function KpiCard({ label, value, trend }: KpiCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg p-6 bg-white dark:bg-gray-800/50 shadow-sm">
      <p className="text-base font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{value}</p>
        {trend && (
          <span className={`text-sm font-medium flex items-center gap-1 ${
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
