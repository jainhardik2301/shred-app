const quotes = [
  "Discipline beats motivation.",
  "Small progress is still progress.",
  "Stay consistent.",
  "Every healthy choice counts.",
  "Trust the process.",
];

export default function MotivationCard() {
  const quote =
    quotes[new Date().getDate() % quotes.length];

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 p-6">

      <h2 className="text-xl font-bold">
        Daily Motivation
      </h2>

      <p className="mt-6 text-lg italic text-slate-200">
        "{quote}"
      </p>

    </div>
  );
}