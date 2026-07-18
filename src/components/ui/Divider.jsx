export default function Divider({
  label = "",
  className = "",
}) {
  return (
    <div
      className={`flex items-center gap-4 ${className}`}
    >
      <div className="h-px flex-1 bg-slate-800" />

      {label && (
        <span className="whitespace-nowrap text-sm text-slate-400">
          {label}
        </span>
      )}

      <div className="h-px flex-1 bg-slate-800" />
    </div>
  );
}