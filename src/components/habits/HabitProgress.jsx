import { useApp } from "../../contexts/AppContext";

export default function HabitProgress() {
  const { appData } = useApp();

  const water = Number(appData?.today?.water) || 0;
  const steps = Number(appData?.today?.steps) || 0;
  const sleep = Number(appData?.today?.sleep) || 0;

  const waterGoal = Number(appData?.goals?.water) || 3.4;
  const stepsGoal = Number(appData?.goals?.steps) || 10000;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">
        Today's Progress
      </h2>

      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-slate-300">
            💧 Water
          </span>

          <span className="font-semibold">
            {water} / {waterGoal} L
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-300">
            🚶 Steps
          </span>

          <span className="font-semibold">
            {steps.toLocaleString()} / {stepsGoal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-300">
            😴 Sleep
          </span>

          <span className="font-semibold">
            {sleep} hrs
          </span>
        </div>
      </div>
    </div>
  );
}