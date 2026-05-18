interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: string;
}

export default function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-rose-50 dark:border-gray-700">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>
    </div>
  );
}
