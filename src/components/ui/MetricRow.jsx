export default function MetricRow({
  label,
  value,
  color = "text-white",
}) {
  return (
    <div className="flex items-center justify-between py-2">

      <span className="text-slate-400">
        {label}
      </span>

      <span className={`font-semibold ${color}`}>
        {value}
      </span>

    </div>
  );
}