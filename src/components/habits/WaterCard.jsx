import { useApp } from "../../contexts/AppContext";

export default function WaterCard() {
  const { appData, setAppData } = useApp();

  const water = Number(appData?.today?.water) || 0;
  const goal = Number(appData?.goals?.water) || 3.4;

  function addWater() {
    setAppData((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        water: +((Number(prev.today?.water) || 0) + 0.25).toFixed(2),
      },
    }));
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="font-bold">💧 Water</h2>

      <h1 className="mt-6 text-4xl font-bold text-sky-400">
        {water} L
      </h1>

      <p className="mt-3 text-sm text-slate-400">
        Goal {goal} L
      </p>

      <button
        onClick={addWater}
        className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white hover:bg-emerald-600"
      >
        +250 ml
      </button>
    </div>
  );
}