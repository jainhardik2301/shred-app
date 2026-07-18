export default function DashboardCard({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-6
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-emerald-500
        hover:shadow-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}