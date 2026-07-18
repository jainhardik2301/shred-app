import { useApp } from "../../contexts/AppContext";
import {
  formatWeight,
} from "../../utils/unitConversions";

export default function GoalProgressCard() {
  const { appData } = useApp();

  const weightUnit =
    appData?.preferences?.weightUnit || "kg";

  const currentWeight =
    Number(appData?.profile?.weight) || 0;

  const targetWeight =
    Number(appData?.goals?.targetWeight) || 0;

  const hasData =
    currentWeight > 0 &&
    targetWeight > 0;

  const remaining =
    hasData
      ? Math.abs(
          currentWeight -
            targetWeight
        )
      : 0;

  const goalReached =
    hasData &&
    currentWeight <=
      targetWeight;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold">
        Weight Goal
      </h2>

      {hasData ? (
        <>
          <div className="mt-6 flex items-end justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Current
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-400">
                {formatWeight(
                  currentWeight,
                  weightUnit
                )}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-400">
                Target
              </p>

              <p className="mt-1 text-2xl font-bold">
                {formatWeight(
                  targetWeight,
                  weightUnit
                )}
              </p>
            </div>

          </div>

          <div className="mt-6 rounded-xl bg-slate-800 p-4">

            {goalReached ? (
              <p className="font-semibold text-emerald-400">
                Goal reached
              </p>
            ) : (
              <>
                <p className="text-sm text-slate-400">
                  Remaining
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {formatWeight(
                    remaining,
                    weightUnit
                  )}
                </p>
              </>
            )}

          </div>
        </>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-6 text-center">

          <p className="text-slate-400">
            Add your current and target weight to track your goal.
          </p>

        </div>
      )}

    </div>
  );
}