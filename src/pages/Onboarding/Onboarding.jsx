import { useState } from "react";
import GoalCard from "../../components/onboarding/GoalCard";
import { useApp } from "../../contexts/AppContext";
import { generateUserProfile } from "../../services/profileEngine";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
  // Step 1 - About You
  name: "",
  dob: "",
  gender: "",
  height: "",
  weight: "",
  preferredUnits: "Metric",

  // Step 2 - Your Goal
  goal: "",
  targetWeight: "",
  targetDate: "",
  goalMotivations: [],

  // Step 3 - Lifestyle
  activity: "",
  occupation: "",
  workStyle: "",
  sittingHours: "",
  dailySteps: "",
  sleepHours: "",
  sleepQuality: "",
  stressLevel: "",

  // Step 4 - Nutrition
  foodPreference: "",
  eatingPattern: "",
  waterIntake: "",
  outsideMealsPerWeek: "",
  junkFoodFrequency: "",
  sugaryDrinksFrequency: "",
  alcoholFrequency: "",
  foodAllergies: "",
  proteinSources: [],

  // Step 5 - Training
  experienceLevel: "",
  workoutLocation: "",
  workoutDays: "",
  sessionDuration: "",
  trainingPreferences: [],
  equipment: [],

  // Step 6 - Challenges
challenges: [],
confidenceLevel: "",
commitmentLevel: "",
biggestObstacle: "",
successVision: "",

// Step 7 - Health & Limitations
medicalConditions: [],
injuries: "",
medicalRestrictions: "",
medications: "",
nutritionalDeficiencies: "",
additionalNotes: "",
});

const { setAppData } = useApp();
const navigate = useNavigate();
function handleChange(e) {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });  
}
function finishOnboarding() {
  const generatedData =
    generateUserProfile(formData);

  setAppData((prev) => ({
    ...prev,

    // Save generated + onboarding profile data
    profile: {
      ...prev.profile,
      ...generatedData.profile,

      name:
        formData.name ||
        generatedData.profile?.name ||
        prev.profile?.name ||
        "",

      gender:
        formData.gender ||
        generatedData.profile?.gender ||
        prev.profile?.gender ||
        "",

      height:
        Number(formData.height) ||
        generatedData.profile?.height ||
        prev.profile?.height ||
        0,

      weight:
        Number(formData.weight) ||
        generatedData.profile?.weight ||
        prev.profile?.weight ||
        0,

      // User has completed questionnaire,
      // but full onboarding finishes after plan generation
      onboardingCompleted: false,
    },

    // Save generated goals
    goals: {
      ...prev.goals,
      ...generatedData.goals,

      targetWeight:
        Number(formData.targetWeight) ||
        generatedData.goals?.targetWeight ||
        prev.goals?.targetWeight ||
        0,
    },

    today: {
      ...prev.today,
      ...(generatedData.today || {}),
    },

    history: {
      ...prev.history,
      ...(generatedData.history || {}),

      weight:
        generatedData.history?.weight ||
        prev.history?.weight ||
        [],
    },

    meals: prev.meals || [],

    // Save complete onboarding questionnaire
    onboardingProfile: {
      ...prev.onboardingProfile,
      ...formData,

      completed: true,
      completedAt: new Date().toISOString(),
    },

    // IMPORTANT:
    // New onboarding answers require a fresh AI assessment
    assessment: null,
  }));

  navigate("/assessment", {
    replace: true,
  });
}
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
           <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
  <div
    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
    style={{ width: `${(step / 7) * 100}%` }}
  />
