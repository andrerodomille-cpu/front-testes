import { LucideIcon } from "lucide-react";

interface MetricBoxProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export function MetricBox({ title, value, icon: Icon }: MetricBoxProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
        <span className="text-xs">{title}</span>
      </div>

      <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </div>
    </div>
  );
}