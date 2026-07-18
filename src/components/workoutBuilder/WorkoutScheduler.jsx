import { useApp } from "../../contexts/AppContext";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WorkoutScheduler() {
  const {
    appData,
    assignWorkoutToDay,
  } = useApp();

  // Safe fallbacks
  const workoutPlans = appData?.workoutPlans || [];
  const activeSchedule = appData?.activeSchedule || {};

  function handleScheduleChange(day, value) {
    if (!assignWorkoutToDay) {
      console.error(
        "assignWorkoutToDay function is not available in AppContext"
      );
      return;
    }

    if (value === "") {
      assignWorkoutToDay(day, null);
      return;
    }

    assignWorkoutToDay(
      day,
      Number(value)
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-8 text-2xl font-bold">
        Weekly Schedule
      </h2>

      <div className="space-y-4">

        {days.map((day) => {

          const assignedPlanId =
            activeSchedule[day] ?? "";

          return (

            <div
              key={day}
              className="flex items-center justify-between gap-4 rounded-xl bg-slate-800 p-4"
            >

              <span className="font-semibold">
                {day}
              </span>

              <select
                value={assignedPlanId}
                onChange={(e) =>
                  handleScheduleChange(
                    day,
                    e.target.value
                  )
                }
                className="min-w-[220px] rounded-lg border border-slate-700 bg-slate-900 px-4 py-2"
              >

                <option value="">
                  No Workout / Rest Day
                </option>

                {workoutPlans.map((plan) => (

                  <option
                    key={plan.id}
                    value={plan.id}
                  >
                    {plan.name || "Unnamed Workout"}
                  </option>

                ))}

              </select>

            </div>

          );

        })}

      </div>

      {workoutPlans.length === 0 && (

        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-5 text-center">

          <p className="text-slate-400">
            No workout plans are currently available.
          </p>

        </div>

      )}

    </div>
  );
}