import { useApp } from "../../../contexts/AppContext";

export default function StepsChart() {
  const { appData } = useApp();

  const history = Object.entries(
    appData?.dailyHistory || {}
  )
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7);

  const goal =
    Number(appData?.goals?.steps) ||
    Number(appData?.goals?.stepGoal) ||
    10000;

  if (!history.length) {
    return (
      <EmptyChart title="Steps" />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-bold">
        Steps — Last 7 Days
      </h3>

      <div className="mt-8 flex h-48 items-end gap-3">
        {history.map(([date, day]) => {
          const value =
            Number(
              day?.habits?.steps ??
                day?.steps
            ) || 0;

          const percentage = Math.min(
            (value / goal) * 100,
            100
          );

          return (
            <div
              key={date}
              className="flex flex-1 flex-col items-center"
            >
              <span className="mb-2 text-xs text-slate-400">
                {value}
              </span>

              <div className="flex h-32 w-full items-end rounded-lg bg-slate-800">
                <div
                  className="w-full rounded-lg bg-violet-500 transition-all"
                  style={{
                    height: `${percentage}%`,
                  }}
                />
              </div>

              <span className="mt-2 text-xs text-slate-500">
                {formatDate(date)}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Goal: {goal.toLocaleString()} steps
      </p>
    </div>
  );
}

function EmptyChart({ title }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-bold">
        {title} — Last 7 Days
      </h3>

      <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-500">
        Historical data will appear here.
      </div>
    </div>
  );
}

function formatDate(date) {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString("en-US", {
    weekday: "short",
  });
}