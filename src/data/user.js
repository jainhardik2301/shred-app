const user = {
  profile: {
    name: "Hardik",
    avatar: "",
    age: 29,
    gender: "Male",
    height: 173, // cm
    currentWeight: 84,
    targetWeight: 76,
    bodyFat: 25,
    activity: "Moderate",
  },

  goals: {
    targetCalories: 2200,
    targetProtein: 140,
    targetWater: 3.5,
    targetSteps: 10000,
    targetSleep: 8,
  },

  today: {
    calories: 1540,
    protein: 98,
    water: 2.4,
    steps: 6230,
    sleep: 7.2,
  },

  trip: {
    destination: "Goa",
    countdown: 65,
  },

  streak: {
    workout: 6,
    diet: 11,
  },

  tasks: [
  {
    id: 1,
    title: "Drink 1L Water",
    completed: true,
  },
  {
    id: 2,
    title: "Eat 40g Protein",
    completed: false,
  },
  {
    id: 3,
    title: "30 Minute Walk",
    completed: true,
  },
  {
    id: 4,
    title: "Stretch for 10 Minutes",
    completed: false,
  },
],

weightHistory: [
  { day: "Mon", weight: 84.8 },
  { day: "Tue", weight: 84.6 },
  { day: "Wed", weight: 84.4 },
  { day: "Thu", weight: 84.3 },
  { day: "Fri", weight: 84.1 },
  { day: "Sat", weight: 84.0 },
  { day: "Sun", weight: 84.0 },
],
};


export default user;