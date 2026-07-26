export default function buildCoachData({
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
}) {
  return {
    onboardingProfile: appData?.onboardingProfile || {},

    assessment: appData?.assessment || {},

    nutritionPlan,

    activeWorkoutPlan,

    todayWorkout,

    todayProgress: {
      caloriesConsumed,
      calorieTarget,

      proteinConsumed,
      proteinTarget,

      waterConsumed,
      waterTarget,

      steps,
      stepTarget,

      workoutInProgress: Boolean(activeWorkout),
    },

    workoutCompletedToday,

    coachHistory: appData?.coachHistory || [],

    coachTrends: appData?.coachTrends || {},

    currentDateTime: new Date().toISOString(),
  };
}