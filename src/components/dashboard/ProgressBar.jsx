export default function ProgressBar({
  title,
  value,
  goal,
  color = "bg-emerald-500",
  unit = "",
}) {
  const percentage = Math.min((value / goal) * 100, 100);

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="font-medium text-slate-300">
          {title}
        </span>

        <span className="text-slate-400 text-sm">
          {value} / {goal ?? "-"} {unit}
        </span>
      </div>

      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full transition-all duration-700`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}