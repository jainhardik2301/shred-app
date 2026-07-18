import DashboardCard from "./DashboardCard";

export default function StatCard({
  title,
  value,
  subtitle,
  color = "text-white",
  icon = null,
}) {
  return (
    <DashboardCard>

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h2 className={`mt-3 text-4xl font-bold ${color}`}>
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        {icon && (
          <div className="rounded-xl bg-slate-800 p-3">
            {icon}
          </div>
        )}

      </div>

    </DashboardCard>
  );
}