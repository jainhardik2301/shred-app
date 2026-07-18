import { useApp } from "../../contexts/AppContext";
import {
  formatWeight,
  kgToLb,
} from "../../utils/unitConversions";

export default function WeightProgressCard() {
  const { appData } = useApp();

  const weightUnit =
    appData?.preferences?.weightUnit || "kg";

  const history = Array.isArray(
    appData?.history?.weight
  )
    ? appData.history.weight
    : [];

  const profileWeight =
    Number(appData?.profile?.weight) || 0;

  const current =
    Number(
      history[history.length - 1]?.value
    ) || profileWeight;

  const start =
    Number(history[0]?.value) ||
    profileWeight;

  const change =
    current && start
      ? current - start
      : 0;

  const displayChange =
    weightUnit === "lb"
      ? kgToLb(change)
      : change;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        Weight Progress
      </h2>

      <div className="space-y-5">
        <Row
          label="Starting Weight"
          value={
            start
              ? formatWeight(
                  start,
                  weightUnit
                )
              : "—"
          }
        />

        <Row
          label="Current Weight"
          value={
            current
              ? formatWeight(
                  current,
                  weightUnit
                )
              : "—"
          }
        />

        <Row
          label="Net Change"
          value={
            start && current
              ? `${displayChange.toFixed(
                  1
                )} ${weightUnit}`
              : "—"
          }
          color={
            change < 0
              ? "text-emerald-400"
              : change > 0
              ? "text-orange-400"
              : "text-white"
          }
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  color = "text-white",
}) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">
        {label}
      </span>

      <span
        className={`font-semibold ${color}`}
      >
        {value}
      </span>
    </div>
  );
}