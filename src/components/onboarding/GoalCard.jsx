export default function GoalCard({
  title,
  description,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-5 text-left transition-all ${
        selected
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-slate-700 hover:border-slate-500"
      }`}
    >
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>
    </button>
  );
}