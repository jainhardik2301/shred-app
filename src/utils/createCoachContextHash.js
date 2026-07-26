export default function createCoachContextHash(data = {}) {
  const payload = {
    onboarding: data.onboardingProfile || {},
    assessment: data.assessment || {},
    nutrition: data.nutritionPlan || {},
    workout: data.activeWorkoutPlan || {},
    todayWorkout: data.todayWorkout || {},
    progress: data.todayProgress || {},
    completed: data.workoutCompletedToday || false,
  };

  return JSON.stringify(payload);
}