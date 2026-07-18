export default function Badge({
  children,
  variant = "default",
}) {
  const variants = {
    default:
      "bg-slate-800 text-slate-200",

    success:
      "bg-emerald-500/20 text-emerald-400",

    warning:
      "bg-amber-500/20 text-amber-400",

    danger:
      "bg-red-500/20 text-red-400",

    info:
      "bg-sky-500/20 text-sky-400",

    purple:
      "bg-violet-500/20 text-violet-400",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${variants[variant]}
      `}
    >
      {children}
    </span>
  );
}