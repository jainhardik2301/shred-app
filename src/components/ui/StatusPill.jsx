export default function StatusPill({
  status = "default",
  text,
}) {
  const colors = {
    default: "bg-slate-700 text-white",
    success: "bg-emerald-500/20 text-emerald-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400",
    info: "bg-sky-500/20 text-sky-400",
  };

  return (
    <span
      className={`
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${colors[status]}
      `}
    >
      {text}
    </span>
  );
}