</div>
            Let's build your fitness profile
          </h1>

          <p className="mt-2 text-slate-400">
            Step {step} of 7
          </p>
        </div>

        {step === 1 && (
  <div>
    <h2 className="mb-2 text-2xl font-semibold">
      Tell us about yourself
    </h2>

    <p className="mb-8 text-slate-400">
      We'll use this information to personalize your fitness and nutrition recommendations.
    </p>

    <div className="grid gap-5">
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Your Name
        </label>

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Date of Birth
        </label>

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Gender
        </label>

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Height (cm)
          </label>

          <input
            type="number"
            name="height"
            placeholder="e.g. 174"
            value={formData.height}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Current Weight (kg)
          </label>

          <input
            type="number"
            name="weight"
            placeholder="e.g. 84"
            value={formData.weight}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Preferred Units
        </label>

        <select
          name="preferredUnits"
          value={formData.preferredUnits}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="Metric">Metric (kg, cm)</option>
          <option value="Imperial">Imperial (lb, ft)</option>
        </select>
      </div>
    </div>
  </div>
)}

        {step === 2 && (
  <div>
    <h2 className="mb-2 text-2xl font-semibold">
      What's your primary goal?
    </h2>

    <p className="mb-8 text-slate-400">
      Your goal helps SHRED personalize your calorie targets, nutrition strategy and training plan.
    </p>

    <div className="grid gap-4 md:grid-cols-2">
      <GoalCard
        title="Lose Fat"
        description="Reduce body fat while preserving muscle."
        selected={formData.goal === "Lose Fat"}
        onClick={() =>
          setFormData({
            ...formData,
            goal: "Lose Fat",
          })
        }
      />

      <GoalCard
        title="Build Muscle"
        description="Build lean muscle and increase strength."
        selected={formData.goal === "Build Muscle"}
        onClick={() =>
          setFormData({
            ...formData,
            goal: "Build Muscle",
          })
        }
      />

      <GoalCard
        title="Body Recomposition"
        description="Lose fat while building or preserving muscle."
        selected={formData.goal === "Body Recomposition"}
        onClick={() =>
          setFormData({
            ...formData,
            goal: "Body Recomposition",
          })
        }
      />

      <GoalCard
        title="Improve Fitness"
        description="Improve stamina, movement and overall fitness."
        selected={formData.goal === "Improve Fitness"}
        onClick={() =>
          setFormData({
            ...formData,
            goal: "Improve Fitness",
          })
        }
      />

      <GoalCard
        title="Build Strength"
        description="Focus on becoming stronger and improving performance."
        selected={formData.goal === "Build Strength"}
        onClick={() =>
          setFormData({
            ...formData,
            goal: "Build Strength",
          })
        }
      />

      <GoalCard
        title="Maintain Weight"
        description="Maintain your current weight while staying active."
        selected={formData.goal === "Maintain Weight"}
        onClick={() =>
          setFormData({
            ...formData,
            goal: "Maintain Weight",
          })
        }
      />
    </div>

    <div className="mt-8 grid gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Target Weight (kg)
        </label>

        <input
          type="number"
          name="targetWeight"
          placeholder="e.g. 76"
          value={formData.targetWeight}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Target Date (Optional)
        </label>

        <input
          type="date"
          name="targetDate"
          value={formData.targetDate}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>
    </div>

    <div className="mt-8">
      <h3 className="mb-2 text-lg font-semibold">
        What matters most to you?
      </h3>

      <p className="mb-4 text-sm text-slate-400">
        Select all that apply.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          "Reduce belly fat",
          "Look better in clothes",
          "Build visible muscle",
          "Improve energy",
          "Improve health",
          "Get stronger",
          "Improve stamina",
          "Feel more confident",
        ].map((motivation) => {
          const selected =
            formData.goalMotivations.includes(motivation);

          return (
            <button
              key={motivation}
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  goalMotivations: selected
                    ? formData.goalMotivations.filter(
                        (item) => item !== motivation
                      )
                    : [...formData.goalMotivations, motivation],
                });
              }}
              className={`rounded-lg border p-3 text-left transition-all ${
                selected
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
              }`}
            >
              {motivation}
            </button>
          );
        })}
      </div>
    </div>
  </div>
)}

{step === 3 && (
  <div>
    <h2 className="mb-2 text-2xl font-semibold">
      Tell us about your lifestyle
    </h2>

    <p className="mb-8 text-slate-400">
      Your daily routine affects your calorie needs, recovery and activity recommendations.
    </p>

    <div className="grid gap-5">

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          What's your typical workday like?
        </label>

        <select
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select work activity</option>
          <option value="Desk Job">Mostly sitting / Desk job</option>
          <option value="Mostly Standing">Mostly standing</option>
          <option value="Moderately Active">Moderately active</option>
          <option value="Physical Labour">Physically demanding</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Work Style
        </label>

        <select
          name="workStyle"
          value={formData.workStyle}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select work style</option>
          <option value="Work From Home">Work From Home</option>
          <option value="Office">Office</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Not Applicable">Not Applicable</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Sitting Hours Per Day
          </label>

          <input
            type="number"
            name="sittingHours"
            placeholder="e.g. 10"
            value={formData.sittingHours}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Average Daily Steps
          </label>

          <input
            type="number"
            name="dailySteps"
            placeholder="Optional"
            value={formData.dailySteps}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Overall Activity Level
        </label>

        <select
          name="activity"
          value={formData.activity}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select activity level</option>
          <option value="Sedentary">Sedentary</option>
          <option value="Lightly Active">Lightly Active</option>
          <option value="Moderately Active">Moderately Active</option>
          <option value="Very Active">Very Active</option>
          <option value="Athlete">Athlete</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Average Sleep (Hours)
          </label>

          <input
            type="number"
            step="0.5"
            name="sleepHours"
            placeholder="e.g. 8"
            value={formData.sleepHours}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Sleep Quality
          </label>

          <select
            name="sleepQuality"
            value={formData.sleepQuality}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">Rate your sleep</option>
            <option value="Poor">Poor</option>
            <option value="Fair">Fair</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </select>
        </div>

      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Stress Level
        </label>

        <select
          name="stressLevel"
          value={formData.stressLevel}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select stress level</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
          <option value="Very High">Very High</option>
        </select>
      </div>

    </div>
  </div>
)}

