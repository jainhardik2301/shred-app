export default function ProgressBar({
  title,
  value,
  goal,
  color = "bg-emerald-500",
  unit = "",
}) {
  const safeValue =
    Number(value) || 0;

  const safeGoal =
    Number(goal) || 0;

  const percentage =
    safeGoal > 0
      ? Math.min(
          Math.max(
            (safeValue / safeGoal) * 100,
            0
          ),
          100
        )
      : 0;

  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-between">
        <span className="font-medium text-slate-300">
          {title}
        </span>

        <span className="text-sm text-slate-400">
          {safeValue} /{" "}
          {safeGoal > 0
            ? safeGoal
            : "-"}{" "}
          {unit}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-800">
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