export default function Card({
  children,
  title,
  subtitle,
  className = "",
  action = null,
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-800
        bg-slate-900
        p-6
        shadow-lg
        ${className}
      `}
    >
      {(title || action) && (
        <div className="mb-6 flex items-start justify-between">

          <div>

            {title && (
              <h2 className="text-xl font-bold text-white">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">
                {subtitle}
              </p>
            )}

          </div>

          {action}

        </div>
      )}

      {children}

    </div>
  );
}