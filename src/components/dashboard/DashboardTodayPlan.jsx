import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";

export default function DashboardTodayPlan() {
  const { appData } = useApp();
  const navigate = useNavigate();

  const todayName = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    }
  );

  // -----------------------------------------
  // TODAY'S WORKOUT
  // -----------------------------------------

  const activeWorkoutPlan =
    (appData?.workoutPlans || []).find(
      (plan) => plan.isActive
    );

  const todayWorkout =
    activeWorkoutPlan?.days?.find(
      (day) =>
        day.day?.toLowerCase() ===
        todayName.toLowerCase()
    );

    // -----------------------------------------
// WORKOUT STATUS
// -----------------------------------------

const activeWorkout =
  appData?.activeWorkout || null;

const workoutHistory =
  appData?.workoutHistory || [];

const todaysCompletedWorkout =
  workoutHistory.find((session) => {
    if (!session.completedAt) {
      return false;
    }

    const completedDate =
      new Date(session.completedAt);

    const now = new Date();

    const isToday =
      completedDate.getFullYear() ===
        now.getFullYear() &&
      completedDate.getMonth() ===
        now.getMonth() &&
      completedDate.getDate() ===
        now.getDate();

    return (
      isToday &&
      session.status === "completed"
    );
  });

  // -----------------------------------------
  // TODAY'S NUTRITION PLAN
  // -----------------------------------------

  const nutritionPlan =
    appData?.nutritionPlan;

  const todayNutrition =
    nutritionPlan?.weeklyMealPlan?.find(
      (day) =>
        day.day?.toLowerCase() ===
        todayName.toLowerCase()
    );

    // -----------------------------------------
// TODAY'S ACTUAL NUTRITION PROGRESS
// -----------------------------------------

const loggedMeals =
  appData?.meals || [];

const consumedCalories =
  loggedMeals.reduce(
    (total, meal) =>
      total + Number(meal.calories || 0),
    0
  );

const consumedProtein =
  loggedMeals.reduce(
    (total, meal) =>
      total + Number(meal.protein || 0),
    0
  );

const consumedWater =
  Number(appData?.today?.water || 0);

const calorieTarget =
  Number(
    nutritionPlan?.dailyTargets?.calories ||
    appData?.goals?.calories ||
    0
  );

const proteinTarget =
  Number(
    nutritionPlan?.dailyTargets?.protein ||
    appData?.goals?.protein ||
    0
  );

const waterTarget =
  Number(
    nutritionPlan?.dailyTargets?.water ||
    appData?.goals?.water ||
    0
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* TODAY'S WORKOUT */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex items-start justify-between gap-4">

          <div>
            <p className="text-sm font-semibold text-emerald-400">
              TODAY'S WORKOUT
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {todayWorkout
                ? todayWorkout.name
                : "No Workout Scheduled"}
            </h2>
          </div>

          {activeWorkoutPlan && (
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400">
              ✨ AI Plan
            </span>
          )}

        </div>
        
        {!activeWorkoutPlan ? (

          <p className="mt-4 text-slate-400">
            You don't have an active workout plan yet.
          </p>

        ) : todayWorkout?.isRestDay ? (

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
            <p className="font-semibold text-slate-300">
              Recovery Day
            </p>

            <p className="mt-2 text-sm text-slate-500">
              No structured workout today. Focus on recovery,
              mobility and light movement.
            </p>
          </div>

        ) : todayWorkout ? (

          <>
            <div className="mt-5 space-y-3">

              {todayWorkout.exercises
                ?.slice(0, 4)
                .map((exercise, index) => (

                  <div
                    key={exercise.id || index}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                  >
                    <div>
                      <p className="font-semibold">
                        {exercise.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {exercise.sets} sets × {exercise.reps}
                      </p>
                    </div>

                    <span className="text-xs text-slate-500">
                      {exercise.primaryMuscle}
                    </span>

                  </div>

                ))}

            </div>

            {todayWorkout.exercises?.length > 4 && (
              <p className="mt-3 text-sm text-slate-500">
                + {todayWorkout.exercises.length - 4} more exercises
              </p>
            )}

            {todaysCompletedWorkout ? (

  <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">

    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-lg text-emerald-400">
        ✓
      </div>

      <div>
        <p className="font-bold text-emerald-400">
          Workout Completed
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {todaysCompletedWorkout.completedSets || 0}
          /
          {todaysCompletedWorkout.totalSets || 0}
          {" "}sets completed
          {" • "}
          {todaysCompletedWorkout.calories || 0}
          {" "}kcal
        </p>
      </div>

    </div>

  </div>

) : (

  <button
    type="button"
    onClick={() => navigate("/workout")}
    className="mt-5 w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
  >
    {activeWorkout
      ? "Continue Workout"
      : "View Today's Workout"}
  </button>

)}
          </>

        ) : (

          <p className="mt-4 text-slate-400">
            No workout is scheduled for {todayName}.
          </p>

        )}

      </div>


      {/* TODAY'S NUTRITION */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex items-start justify-between gap-4">

          <div>
            <p className="text-sm font-semibold text-violet-400">
              TODAY'S NUTRITION PLAN
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {todayName}
            </h2>
          </div>

          {nutritionPlan && (
            <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400">
              ✨ AI Plan
            </span>
          )}

        </div>

        {nutritionPlan && (
  <div className="mt-5 grid grid-cols-3 gap-2">

    <NutritionProgress
      label="Calories"
      current={consumedCalories}
      target={calorieTarget}
      unit="kcal"
    />

    <NutritionProgress
      label="Protein"
      current={consumedProtein}
      target={proteinTarget}
      unit="g"
    />

    <NutritionProgress
      label="Water"
      current={consumedWater}
      target={waterTarget}
      unit="L"
    />

  </div>
)}

        {!nutritionPlan ? (

          <p className="mt-4 text-slate-400">
            You don't have a personalized nutrition plan yet.
          </p>

        ) : todayNutrition?.meals?.length > 0 ? (

          <>
            <div className="mt-5 space-y-3">

              {todayNutrition.meals.map(
                (meal, index) => (

                  <div
                    key={`${meal.meal}-${index}`}
                    className="rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                  >
                    <p className="font-semibold text-emerald-400">
                      {meal.meal}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                      {meal.foods?.join(" • ")}
                    </p>

                  </div>

                )
              )}

            </div>

            <button
              type="button"
              onClick={() => navigate("/nutrition")}
              className="mt-5 w-full rounded-xl border border-violet-500/40 bg-violet-500/10 px-5 py-3 font-semibold text-violet-300 transition hover:bg-violet-500/20"
            >
              View Full Nutrition Plan
            </button>
          </>

        ) : (

          <p className="mt-4 text-slate-400">
            No meals are planned for {todayName}.
          </p>

        )}

      </div>

    </div>
  );
}
function NutritionProgress({
  label,
  current,
  target,
  unit,
}) {
  const percentage =
    target > 0
      ? Math.min(
          Math.round(
            (Number(current) / Number(target)) *
              100
          ),
          100
        )
      : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">

      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold">
        {current}{" "}
        <span className="font-normal text-slate-500">
          / {target} {unit}
        </span>
      </p>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
}