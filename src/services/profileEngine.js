import {
  calculateAge,
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateGoalCalories,
  calculateProtein,
  calculateWater,
  calculateStepGoal,
} from "./calorieEngine";

export function generateUserProfile(formData) {
  const age = calculateAge(formData.dob);

  const bmi = calculateBMI(
    Number(formData.weight),
    Number(formData.height)
  );

  const bmr = calculateBMR({
    gender: formData.gender,
    weight: Number(formData.weight),
    height: Number(formData.height),
    age,
  });

  const tdee = calculateTDEE(
    bmr,
    formData.activity
  );

  const calories = calculateGoalCalories(
    tdee,
    formData.goal
  );

  const protein = calculateProtein(
    Number(formData.weight),
    formData.goal
  );

  const water = calculateWater(
    Number(formData.weight)
  );

  const steps = calculateStepGoal(
    formData.goal
  );

  return {
    profile: {
      name: formData.name,
      age,
      gender: formData.gender,
      height: Number(formData.height),
      weight: Number(formData.weight),
      bmi,
      bmr: Math.round(bmr),
      tdee,
      activity: formData.activity,
      occupation: formData.occupation,
      foodPreference: formData.foodPreference,
      preferredUnits: formData.preferredUnits,
      currentWeight: Number(formData.weight),
    },

    goals: {
      goal: formData.goal,
      targetWeight: Number(formData.targetWeight),
      targetDate: formData.targetDate,
      calories,
      protein,
      water,
      steps,
    },

    today: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      water: 0,
      steps: 0,
      sleep: 0,
    },

    history: {
      weight: [
        {
          date: new Date().toISOString(),
          value: Number(formData.weight),
        },
      ],
    },

    meals: [],
  };
}