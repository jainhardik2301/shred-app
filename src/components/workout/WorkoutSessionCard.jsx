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

  const activeWorkout = appData?.activeWorkout;

  useEffect(() => {
    if (!activeWorkout?.running) {
      return;
    }

    const timer = setInterval(() => {
      incrementWorkoutTimer();
    }, 1000);

    return () => clearInterval(timer);
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

  return (
    <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <h2 className="text-xl font-bold sm:text-2xl">
        Workout Session
      </h2>

      <div className="mt-6 sm:mt-8">
        <p className="text-sm text-slate-400 sm:text-base">
          Elapsed Time
        </p>

        <h1 className="mt-2 break-words text-4xl font-bold tracking-tight text-emerald-400 sm:text-5xl xl:text-4xl 2xl:text-5xl">
          {String(hours).padStart(2, "0")}:
          {String(mins).padStart(2, "0")}:
          {String(secs).padStart(2, "0")}
        </h1>
      </div>

      <div className="mt-6 sm:mt-8">
        <p className="text-sm text-slate-400 sm:text-base">
          Estimated Calories
        </p>

        <h2 className="mt-2 text-2xl font-bold text-orange-400 sm:text-3xl">
          {calories} kcal
        </h2>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:flex sm:flex-wrap">
        {!activeWorkout && (
          <Button
            className="w-full sm:w-auto"
            onClick={startWorkoutSession}
          >
            ▶ Start Workout
          </Button>
        )}

        {activeWorkout &&
          !activeWorkout.running && (
            <Button
              className="w-full sm:w-auto"
              onClick={resumeWorkoutSession}
            >
              ▶ Resume
            </Button>
          )}

        {activeWorkout?.running && (
          <Button
            className="w-full sm:w-auto"
            variant="secondary"
            onClick={pauseWorkoutSession}
          >
            ⏸ Pause
          </Button>
        )}

        {activeWorkout && (
          <Button
            className="w-full sm:w-auto"
            onClick={finishWorkoutSession}
          >
            ✓ Finish
          </Button>
        )}

        {activeWorkout && (
          <Button
            className="w-full sm:w-auto"
            variant="danger"
            onClick={resetWorkoutSession}
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}