{step === 4 && (
  <div>
    <h2 className="mb-2 text-2xl font-semibold">
      Tell us about your nutrition
    </h2>

    <p className="mb-8 text-slate-400">
      We'll use your eating habits and preferences to create realistic nutrition targets and recommendations.
    </p>

    <div className="grid gap-5">

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Diet Preference
        </label>

        <select
          name="foodPreference"
          value={formData.foodPreference}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select preference</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Eggetarian">Eggetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Non Vegetarian">Non Vegetarian</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Typical Eating Pattern
        </label>

        <select
          name="eatingPattern"
          value={formData.eatingPattern}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select eating pattern</option>
          <option value="2 Meals">2 meals</option>
          <option value="3 Meals">3 meals</option>
          <option value="3 Meals + Snacks">3 meals + snacks</option>
          <option value="Intermittent Fasting">Intermittent fasting</option>
          <option value="Irregular">Irregular eating schedule</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Daily Water Intake
          </label>

          <select
            name="waterIntake"
            value={formData.waterIntake}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">Select amount</option>
            <option value="Less than 1L">Less than 1 L</option>
            <option value="1-1.5L">1–1.5 L</option>
            <option value="1.5-2L">1.5–2 L</option>
            <option value="2-3L">2–3 L</option>
            <option value="3L+">3 L+</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Meals Outside Per Week
          </label>

          <input
            type="number"
            name="outsideMealsPerWeek"
            min="0"
            placeholder="e.g. 2"
            value={formData.outsideMealsPerWeek}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          />
        </div>

      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Junk / Fast Food
          </label>

          <select
            name="junkFoodFrequency"
            value={formData.junkFoodFrequency}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">Select frequency</option>
            <option value="Rarely">Rarely</option>
            <option value="1-2 times/month">1–2 times/month</option>
            <option value="1-2 times/week">1–2 times/week</option>
            <option value="3-4 times/week">3–4 times/week</option>
            <option value="Almost Daily">Almost daily</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Sugary Drinks
          </label>

          <select
            name="sugaryDrinksFrequency"
            value={formData.sugaryDrinksFrequency}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">Select frequency</option>
            <option value="Never">Never</option>
            <option value="Rarely">Rarely</option>
            <option value="1-2 times/week">1–2 times/week</option>
            <option value="3-4 times/week">3–4 times/week</option>
            <option value="Daily">Daily</option>
          </select>
        </div>

      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Alcohol Consumption
        </label>

        <select
          name="alcoholFrequency"
          value={formData.alcoholFrequency}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select frequency</option>
          <option value="Never">Never</option>
          <option value="Rarely">Rarely</option>
          <option value="Occasionally">Occasionally</option>
          <option value="Weekly">Weekly</option>
          <option value="Frequently">Frequently</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Food Allergies or Intolerances
        </label>

        <input
          type="text"
          name="foodAllergies"
          placeholder="None, or enter any allergies"
          value={formData.foodAllergies}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div className="mt-3">

        <h3 className="mb-2 text-lg font-semibold">
          Protein foods you're comfortable with
        </h3>

        <p className="mb-4 text-sm text-slate-400">
          Select all that apply. SHRED will use these when making nutrition recommendations.
        </p>

        <div className="grid gap-3 md:grid-cols-2">

          {[
            "Paneer",
            "Tofu",
            "Soya",
            "Dal & Legumes",
            "Milk",
            "Curd / Greek Yogurt",
            "Whey Protein",
            "Sprouts",
            "Eggs",
            "Chicken",
            "Fish",
          ].map((source) => {

            const selected =
              formData.proteinSources.includes(source);

            return (
              <button
                key={source}
                type="button"
                onClick={() => {

                  setFormData({
                    ...formData,

                    proteinSources: selected
                      ? formData.proteinSources.filter(
                          (item) => item !== source
                        )
                      : [...formData.proteinSources, source],

                  });

                }}
                className={`rounded-lg border p-3 text-left transition-all ${
                  selected
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
                }`}
              >
                {source}
              </button>
            );

          })}

        </div>

      </div>

    </div>
  </div>
)}

