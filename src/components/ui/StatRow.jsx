export default function StatRow({
  label,
  value,
  valueColor = "text-white",
}) {
  return (
    <div className="flex items-center justify-between py-3">

      <span className="text-slate-400">
        {label}
      </span>

      <span className={`font-semibold ${valueColor}`}>
        {value}
      </span>

    </div>
  );
}