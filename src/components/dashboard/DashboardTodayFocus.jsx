import { useApp } from "../../contexts/AppContext";
import buildCoachData from "../../utils/buildCoachData";
import useDailyCoach from "../../hooks/useDailyCoach";

export default function DashboardTodayFocus() {
  const {
    appData,
    setAppData,
    cloudReady,
  } = useApp();

  const dailyCoach = appData?.dailyCoach || null;

  // -----------------------------------------
  // CURRENT DAY
  // -----------------------------------------

  const now = new Date();

  const todayName = now.toLocaleDateString("en-US", {
    weekday: "long",
  });

  // -----------------------------------------
  // ACTIVE WORKOUT PLAN
  // -----------------------------------------

  const activeWorkoutPlan =
    (appData?.workoutPlans || []).find(
      (plan) => plan.isActive
    ) || null;

  const todayWorkout =
    activeWorkoutPlan?.days?.find(
      (day) =>
        String(day.day).toLowerCase() ===
        todayName.toLowerCase()
    ) || null;

  const activeWorkout =
    appData?.activeWorkout || null;

  // -----------------------------------------
  // WORKOUT COMPLETED TODAY
  // -----------------------------------------

  const workoutHistory =
    appData?.workoutHistory || [];

  const workoutCompletedToday =
    workoutHistory.some((session) => {
      if (
        !session.completedAt ||
        session.status !== "completed"
      ) {
        return false;
      }

      const completedDate = new Date(
        session.completedAt
      );

      return (
        completedDate.getFullYear() ===
          now.getFullYear() &&
        completedDate.getMonth() ===
          now.getMonth() &&
        completedDate.getDate() ===
          now.getDate()
      );
    });

  // -----------------------------------------
  // NUTRITION
  // -----------------------------------------

  const meals = appData?.meals || [];

  const caloriesConsumed = meals.reduce(
    (total, meal) =>
      total + Number(meal.calories || 0),
    0
  );

  const proteinConsumed = meals.reduce(
    (total, meal) =>
      total + Number(meal.protein || 0),
    0
  );

  const nutritionPlan =
    appData?.nutritionPlan || null;

  const calorieTarget = Number(
    nutritionPlan?.dailyTargets?.calories ||
      appData?.goals?.calories ||
      0
  );

  const proteinTarget = Number(
    nutritionPlan?.dailyTargets?.protein ||
      appData?.goals?.protein ||
      0
  );

  const waterConsumed = Number(
    appData?.today?.water || 0
  );

  const waterTarget = Number(
    nutritionPlan?.dailyTargets?.water ||
      appData?.goals?.water ||
      0
  );

  const steps = Number(
    appData?.today?.steps || 0
  );

  const stepTarget = Number(
    appData?.goals?.steps ||
      appData?.assessment?.startingTargets
        ?.dailySteps ||
      0
  );

  // -----------------------------------------
  // AI COACH DATA
  // -----------------------------------------

  const coachData = buildCoachData({
    appData,
    nutritionPlan,
    activeWorkoutPlan,
    todayWorkout,
    caloriesConsumed,
    calorieTarget,
    proteinConsumed,
    proteinTarget,
    waterConsumed,
    waterTarget,
    steps,
    stepTarget,
    activeWorkout,
    workoutCompletedToday,
  });

  const {
  isGenerating,
  error,
  refresh,
} = useDailyCoach({
  coachData,
  dailyCoach,
  setAppData,
  cloudReady,
  workoutCompletedToday,
});

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
  <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 p-6">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            ✨ AI Today's Focus
          </p>

          {dailyCoach?.priority && (
            <span className="rounded-full border border-slate-700 bg-slate-950/50 px-3 py-1 text-xs font-semibold capitalize text-slate-400">
              {dailyCoach.priority}
            </span>
          )}
        </div>

        {isGenerating && !dailyCoach ? (
          <div className="mt-4">
            <h2 className="text-xl font-bold">
              Analyzing your day...
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              SHRED AI is reviewing your progress,
              workout and nutrition data.
            </p>
          </div>
        ) : dailyCoach ? (
          <>
            <h2 className="mt-3 text-2xl font-bold">
              {dailyCoach.title}
            </h2>

            <p className="mt-3 leading-7 text-slate-300">
              {dailyCoach.insight}
            </p>

            {dailyCoach.actions?.length > 0 && (
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {dailyCoach.actions.map(
                  (action, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-700/60 bg-slate-950/40 p-4"
                    >
                      <p className="text-xs font-bold text-emerald-400">
                        ACTION {index + 1}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {action}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {dailyCoach.reason && (
              <p className="mt-4 text-xs leading-5 text-slate-500">
                Why this matters: {dailyCoach.reason}
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="mt-3 text-xl font-bold">
              Today's Focus
            </h2>

            <p className="mt-2 text-slate-400">
              Your personalized daily insight is
              not available yet.
            </p>
          </>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => refresh(true)}
        disabled={isGenerating}
        className="shrink-0 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating
          ? "Analyzing..."
          : "↻ Refresh Insight"}
      </button>
    </div>
  </div>
);
}