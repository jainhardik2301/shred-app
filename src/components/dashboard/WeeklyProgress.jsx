import { useApp } from "../../contexts/AppContext";
import {
  formatWeight,
  kgToLb,
} from "../../utils/unitConversions";

export default function WeeklyProgress() {
  const { appData } = useApp();

  const weightUnit =
    appData?.preferences?.weightUnit || "kg";

  const weight =
    appData.history?.weight || [];

  const current =
    weight[weight.length - 1]?.value ??
    appData.profile.weight;

  const start =
    weight[0]?.value ??
    appData.profile.weight;

  const change =
    Number(current) - Number(start);

  const displayChange =
    weightUnit === "lb"
      ? kgToLb(change)
      : change;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        Weekly Progress
      </h2>

      <div className="space-y-5">
        <Stat
          label="Starting Weight"
          value={formatWeight(
            start,
            weightUnit
          )}
        />

        <Stat
          label="Current Weight"
          value={formatWeight(
            current,
            weightUnit
          )}
        />

        <Stat
          label="Net Change"
          value={`${displayChange.toFixed(
            1
          )} ${weightUnit}`}
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

function Stat({
  label,
  value,
  color = "text-white",
}) {
  return (
    <div className="flex items-center justify-between">
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