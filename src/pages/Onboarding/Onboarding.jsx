import { useState } from "react";
import GoalCard from "../../components/onboarding/GoalCard";
import { useApp } from "../../contexts/AppContext";
import { generateUserProfile } from "../../services/profileEngine";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
  name: "",
  dob: "",
  gender: "",
  height: "",
  weight: "",
  goal: "",
  activity: "",
  foodPreference: "",
  workoutDays: "",
  targetDate: "",
  targetWeight: "",
  medicalConditions: "",
  preferredUnits: "Metric",
  activity: "",
workoutDays: "",
occupation: "",
sleepHours: "",
dailySteps: "",
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

    profile: {
      ...prev.profile,
      ...generatedData.profile,
      onboardingCompleted: true,
    },

    goals: {
      ...prev.goals,
      ...generatedData.goals,
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
  }));

  navigate("/dashboard", {
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
    style={{ width: `${(step / 5) * 100}%` }}
  />
</div>
            Let's build your fitness profile
          </h1>

          <p className="mt-2 text-slate-400">
            Step {step} of 5
          </p>
        </div>

        {step === 1 && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold">
              Tell us about yourself
            </h2>

            <div className="grid gap-4">

              <input
  type="text"
  name="name"
  placeholder="Full Name"
  value={formData.name}
  onChange={handleChange}
  className="rounded-lg border border-slate-700 bg-slate-800 p-3"
/>

  <input
  type="date"
  name="dob"
  aria-label="Date of Birth"
  title="Date of Birth"
  value={formData.dob}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
/>
  
              <select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  className="rounded-lg border border-slate-700 bg-slate-800 p-3"
>
  <option value="">Select Gender</option>
  <option>Male</option>
  <option>Female</option>
</select>
              
              <input
  type="number"
  name="height"
  placeholder="Height (cm)"
  value={formData.height}
  onChange={handleChange}
  className="rounded-lg border border-slate-700 bg-slate-800 p-3"
/>
              <input
  type="number"
  name="weight"
  placeholder="Weight (kg)"
  value={formData.weight}
  onChange={handleChange}
  className="rounded-lg border border-slate-700 bg-slate-800 p-3"
/>
            <select
  name="preferredUnits"
  value={formData.preferredUnits}
  onChange={handleChange}
  className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
>
  <option>Metric</option>
  <option>Imperial</option>
</select>
            </div>
          </div>
        )}

        {step === 2 && (
  <div>
    <h2 className="mb-2 text-2xl font-semibold">
      What's your primary goal?
    </h2>

    <p className="mb-8 text-slate-400">
      This helps SHRED calculate your calories and nutrition targets.
    </p>

    <div className="space-y-4">

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
        description="Gain lean muscle with a calorie surplus."
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
        description="Lose fat and build muscle together."
        selected={formData.goal === "Body Recomposition"}
        onClick={() =>
          setFormData({
            ...formData,
            goal: "Body Recomposition",
          })
        }
      />

      <GoalCard
        title="Maintain Weight"
        description="Maintain your current body weight."
        selected={formData.goal === "Maintain Weight"}
        onClick={() =>
          setFormData({
            ...formData,
            goal: "Maintain Weight",
          })
        }
      />
      
      <div className="mt-8 grid gap-4">

  <input
    type="number"
    name="targetWeight"
    placeholder="Target Weight (kg)"
    value={formData.targetWeight || ""}
    onChange={handleChange}
    className="rounded-lg border border-slate-700 bg-slate-800 p-3"
  />

    <input
    type="date"
    name="targetDate"
    aria-label="Target Date"
  title="Target Date"
    value={formData.targetDate}
    onChange={handleChange}
    className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
  />

</div>

    </div>
  </div>
)}

{step === 3 && (
  <div>
    <h2 className="mb-6 text-2xl font-semibold">
      Activity Level
    </h2>

    <select
  name="activity"
  value={formData.activity}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
>
  <option value="">Activity Level</option>
  <option>Sedentary</option>
  <option>Lightly Active</option>
  <option>Moderately Active</option>
  <option>Very Active</option>
  <option>Athlete</option>
</select>

<input
  type="number"
  name="workoutDays"
  placeholder="Workout Days per Week"
  value={formData.workoutDays}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
/>

<select
  name="occupation"
  value={formData.occupation}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
>
  <option value="">Occupation</option>
  <option>Desk Job</option>
  <option>Mostly Standing</option>
  <option>Physical Labour</option>
</select>

<input
  type="number"
  step="0.5"
  name="sleepHours"
  placeholder="Average Sleep (Hours)"
  value={formData.sleepHours}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
/>

<input
  type="number"
  name="dailySteps"
  placeholder="Average Daily Steps (Optional)"
  value={formData.dailySteps}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
/>

  </div>
)}

{step === 4 && (
  <div>
    <h2 className="mb-6 text-2xl font-semibold">
      Food Preference
    </h2>

    <select
  name="foodPreference"
  value={formData.foodPreference}
  onChange={handleChange}
  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
>
  <option value="">Select Preference</option>
  <option>Vegetarian</option>
  <option>Eggetarian</option>
  <option>Vegan</option>
  <option>Non Vegetarian</option>
</select>

<input
  type="number"
  name="workoutDays"
  placeholder="Workout Days per Week"
  value={formData.workoutDays}
  onChange={handleChange}
  className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
/>

<input
  type="date"
  name="targetDate"
  value={formData.targetDate}
  onChange={handleChange}
  className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
/>

<textarea
  name="medicalConditions"
  placeholder="Medical Conditions / Injuries (Optional)"
  value={formData.medicalConditions}
  onChange={handleChange}
  className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
/>

  </div>
)}

{step === 5 && (
  <div>
    <h2 className="mb-6 text-2xl font-semibold">
      Ready to Start?
    </h2>

    <p className="text-slate-400">
      Click Finish to create your SHRED profile.
    </p>
  </div>
)}
        <div className="mt-10 flex justify-between">

  <button
    onClick={() => setStep(step - 1)}
    disabled={step === 1}
    className="rounded-lg border border-slate-700 px-8 py-3 disabled:opacity-40"
  >
    Back
  </button>

  <button
    onClick={() => {
  if (step < 5) {
    setStep(step + 1);
  } else {
    finishOnboarding();
  }
}}
    className="rounded-lg bg-emerald-500 px-8 py-3 font-semibold"
  >
    {step === 5 ? "Finish" : "Next"}
  </button>

</div>

      </div>
    </div>
  );
}