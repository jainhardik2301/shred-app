import { useApp } from "../../contexts/AppContext";

export default function TodaysWorkout() {
  const {
    appData,
    updateActiveWorkoutSet,
    toggleActiveWorkoutSet,
  } = useApp();

  // ---------------------------------
  // CURRENT DAY
  // ---------------------------------

  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

  const workoutPlans =
    appData?.workoutPlans || [];

  const activeWorkout =
    appData?.activeWorkout;

  // ---------------------------------
  // ACTIVE PLAN
  // ---------------------------------

  const activePlan =
    workoutPlans.find(
      (plan) => plan.isActive
    ) || null;

  // ---------------------------------
  // TODAY'S WORKOUT DAY
  // ---------------------------------

  const todaysPlanDay =
    activePlan?.days?.find(
      (day) =>
        String(
          day.day
        ).toLowerCase() ===
        today.toLowerCase()
    ) || null;

  const exercises =
    todaysPlanDay?.exercises || [];

    // ---------------------------------
// CHECK IF TODAY'S WORKOUT
// IS ALREADY COMPLETED
// ---------------------------------

const workoutHistory =
  appData?.workoutHistory || [];

const todaysCompletedWorkout =
  workoutHistory.find((session) => {
    if (!session.completedAt) {
      return false;
    }

    const completedDate =
      new Date(session.completedAt);

    const now =
      new Date();

    const isToday =
      completedDate.getFullYear() ===
        now.getFullYear() &&
      completedDate.getMonth() ===
        now.getMonth() &&
      completedDate.getDate() ===
        now.getDate();

    const samePlan =
      String(session.planId) ===
      String(activePlan?.id);

    const sameWorkoutDay =
      String(session.dayId) ===
      String(todaysPlanDay?.id);

    return (
      isToday &&
      samePlan &&
      sameWorkoutDay &&
      session.status === "completed"
    );
  });

  // ---------------------------------
  // ACTIVE WORKOUT PROGRESS
  // ---------------------------------

  const totalSets =
    activeWorkout?.exercises?.reduce(
      (total, exercise) =>
        total +
        (exercise.sets?.length || 0),
      0
    ) || 0;

  const completedSets =
    activeWorkout?.exercises?.reduce(
      (total, exercise) =>
        total +
        (
          exercise.sets || []
        ).filter(
          (set) =>
            set.completed
        ).length,
      0
    ) || 0;

  const progress =
    totalSets > 0
      ? Math.round(
          (
            completedSets /
            totalSets
          ) * 100
        )
      : 0;

  // ---------------------------------
  // NO ACTIVE PLAN
  // ---------------------------------

  if (!activePlan) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">

        <h2 className="text-xl font-bold sm:text-2xl">
          Today's Workout
        </h2>

        <p className="mt-6 text-slate-400">
          No active workout plan selected.
        </p>

      </div>
    );
  }

  // ---------------------------------
  // TODAY NOT FOUND
  // ---------------------------------

  if (!todaysPlanDay) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">

        <h2 className="text-xl font-bold sm:text-2xl">
          Today's Workout
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {today} • {activePlan.name}
        </p>

        <p className="mt-6 text-slate-400">
          No workout information found for today.
        </p>

      </div>
    );
  }

  // ---------------------------------
  // REST / RECOVERY DAY
  // ---------------------------------

  if (
    todaysPlanDay.isRestDay &&
    !activeWorkout
  ) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">

        <h2 className="text-xl font-bold sm:text-2xl">
          Today's Workout
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          {today} • {activePlan.name}
        </p>

        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-6 text-center">

          <p className="text-lg font-semibold text-white">
            Recovery Day
          </p>

          <p className="mt-2 text-sm text-slate-400">
            No workout scheduled for today.
            Focus on rest and recovery.
          </p>

        </div>

      </div>
    );
  }

  // ---------------------------------
// TODAY'S WORKOUT COMPLETED
// ---------------------------------

