import { useMemo, useState } from "react";
import { useApp } from "../../contexts/AppContext";

const ranges = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

export default function HealthTrends() {
  const { appData } = useApp();
  const [range, setRange] = useState(7);

  const analytics = useMemo(() => {
    const history =
      appData?.dailyHistory || {};

    const entries = Object.entries(history)
      .map(([date, data]) => ({
        date,
        ...data,
      }))
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, range);

    if (entries.length === 0) {
      return {
        daysTracked: 0,
        calories: 0,
        protein: 0,
        water: 0,
        steps: 0,
        sleep: 0,
      };
    }

    const totals = entries.reduce(
      (acc, day) => {
        acc.calories +=
          Number(
            day?.nutrition?.calories
          ) || 0;

        acc.protein +=
          Number(
            day?.nutrition?.protein
          ) || 0;

        acc.water +=
          Number(
            day?.habits?.water
          ) || 0;

        acc.steps +=
          Number(
            day?.habits?.steps
          ) || 0;

        acc.sleep +=
          Number(
            day?.habits?.sleep
          ) || 0;

        return acc;
      },
      {
        calories: 0,
        protein: 0,
        water: 0,
        steps: 0,
        sleep: 0,
      }
    );

    const days =
      entries.length;

    return {
      daysTracked: days,

      calories:
        Math.round(
          totals.calories / days
        ),

      protein:
        Number(
          (
            totals.protein / days
          ).toFixed(1)
        ),

      water:
        Number(
          (
            totals.water / days
          ).toFixed(2)
        ),

      steps:
        Math.round(
          totals.steps / days
        ),

      sleep:
        Number(
          (
            totals.sleep / days
          ).toFixed(1)
        ),
    };
  }, [
    appData?.dailyHistory,
    range,
  ]);

  const metrics = [
    {
      label: "Avg Calories",
      value: analytics.calories,
      unit: "kcal",
    },
    {
      label: "Avg Protein",
      value: analytics.protein,
      unit: "g",
    },
    {
      label: "Avg Water",
      value: analytics.water,
      unit: "L",
    },
    {
      label: "Avg Steps",
      value:
        analytics.steps.toLocaleString(),
      unit: "",
    },
    {
      label: "Avg Sleep",
      value: analytics.sleep,
      unit: "hrs",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-xl font-bold text-white">
            Health Trends
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Your historical health averages
            based on completed days.
          </p>
        </div>

        <div className="flex gap-2">
          {ranges.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setRange(item.value)
              }
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                range === item.value
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {analytics.daysTracked ===
      0 ? (
        <div className="rounded-xl bg-slate-800/60 p-8 text-center">
          <p className="font-medium text-slate-300">
            No historical data yet
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Your daily health data will
            appear here as you continue
            tracking with SHRED.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-5 text-sm text-slate-400">
            Based on{" "}
            <span className="font-semibold text-emerald-400">
              {analytics.daysTracked}
            </span>{" "}
            completed{" "}
            {analytics.daysTracked === 1
              ? "day"
              : "days"}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl bg-slate-800 p-5"
              >
                <p className="text-sm text-slate-400">
                  {metric.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {metric.value}{" "}
                  <span className="text-sm font-medium text-slate-400">
                    {metric.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}