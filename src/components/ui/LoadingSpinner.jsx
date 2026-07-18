export default function LoadingSpinner({
  text = "Loading...",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">

      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />

      <p className="mt-5 text-slate-400">
        {text}
      </p>

    </div>
  );
}