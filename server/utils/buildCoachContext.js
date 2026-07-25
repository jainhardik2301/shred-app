export function buildCoachContext(data = {}) {

  const profile =
    data.onboardingProfile || {};

  const assessment =
    data.assessment || {};

  const nutrition =
    data.nutritionPlan || {};

  const workoutPlan =
    data.activeWorkoutPlan || {};

  const todayWorkout =
    data.todayWorkout || {};

  const progress =
    data.todayProgress || {};

  const workoutCompletedToday =
    data.workoutCompletedToday || false;

  const currentDateTime =
    data.currentDateTime ||
    new Date().toISOString();

  return {

  currentTime: currentDateTime,

  user: {

    name: profile.name ?? null,

    age: profile.age ?? null,

    gender: profile.gender ?? null,

    height: profile.height ?? null,

    currentWeight:
      profile.weight ?? null,

    targetWeight:
      profile.targetWeight ?? null,

    primaryGoal:
      profile.primaryGoal ?? null,

    diet:
      profile.dietPreference ?? null,

    occupation:
      profile.occupation ?? null,

    trainingDays:
      profile.workoutDays ?? null,

    equipment:
      profile.equipment ?? null,

    injuries:
      profile.injuries ?? [],

    sleep:
      profile.sleep ?? null,

    stress:
      profile.stress ?? null,

    biggestChallenge:
      profile.biggestChallenge ?? null,
  },

  assessment: {

    summary:
      assessment.summary ?? null,

    opportunities:
      assessment.biggestOpportunities ?? [],

    observations:
      assessment.keyObservations ?? [],
  },

  today: {

    workoutCompleted:
      workoutCompletedToday,

    scheduledWorkout:
      todayWorkout.title ?? null,

    workoutType:
      todayWorkout.type ?? null,

    calories: {

      consumed:
        progress.caloriesConsumed ?? 0,

      target:
        progress.calorieTarget ?? 0,
    },

    protein: {

      consumed:
        progress.proteinConsumed ?? 0,

      target:
        progress.proteinTarget ?? 0,
    },

    water: {

      consumed:
        progress.waterConsumed ?? 0,

      target:
        progress.waterTarget ?? 0,
    },

    steps: {

      current:
        progress.steps ?? 0,

      target:
        progress.stepTarget ?? 0,
    },
  },

  nutritionTargets:
    nutrition?.dailyTargets ?? {},

  workoutPlan: {

    name:
      workoutPlan.title ?? null,

    days:
      workoutPlan.days?.length ?? 0,
  
    },
  };
}