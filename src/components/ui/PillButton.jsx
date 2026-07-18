export default function PillButton({
  children,
  active = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-full
        px-5
        py-2
        font-medium
        transition

        ${
          active
            ? "bg-emerald-500 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }
      `}
    >
      {children}
    </button>
  );
}