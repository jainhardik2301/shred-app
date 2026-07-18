export default function Section({
  title,
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-2xl bg-slate-900 p-8 ${className}`}
    >
      {title && (
        <h2 className="mb-6 text-2xl font-bold">
          {title}
        </h2>
      )}

      {children}
    </section>
  );
}