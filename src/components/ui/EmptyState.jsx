export default function EmptyState({
  title,
  subtitle,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 py-16">

      <div className="text-6xl">
        📭
      </div>

      <h3 className="mt-5 text-2xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-slate-400">
        {subtitle}
      </p>

    </div>
  );
}