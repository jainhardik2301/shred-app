import { useApp } from "../../contexts/AppContext";

export default function StepsCard() {
  const { appData, setAppData } = useApp();

  const steps = Number(appData?.today?.steps) || 0;
  const goal = Number(appData?.goals?.steps) || 10000;

  function updateSteps(value) {
    const numericValue = Math.max(0, Number(value) || 0);

    setAppData((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        steps: numericValue,
      },
    }));
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="font-bold">🚶 Steps</h2>

      <label className="mt-4 block text-sm text-slate-400">
        Today's Steps
      </label>

      <input
        type="number"
        min="0"
        value={steps}
        onChange={(e) => updateSteps(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-500"
      />

      <p className="mt-5 text-sm text-slate-400">
        Goal {goal.toLocaleString()}
      </p>
    </div>
  );
}