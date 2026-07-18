import { useApp } from "../../contexts/AppContext";

export default function ProgressInsights() {
  const { appData } = useApp();

  const bmi =
    Number(appData?.profile?.bmi) || 0;

  let insight =
    "Add your profile information to receive progress insights.";

  if (bmi > 0 && bmi < 18.5) {
    insight =
      "Focus on gaining healthy weight.";
  } else if (
    bmi >= 18.5 &&
    bmi < 25
  ) {
    insight =
      "You're in a healthy BMI range.";
  } else if (
    bmi >= 25 &&
    bmi < 30
  ) {
    insight =
      "Aim for gradual fat loss.";
  } else if (bmi >= 30) {
    insight =
      "Prioritize sustainable weight reduction.";
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-bold">
        AI Insights
      </h2>

      <p className="leading-7 text-slate-300">
        {insight}
      </p>
    </div>
  );
}