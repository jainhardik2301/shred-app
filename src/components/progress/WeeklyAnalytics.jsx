import { useApp } from "../../contexts/AppContext";

export default function WeeklyAnalytics() {
  const { appData } = useApp();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-bold">
        Weekly Analytics
      </h2>

      <div className="space-y-5">

        <Stat
          title="Calories"
          value={`${appData.today.calories} kcal`}
        />

        <Stat
          title="Protein"
          value={`${appData.today.protein} g`}
        />

        <Stat
          title="Water"
          value={`${appData.today.water} L`}
        />

        <Stat
          title="Steps"
          value={appData.today.steps}
        />

      </div>

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="flex justify-between">

      <span className="text-slate-400">
        {title}
      </span>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  );
}