if (
  todaysCompletedWorkout &&
  !activeWorkout
) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">

      <h2 className="text-xl font-bold sm:text-2xl">
        Today's Workout
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        {today} • {todaysPlanDay.name}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {activePlan.name}
      </p>

      <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">

        <div className="text-3xl">
          ✓
        </div>

        <h3 className="mt-3 text-lg font-bold text-emerald-400">
          Workout Completed
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          You've completed today's scheduled workout.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-6 text-sm">

          <div>
            <p className="text-slate-500">
              Sets Completed
            </p>

            <p className="mt-1 font-semibold text-white">
              {todaysCompletedWorkout.completedSets || 0}
              /
              {todaysCompletedWorkout.totalSets || 0}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Calories
            </p>

            <p className="mt-1 font-semibold text-orange-400">
              {todaysCompletedWorkout.calories || 0} kcal
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              Completion
            </p>

            <p className="mt-1 font-semibold text-emerald-400">
              {todaysCompletedWorkout.completionPercentage || 0}%
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

  // ---------------------------------
  // MAIN UI
  // ---------------------------------

  return (
    <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h2 className="text-xl font-bold sm:text-2xl">
          Today's Workout
        </h2>

        <p className="mt-2 text-sm text-slate-400 sm:text-base">
          {today} •{" "}
          {todaysPlanDay.name}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {activePlan.name}
        </p>

      </div>

      {/* ACTIVE WORKOUT PROGRESS */}

      {activeWorkout && (

        <div className="mb-6">

          <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">

            <span className="text-slate-400">
              Workout Progress
            </span>

            <span className="font-semibold text-emerald-400">
              {completedSets}/
              {totalSets} sets •{" "}
              {progress}%
            </span>

          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full bg-emerald-500 transition-all"
              style={{
                width:
                  `${progress}%`,
              }}
            />

          </div>

        </div>

      )}

      {/* BEFORE WORKOUT STARTS */}

      {!activeWorkout ? (

        <>

          <div className="space-y-3">

            {exercises.map(
              (exercise) => (

                <div
                  key={
                    exercise.id
                  }
                  className="rounded-xl border border-slate-800 bg-slate-800 p-4"
                >

                  <h3 className="font-semibold">
                    {exercise.name}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">

                    <span className="font-semibold text-emerald-400">
                      {exercise.sets} ×{" "}
                      {exercise.reps}
                    </span>

                    {exercise.equipment && (

                      <span className="text-slate-400">
                        {
                          exercise.equipment
                        }
                      </span>

                    )}

                    {exercise.primaryMuscle && (

                      <span className="text-slate-400">
                        {
                          exercise.primaryMuscle
                        }
                      </span>

                    )}

                  </div>

                  {exercise.restSeconds >
                    0 && (

                    <p className="mt-2 text-xs text-slate-500">
                      Rest:{" "}
                      {
                        exercise.restSeconds
                      }{" "}
                      sec
                    </p>

                  )}

                </div>

              )
            )}

          </div>

          
        </>

      ) : (

        /* ACTIVE WORKOUT */

        <div className="space-y-5 sm:space-y-6">

          {(
            activeWorkout.exercises ||
            []
          ).map(
            (
              exercise,
              exerciseIndex
            ) => (

              <div
                key={`${exercise.id}-${exerciseIndex}`}
                className="min-w-0 rounded-xl border border-slate-800 bg-slate-800 p-4 sm:p-5"
              >

                <div className="mb-4">

                  <h3 className="text-lg font-semibold">
                    {exercise.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {exercise.equipment ||
                      "Exercise"}
                  </p>

                </div>

                <div className="space-y-3">

                  {(
                    exercise.sets ||
                    []
                  ).map(
                    (
                      set,
                      setIndex
                    ) => (

                      <div
                        key={
                          setIndex
                        }
                        className={`rounded-lg border p-3 ${
                          set.completed
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-slate-700 bg-slate-900"
                        }`}
                      >

                        <div className="mb-3 flex items-center justify-between sm:hidden">

                          <span className="text-sm font-medium text-slate-300">
                            Set{" "}
                            {setIndex +
                              1}
                          </span>

                          <label className="flex items-center gap-2 text-sm text-slate-400">

                            Done

                            <input
                              type="checkbox"
                              checked={
                                set.completed
                              }
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
                            Set{" "}
                            {setIndex +
                              1}
                          </span>

                          <input
                            type="number"
                            min="0"
                            placeholder="Weight kg"
                            value={
                              set.weight
                            }
                            onChange={(
                              e
                            ) =>
                              updateActiveWorkoutSet(
                                exerciseIndex,
                                setIndex,
                                "weight",
                                e.target
                                  .value
                              )
                            }
                            className="min-w-0 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
                          />

                          <input
                            type="text"
                            placeholder="Reps"
                            value={
                              set.reps
                            }
                            onChange={(
                              e
                            ) =>
                              updateActiveWorkoutSet(
                                exerciseIndex,
                                setIndex,
                                "reps",
                                e.target
                                  .value
                              )
                            }
                            className="min-w-0 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
                          />

                          <input
                            type="checkbox"
                            checked={
                              set.completed
                            }
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