{step === 5 && (
  <div>
    <h2 className="mb-2 text-2xl font-semibold">
      Let's personalize your training
    </h2>

    <p className="mb-8 text-slate-400">
      We'll use this information to build a workout plan that fits your experience, schedule and available equipment.
    </p>

    <div className="grid gap-5">

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Training Experience
        </label>

        <select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select experience</option>
          <option value="Complete Beginner">Complete Beginner</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Where will you usually train?
        </label>

        <select
          name="workoutLocation"
          value={formData.workoutLocation}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select location</option>
          <option value="Gym">Gym</option>
          <option value="Home">Home</option>
          <option value="Both">Both</option>
          <option value="Outdoors">Outdoors</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Workout Days Per Week
          </label>

          <select
            name="workoutDays"
            value={formData.workoutDays}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">Select days</option>
            <option value="2">2 days</option>
            <option value="3">3 days</option>
            <option value="4">4 days</option>
            <option value="5">5 days</option>
            <option value="6">6 days</option>
            <option value="7">7 days</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Time Per Workout
          </label>

          <select
            name="sessionDuration"
            value={formData.sessionDuration}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <option value="">Select duration</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="75">60+ minutes</option>
          </select>
        </div>

      </div>

      <div className="mt-3">

        <h3 className="mb-2 text-lg font-semibold">
          What type of training do you enjoy?
        </h3>

        <p className="mb-4 text-sm text-slate-400">
          Select all that apply.
        </p>

        <div className="grid gap-3 md:grid-cols-2">

          {[
            "Strength Training",
            "Bodyweight Training",
            "Cardio",
            "HIIT",
            "Mobility & Flexibility",
            "Walking",
            "Running",
            "Mixed Training",
          ].map((preference) => {

            const selected =
              formData.trainingPreferences.includes(
                preference
              );

            return (
              <button
                key={preference}
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,

                    trainingPreferences:
                      selected
                        ? formData.trainingPreferences.filter(
                            (item) =>
                              item !==
                              preference
                          )
                        : [
                            ...formData.trainingPreferences,
                            preference,
                          ],
                  });
                }}
                className={`rounded-lg border p-3 text-left transition-all ${
                  selected
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
                }`}
              >
                {preference}
              </button>
            );
          })}

        </div>

      </div>

      <div className="mt-3">

        <h3 className="mb-2 text-lg font-semibold">
          Equipment Available
        </h3>

        <p className="mb-4 text-sm text-slate-400">
          Select everything you can regularly use.
        </p>

        <div className="grid gap-3 md:grid-cols-2">

          {[
            "Full Gym",
            "Dumbbells",
            "Barbell",
            "Machines",
            "Resistance Bands",
            "Bench",
            "Pull-up Bar",
            "Treadmill",
            "Exercise Bike",
            "No Equipment",
          ].map((item) => {

            const selected =
              formData.equipment.includes(
                item
              );

            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,

                    equipment: selected
                      ? formData.equipment.filter(
                          (equipment) =>
                            equipment !== item
                        )
                      : [
                          ...formData.equipment,
                          item,
                        ],
                  });
                }}
                className={`rounded-lg border p-3 text-left transition-all ${
                  selected
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
                }`}
              >
                {item}
              </button>
            );
          })}

        </div>

      </div>

    </div>
  </div>
)}
              
{step === 6 && (
  <div>
    <h2 className="mb-2 text-2xl font-semibold">
      What makes staying on track difficult?
    </h2>

    <p className="mb-8 text-slate-400">
      Select the challenges that apply to you. This helps us personalize your recommendations and make your plan more realistic.
    </p>

    <div className="grid gap-3 md:grid-cols-2">
      {[
        "Hunger",
        "Cravings",
        "Lack of Time",
        "Social Eating",
        "Low Motivation",
        "Consistency",
        "Emotional Eating",
        "Night Eating",
        "Weekend Overeating",
        "Binge Episodes",
      ].map((challenge) => {
        const selected = formData.challenges?.includes(challenge);

        return (
          <button
            key={challenge}
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                challenges: selected
                  ? formData.challenges.filter(
                      (item) => item !== challenge
                    )
                  : [...(formData.challenges || []), challenge],
              });
            }}
            className={`rounded-lg border p-3 text-left transition-all ${
              selected
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
            }`}
          >
            {challenge}
          </button>
        );
      })}
    </div>

    <div className="mt-8 grid gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm text-slate-400">
          How confident are you about reaching your goal?
        </label>

        <select
          name="confidenceLevel"
