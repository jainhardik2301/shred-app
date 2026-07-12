export default function StatCard({
  title,
  value,
  subtitle,
  color = "text-white",
}) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800 hover:border-emerald-500 transition-all duration-300 hover:-translate-y-1">
      <p className="text-slate-400 text-sm">{title}</p>

      <h2 className={`mt-3 text-4xl font-bold ${color}`}>
        {value}
      </h2>

      {subtitle && (
        <p className="mt-2 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}