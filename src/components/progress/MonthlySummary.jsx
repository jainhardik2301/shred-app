import { useApp } from "../../contexts/AppContext";

export default function MonthlySummary() {
  const { appData } = useApp();

  const weightHistory =
    appData?.history?.weight || [];

  const workoutHistory =
    appData?.workoutHistory || [];

  const now = new Date();

  const currentMonth =
    now.getMonth();

  const currentYear =
    now.getFullYear();

  const monthlyWeights =
    weightHistory.filter(
      (entry) => {
        const date =
          new Date(entry.date);

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }
    );

  const monthlyWorkouts =
    workoutHistory.filter(
      (workout) => {
        const date =
          new Date(
            workout.completedAt
          );

        return (
          date.getMonth() ===
            currentMonth &&
          date.getFullYear() ===
            currentYear
        );
      }
    );

  let weightChange = 0;

  if (
    monthlyWeights.length >= 2
  ) {
    const first =
      Number(
        monthlyWeights[0].value
      );

    const last =
      Number(
        monthlyWeights[
          monthlyWeights.length - 1
        ].value
      );

    weightChange =
      last - first;
  }

  const totalMinutes =
    monthlyWorkouts.reduce(
      (total, workout) =>
        total +
        Math.floor(
          (workout.seconds || 0) /
            60
        ),
      0
    );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-bold">
        Monthly Summary
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-4">

        <div className="rounded-xl bg-slate-800 p-4">

          <p className="text-sm text-slate-400">
            Weight Change
          </p>

          <p className="mt-2 text-xl font-bold">
            {weightChange > 0
              ? "+"
              : ""}
            {weightChange.toFixed(1)} kg
          </p>

        </div>

        <div className="rounded-xl bg-slate-800 p-4">

          <p className="text-sm text-slate-400">
            Workouts
          </p>

          <p className="mt-2 text-xl font-bold">
            {monthlyWorkouts.length}
          </p>

        </div>

        <div className="rounded-xl bg-slate-800 p-4">

          <p className="text-sm text-slate-400">
            Training Time
          </p>

          <p className="mt-2 text-xl font-bold">
            {totalMinutes} min
          </p>

        </div>

      </div>

    </div>
  );
}