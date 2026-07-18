export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const variants = {
    primary:
      "bg-emerald-500 hover:bg-emerald-600 text-white",

    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",

    outline:
      "border border-slate-700 hover:bg-slate-800 text-white",

    info:
      "bg-blue-500 hover:bg-blue-600 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-xl
        px-5
        py-3
        font-semibold
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}