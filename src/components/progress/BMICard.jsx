import { useApp } from "../../contexts/AppContext";

export default function BMICard() {
  const { appData } = useApp();

  const weight = Number(appData?.profile?.weight) || 0;
  const heightCm = Number(appData?.profile?.height) || 0;

  const heightM = heightCm > 0 ? heightCm / 100 : 0;

  const bmi =
    weight > 0 && heightM > 0
      ? weight / (heightM * heightM)
      : 0;

  function getCategory(value) {
    if (!value) return "";

    if (value < 18.5) {
      return "Underweight";
    }

    if (value < 25) {
      return "Normal";
    }

    if (value < 30) {
      return "Overweight";
    }

    return "Obese";
  }

  const category = getCategory(bmi);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-bold">
        BMI
      </h2>

      {bmi > 0 ? (
        <>
          <h1 className="mt-6 text-5xl font-bold text-emerald-400">
            {bmi.toFixed(1)}
          </h1>

          <p className="mt-3 text-slate-400">
            {category}
          </p>
        </>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-6 text-center">
          <p className="text-slate-400">
            Add your height and weight to calculate BMI.
          </p>
        </div>
      )}
    </div>
  );
}