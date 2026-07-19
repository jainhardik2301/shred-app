import { useEffect } from "react";
import Button from "../ui/Button";
import { useApp } from "../../contexts/AppContext";

export default function WorkoutSessionCard() {
  const {
    appData,
    startWorkoutSession,
    pauseWorkoutSession,
    resumeWorkoutSession,
    resetWorkoutSession,
    finishWorkoutSession,
    incrementWorkoutTimer,
  } = useApp();

  const activeWorkout =
    appData?.activeWorkout;

  const workoutPlans =
    appData?.workoutPlans || [];

  // ---------------------------------
  // FIND ACTIVE PLAN
  // ---------------------------------

  const activePlan =
    workoutPlans.find(
      (plan) => plan.isActive
    ) || null;

  // ---------------------------------
  // FIND TODAY
  // ---------------------------------

  const today =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
      }
    );

  const todaysPlanDay =
    activePlan?.days?.find(
      (day) =>
        String(
          day.day
        ).toLowerCase() ===
        today.toLowerCase()
    ) || null;

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
      completedDate.getFullYear() === now.getFullYear() &&
      completedDate.getMonth() === now.getMonth() &&
      completedDate.getDate() === now.getDate();

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

  const canStartWorkout =
  activePlan &&
  todaysPlanDay &&
  !todaysPlanDay.isRestDay &&
  (todaysPlanDay.exercises?.length || 0) > 0 &&
  !todaysCompletedWorkout;

  // ---------------------------------
  // TIMER
  // ---------------------------------

  useEffect(() => {
    if (!activeWorkout?.running) {
      return;
    }

    const timer = setInterval(() => {
      incrementWorkoutTimer();
    }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    activeWorkout?.running,
    incrementWorkoutTimer,
  ]);

  const seconds =
    activeWorkout?.seconds || 0;

  const hours =
    Math.floor(seconds / 3600);

  const mins =
    Math.floor(
      (seconds % 3600) / 60
    );

  const secs =
    seconds % 60;

  const calories =
    Math.floor(seconds * 0.18);

  // ---------------------------------
  // START
  // ---------------------------------

  function handleStartWorkout() {
    if (
      !activePlan ||
      !todaysPlanDay
    ) {
      return;
    }

    startWorkoutSession(
      activePlan.id,
      todaysPlanDay.id
    );
  }

  // ---------------------------------
  // FINISH
  // ---------------------------------

  function handleFinishWorkout() {
    const confirmed =
      window.confirm(
        "Finish this workout and save it to your workout history?"
      );

    if (!confirmed) {
      return;
    }

    finishWorkoutSession();
  }

  return (
    <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">

      <h2 className="text-xl font-bold sm:text-2xl">
        Workout Session
      </h2>

      {/* CURRENT SESSION */}

      {activeWorkout && (

        <div className="mt-3">

          <p className="font-semibold text-white">
            {activeWorkout.name}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {activeWorkout.day} •{" "}
            {activeWorkout.planName}
          </p>

        </div>

      )}

      {/* TIMER */}

      <div className="mt-6 sm:mt-8">

        <p className="text-sm text-slate-400 sm:text-base">
          Elapsed Time
        </p>

        <h1 className="mt-2 break-words text-4xl font-bold tracking-tight text-emerald-400 sm:text-5xl xl:text-4xl 2xl:text-5xl">
          {String(hours).padStart(
            2,
            "0"
          )}
          :
          {String(mins).padStart(
            2,
            "0"
          )}
          :
          {String(secs).padStart(
            2,
            "0"
          )}
        </h1>

      </div>

      {/* CALORIES */}

      <div className="mt-6 sm:mt-8">

        <p className="text-sm text-slate-400 sm:text-base">
          Estimated Calories
        </p>

        <h2 className="mt-2 text-2xl font-bold text-orange-400 sm:text-3xl">
          {calories} kcal
        </h2>

      </div>

      {/* CONTROLS */}

      <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:flex sm:flex-wrap">

        {/* START */}

        {!activeWorkout &&
          canStartWorkout && (

          <Button
            className="w-full sm:w-auto"
            onClick={
              handleStartWorkout
            }
          >
            ▶ Start Workout
          </Button>

        )}

        {/* NO WORKOUT TODAY */}

        {!activeWorkout &&
  todaysCompletedWorkout && (

  <div className="w-full rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">

    <p className="font-semibold text-emerald-400">
      ✓ Done for Today
    </p>

    <p className="mt-1 text-sm text-slate-400">
      Today's workout has been completed.
    </p>

  </div>

)}

{!activeWorkout &&
  !todaysCompletedWorkout &&
  !canStartWorkout && (

  <p className="text-sm text-slate-400">
    No workout scheduled for today.
  </p>

)}

        {/* RESUME */}

        {activeWorkout &&
          !activeWorkout.running && (

          <Button
            className="w-full sm:w-auto"
            onClick={
              resumeWorkoutSession
            }
          >
            ▶ Resume
          </Button>

        )}

        {/* PAUSE */}

        {activeWorkout?.running && (

          <Button
            className="w-full sm:w-auto"
            variant="secondary"
            onClick={
              pauseWorkoutSession
            }
          >
            ⏸ Pause
          </Button>

        )}

        {/* FINISH */}

        {activeWorkout && (

          <Button
            className="w-full sm:w-auto"
            onClick={
              handleFinishWorkout
            }
          >
            ✓ Finish
          </Button>

        )}

        {/* RESET */}

        {activeWorkout && (

          <Button
            className="w-full sm:w-auto"
            variant="danger"
            onClick={
              resetWorkoutSession
            }
          >
            Reset
          </Button>

        )}

      </div>

    </div>
  );
}