import { useApp } from "../../contexts/AppContext";

export default function SleepCard() {
  const { appData, setAppData } = useApp();

  const sleep = Number(appData?.today?.sleep) || 0;

  function updateSleep(value) {
    const numericValue = Math.max(0, Math.min(24, Number(value) || 0));

    setAppData((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        sleep: numericValue,
      },
    }));
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="font-bold">😴 Sleep</h2>

      <label className="mt-4 block text-sm text-slate-400">
        Hours Slept
      </label>

      <input
        type="number"
        min="0"
        max="24"
        step="0.5"
        value={sleep}
        onChange={(e) => updateSleep(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-500"
      />

      <p className="mt-5 text-sm text-slate-400">
        Recommended 7–9 hours
      </p>
    </div>
  );
}