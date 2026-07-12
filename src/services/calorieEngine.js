export function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const month = today.getMonth() - birthDate.getMonth();

  if (
    month < 0 ||
    (month === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function calculateBMI(weight, height) {
  const h = height / 100;
  return +(weight / (h * h)).toFixed(1);
}

export function calculateBMR({
  gender,
  weight,
  height,
  age,
}) {
  if (gender === "Male") {
    return (
      10 * weight +
      6.25 * height -
      5 * age +
      5
    );
  }

  return (
    10 * weight +
    6.25 * height -
    5 * age -
    161
  );
}

export function activityMultiplier(level) {
  switch (level) {
    case "Sedentary":
      return 1.2;

    case "Lightly Active":
      return 1.375;

    case "Moderately Active":
      return 1.55;

    case "Very Active":
      return 1.725;

    case "Athlete":
      return 1.9;

    default:
      return 1.2;
  }
}

export function calculateTDEE(bmr, activity) {
  return Math.round(
    bmr * activityMultiplier(activity)
  );
}
export function calculateGoalCalories(tdee, goal) {
  switch (goal) {
    case "Lose Fat":
      return tdee - 500;

    case "Build Muscle":
      return tdee + 300;

    case "Body Recomposition":
      return tdee - 200;

    case "Maintain Weight":
    default:
      return tdee;
  }
}
export function calculateProtein(weight, goal) {
  switch (goal) {
    case "Build Muscle":
      return Math.round(weight * 2.2);

    case "Lose Fat":
      return Math.round(weight * 2.0);

    case "Body Recomposition":
      return Math.round(weight * 2.1);

    default:
      return Math.round(weight * 1.6);
  }
}
export function calculateWater(weight) {
  return +(weight * 0.04).toFixed(1);
}
export function calculateStepGoal(goal) {
  switch (goal) {
    case "Lose Fat":
      return 10000;

    case "Body Recomposition":
      return 9000;

    case "Build Muscle":
      return 8000;

    default:
      return 7500;
  }
}
export function estimateWeeklyWeightChange(goal) {
  switch (goal) {
    case "Lose Fat":
      return -0.5;

    case "Build Muscle":
      return 0.25;

    case "Body Recomposition":
      return -0.25;

    default:
      return 0;
  }
}
