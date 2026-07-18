import DashboardCard from "./DashboardCard";

export default function ProgressCard({
  title,
  value,
  subtitle,
  progress,
  color = "bg-emerald-500",
}) {
  return (
    <DashboardCard>

      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <h1 className="mt-6 text-6xl font-bold">
        {value}
      </h1>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">

        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{
            width: `${Math.min(progress, 100)}%`,
          }}
        />

      </div>

      <p className="mt-4 text-slate-400">
        {subtitle}
      </p>

    </DashboardCard>
  );
}