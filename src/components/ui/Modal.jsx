export default function Modal({
  open,
  title,
  children,
  onClose,
  maxWidth = "max-w-lg",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div
        className={`w-full ${maxWidth} rounded-2xl bg-slate-900 p-8 shadow-2xl`}
      >

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-3 py-2 transition hover:bg-slate-700"
          >
            ✕
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}