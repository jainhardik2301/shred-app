export default function MetricCard({
  label,
  value,
  unit = "",
  color = "text-white",
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <h2 className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
        {unit && (
          <span className="ml-1 text-lg">
            {unit}
          </span>
        )}
      </h2>

    </div>
  );
}