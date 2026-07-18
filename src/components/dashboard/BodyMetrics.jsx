import { useApp } from "../../contexts/AppContext";
import { formatHeight } from "../../utils/unitConversions";

export default function BodyMetrics() {
  const { appData } = useApp();

  const profile =
    appData?.profile || {};

  const heightUnit =
    appData?.preferences?.heightUnit || "cm";

  function display(value, unit = "") {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "—";
    }

    return unit
      ? `${value} ${unit}`
      : value;
  }

  function displayHeight() {
    if (
      profile.height === undefined ||
      profile.height === null ||
      profile.height === ""
    ) {
      return "—";
    }

    return formatHeight(
      profile.height,
      heightUnit
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        Body Metrics
      </h2>

      <div className="space-y-4">
        <Metric
          label="BMI"
          value={display(profile.bmi)}
        />

        <Metric
          label="BMR"
          value={display(
            profile.bmr,
            "kcal"
          )}
        />

        <Metric
          label="TDEE"
          value={display(
            profile.tdee,
            "kcal"
          )}
        />

        <Metric
          label="Height"
          value={displayHeight()}
        />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}