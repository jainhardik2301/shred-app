import { useApp } from "../../contexts/AppContext";

const DAYS = [
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
    setActiveWorkoutPlan,
  } = useApp();

  const workoutPlans =
    appData?.workoutPlans || [];

  // Find currently active plan
  const activePlan =
    workoutPlans.find(
      (plan) => plan.isActive
    ) || null;

  function handleActivePlanChange(
    event
  ) {
    const planId =
      event.target.value;

    if (!planId) {
      return;
    }

    setActiveWorkoutPlan(planId);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Weekly Schedule
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Your weekly schedule is based on your active workout plan.
          </p>

        </div>

        {/* ACTIVE PLAN SELECTOR */}

        {workoutPlans.length > 0 && (

          <div className="min-w-[260px]">

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Active Plan
            </label>

            <select
              value={
                activePlan?.id || ""
              }
              onChange={
                handleActivePlanChange
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
            >

              <option
                value=""
                disabled
              >
                Select active plan
              </option>

              {workoutPlans.map(
                (plan) => (

                  <option
                    key={plan.id}
                    value={plan.id}
                  >
                    {plan.name ||
                      "Unnamed Plan"}
                  </option>

                )
              )}

            </select>

          </div>

        )}

      </div>

      {/* NO PLANS */}

      {workoutPlans.length === 0 && (

        <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">

          <p className="text-slate-400">
            No workout plans are currently available.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Complete onboarding or create a new workout plan.
          </p>

        </div>

      )}

      {/* PLANS EXIST BUT NONE ACTIVE */}

      {workoutPlans.length > 0 &&
        !activePlan && (

        <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 p-6 text-center">

          <p className="font-semibold text-amber-400">
            No active workout plan selected
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Select a workout plan above to activate your weekly schedule.
          </p>

        </div>

      )}

      {/* ACTIVE WEEKLY PLAN */}

      {activePlan && (

        <div className="space-y-4">

          {DAYS.map((dayName) => {

            const day =
              (
                activePlan.days || []
              ).find(
                (item) =>
                  String(
                    item.day
                  ).toLowerCase() ===
                  dayName.toLowerCase()
              );

            const isRestDay =
              !day ||
              day.isRestDay;

            return (

              <div
                key={dayName}
                className="flex flex-col gap-4 rounded-xl bg-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"
              >

                {/* DAY */}

                <div>

                  <span className="font-semibold text-white">
                    {dayName}
                  </span>

                  {!isRestDay &&
                    day?.name && (

                    <p className="mt-1 text-sm text-emerald-400">
                      {day.name}
                    </p>

                  )}

                </div>

                {/* WORKOUT DETAILS */}

                {isRestDay ? (

                  <span className="w-fit rounded-full bg-slate-700 px-3 py-1 text-sm text-slate-400">
                    Rest / Recovery
                  </span>

                ) : (

                  <div className="text-right">

                    <span className="text-sm font-semibold text-emerald-400">
                      {
                        day.exercises
                          ?.length || 0
                      }{" "}
                      Exercises
                    </span>

                  </div>

                )}

              </div>

            );
          })}

        </div>

      )}

    </div>
  );
}