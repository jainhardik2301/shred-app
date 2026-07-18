import { useApp } from "../../contexts/AppContext";
import { exerciseLibrary } from "../../data/exerciseLibrary";

export default function TodaysWorkout() {
  const {
    appData,
    updateActiveWorkoutSet,
    toggleActiveWorkoutSet,
  } = useApp();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const activeSchedule = appData?.activeSchedule || {};
  const workoutPlans = appData?.workoutPlans || [];

  const planId = activeSchedule[today];

  const workoutPlan = workoutPlans.find(
    (plan) => String(plan.id) === String(planId)
  );

  const activeWorkout = appData?.activeWorkout;

  const allExercises = Object.values(
    exerciseLibrary || {}
  ).flat();

  function getExercise(item) {
    if (typeof item === "object" && item !== null) {
      return item;
    }

    return allExercises.find(
      (exercise) =>
        String(exercise.id) === String(item)
    );
  }

  if (!workoutPlan) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
        <h2 className="text-xl font-bold sm:text-2xl">
          Today's Workout
        </h2>

        <p className="mt-6 text-slate-400">
          No workout assigned for {today}.
        </p>
      </div>
    );
  }

  const exercises = (workoutPlan.exercises || [])
    .map(getExercise)
    .filter(Boolean);

  const totalSets =
    activeWorkout?.exercises?.reduce(
      (total, exercise) =>
        total + (exercise.sets?.length || 0),
      0
    ) || 0;

  const completedSets =
    activeWorkout?.exercises?.reduce(
      (total, exercise) =>
        total +
        (exercise.sets || []).filter(
          (set) => set.completed
        ).length,
      0
    ) || 0;

  const progress =
    totalSets > 0
      ? Math.round(
          (completedSets / totalSets) * 100
        )
      : 0;

  return (
    <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold sm:text-2xl">
          Today's Workout
        </h2>

        <p className="mt-2 text-sm text-slate-400 sm:text-base">
          {today} • {workoutPlan.name}
        </p>
      </div>

      {activeWorkout && (
        <div className="mb-6">
          <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-slate-400">
              Workout Progress
            </span>

            <span className="font-semibold text-emerald-400">
              {completedSets}/{totalSets} sets • {progress}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      )}

      {!activeWorkout ? (
        <div className="space-y-3">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="rounded-xl border border-slate-800 bg-slate-800 p-4"
            >
              <h3 className="font-semibold">
                {exercise.name}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                {exercise.sets}
                {exercise.equipment
                  ? ` • ${exercise.equipment}`
                  : ""}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {(activeWorkout.exercises || []).map(
            (exercise, exerciseIndex) => (
              <div
                key={`${exercise.id}-${exerciseIndex}`}
                className="min-w-0 rounded-xl border border-slate-800 bg-slate-800 p-4 sm:p-5"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    {exercise.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {exercise.equipment || "Exercise"}
                  </p>
                </div>

                <div className="space-y-3">
                  {(exercise.sets || []).map(
                    (set, setIndex) => (
                      <div
                        key={setIndex}
                        className={`rounded-lg border p-3 ${
                          set.completed
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-slate-700 bg-slate-900"
                        }`}
                      >
                        <div className="mb-3 flex items-center justify-between sm:hidden">
                          <span className="text-sm font-medium text-slate-300">
                            Set {setIndex + 1}
                          </span>

                          <label className="flex items-center gap-2 text-sm text-slate-400">
                            Done
                            <input
                              type="checkbox"
                              checked={set.completed}
                              onChange={() =>
                                toggleActiveWorkoutSet(
                                  exerciseIndex,
                                  setIndex
                                )
                              }
                              className="h-5 w-5 accent-emerald-500"
                            />
                          </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[60px_1fr_1fr_50px] sm:items-center">
                          <span className="hidden text-sm text-slate-400 sm:block">
                            Set {setIndex + 1}
                          </span>

                          <input
                            type="number"
                            min="0"
                            placeholder="Weight kg"
                            value={set.weight}
                            onChange={(e) =>
                              updateActiveWorkoutSet(
                                exerciseIndex,
                                setIndex,
                                "weight",
                                e.target.value
                              )
                            }
                            className="min-w-0 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
                          />

                          <input
                            type="number"
                            min="0"
                            placeholder="Reps"
                            value={set.reps}
                            onChange={(e) =>
                              updateActiveWorkoutSet(
                                exerciseIndex,
                                setIndex,
                                "reps",
                                e.target.value
                              )
                            }
                            className="min-w-0 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
                          />

                          <input
                            type="checkbox"
                            checked={set.completed}
                            onChange={() =>
                              toggleActiveWorkoutSet(
                                exerciseIndex,
                                setIndex
                              )
                            }
                            className="hidden h-5 w-5 accent-emerald-500 sm:block"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}