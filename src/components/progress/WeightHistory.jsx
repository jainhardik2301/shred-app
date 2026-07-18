import { useApp } from "../../contexts/AppContext";
import {
  formatWeight,
} from "../../utils/unitConversions";

export default function WeightHistory() {
  const { appData } = useApp();

  const weightUnit =
    appData?.preferences?.weightUnit || "kg";

  const history =
    appData?.history?.weight || [];

  const recentEntries =
    [...history]
      .reverse()
      .slice(0, 10);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold">
        Weight History
      </h2>

      <p className="mt-2 text-slate-400">
        Your latest recorded weight updates.
      </p>

      {recentEntries.length === 0 ? (

        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center">

          <p className="text-slate-400">
            No weight history yet.
          </p>

        </div>

      ) : (

        <div className="mt-6 space-y-3">

          {recentEntries.map(
            (entry, index) => (

              <div
                key={`${entry.date}-${index}`}
                className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
              >

                <span className="text-slate-400">
                  {new Date(
                    entry.date
                  ).toLocaleDateString()}
                </span>

                <span className="font-semibold">
                  {formatWeight(
                    entry.value,
                    weightUnit
                  )}
                </span>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}