value={formData.confidenceLevel || ""}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select confidence level</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
            <option key={number} value={number}>
              {number} / 10
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          How committed are you to making changes?
        </label>

        <select
          name="commitmentLevel"
value={formData.commitmentLevel || ""}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Select commitment level</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
            <option key={number} value={number}>
              {number} / 10
            </option>
          ))}
        </select>
      </div>
    </div>

    <div className="mt-5">
      <label className="mb-2 block text-sm text-slate-400">
        What is your biggest obstacle right now?
      </label>

      <textarea
        name="biggestObstacle"
        value={formData.biggestObstacle || ""}
        onChange={handleChange}
        placeholder="For example: self-control, consistency, cravings..."
        className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
      />
    </div>

    <div className="mt-5">
      <label className="mb-2 block text-sm text-slate-400">
        What would success look like for you?
      </label>

      <textarea
        name="successVision"
        value={formData.successVision || ""}
        onChange={handleChange}
        placeholder="For example: lose weight, reduce belly fat, feel healthier, improve how clothes fit..."
        className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
      />
    </div>
  </div>
)}

{step === 7 && (
  <div>
    <h2 className="mb-2 text-2xl font-semibold">
      Health & Safety
    </h2>

    <p className="mb-8 text-slate-400">
      One final step. This information helps us avoid unsuitable recommendations and personalize your plan safely.
    </p>

    <div className="grid gap-5">

      <div>
  <label className="mb-3 block text-sm text-slate-400">
    Do you have any diagnosed medical conditions?
  </label>

  <div className="grid gap-3 md:grid-cols-2">
    {[
      "High Blood Pressure",
      "Diabetes or Prediabetes",
      "Thyroid Disorder",
      "Fatty Liver",
      "High Cholesterol",
      "Sleep Apnea",
      "Acid Reflux / GERD",
      "IBS / Digestive Issues",
      "Other",
    ].map((condition) => {
      const selected =
        formData.medicalConditions.includes(condition);

      return (
        <button
          key={condition}
          type="button"
          onClick={() => {
            setFormData({
              ...formData,
              medicalConditions: selected
                ? formData.medicalConditions.filter(
                    (item) => item !== condition
                  )
                : [...formData.medicalConditions, condition],
            });
          }}
          className={`rounded-lg border p-3 text-left transition-all ${
            selected
              ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
              : "border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-500"
          }`}
        >
          {condition}
        </button>
      );
    })}
  </div>

  {formData.medicalConditions.length === 0 && (
    <p className="mt-3 text-sm text-slate-500">
      Leave unselected if none apply.
    </p>
  )}
</div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Are you currently taking any medications?
        </label>

        <textarea
          name="medications"
          value={formData.medications || ""}
          onChange={handleChange}
          placeholder="Enter medications, or type None"
          className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Do you have any injuries, pain or physical limitations?
        </label>

        <textarea
  name="injuries"
  value={formData.injuries || ""}
  onChange={handleChange}
  placeholder="For example: knee pain, shoulder discomfort, lower-back pain..."
  className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
/>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Any known nutritional deficiencies or relevant blood-test findings?
        </label>

        <textarea
          name="nutritionalDeficiencies"
          value={formData.nutritionalDeficiencies || ""}
          onChange={handleChange}
          placeholder="For example: Vitamin D deficiency, B12 deficiency, or None/Unknown"
          className="min-h-20 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-400">
          Anything else we should know?
        </label>

        <textarea
          name="additionalNotes"
          value={formData.additionalNotes || ""}
          onChange={handleChange}
          placeholder="Optional"
          className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
        <p className="text-sm text-slate-400">
          Your answers will be used to personalize your fitness, nutrition and lifestyle recommendations. AI-generated guidance should not replace professional medical advice or diagnosis.
        </p>
      </div>

    </div>
  </div>
)}

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-lg border border-slate-700 px-5 py-3 text-slate-300"
          >
            Back
          </button>
        )}

        {step < 7 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="ml-auto rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={finishOnboarding}
            className="ml-auto rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
          >
            Finish
          </button>
        )}
      </div>

    </div>
  </div>
);
}