export default function SectionHeader({
  title,
  subtitle,
  action = null,
}) {
  return (
    <div className="mb-8 flex items-center justify-between">

      <div>

        <h1 className="text-3xl font-bold text-white">
  {title}
</h1>

        {subtitle && (
          <p className="mt-2 text-slate-400">
            {subtitle}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}