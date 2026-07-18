export default function WorkoutStatsCard({
  title,
  value,
  subtitle,
  color,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <p className="text-slate-400">
        {title}
      </p>

      <h2 className={`mt-4 text-5xl font-bold ${color}`}>
        {value}
      </h2>

      <p className="mt-2 text-slate-500">
        {subtitle}
      </p>

    </div>
  );
}