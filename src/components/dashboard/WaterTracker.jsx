import { useApp } from "../../contexts/AppContext";
import Button from "../ui/Button";

export default function WaterTracker() {
  const { appData, setAppData } = useApp();

  function addWater() {
    setAppData((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        water: +(prev.today.water + 0.25).toFixed(2),
      },
    }));
  }

  function removeWater() {
    setAppData((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        water: Math.max(
          0,
          +(prev.today.water - 0.25).toFixed(2)
        ),
      },
    }));
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold">
        Water Tracker
      </h2>

      <h1 className="mt-6 text-5xl font-bold text-sky-400">
        {appData.today.water} L
      </h1>

      <p className="mt-2 text-slate-400">
        Goal: {appData.goals.water} L
      </p>

      <div className="mt-8 flex gap-4">

        <Button
          variant="secondary"
          onClick={removeWater}
        >
          −250 ml
        </Button>

        <Button
          onClick={addWater}
        >
          +250 ml
        </Button>

      </div>

    </div>
  );
}