import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import { useEffect, useState } from "react";
import { generateAssessment } from "../../services/assessmentService";
import { generateWorkoutPlan } from "../../services/workoutPlanService";
import { generateNutritionPlan } from "../../services/nutritionPlanService";

export default function Assessment() {
  const navigate = useNavigate();
  const { appData, setAppData, cloudReady } = useApp();

const profile = appData?.profile || {};
const goals = appData?.goals || {};
const onboarding = appData?.onboardingProfile || {};

const [assessment, setAssessment] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [isGeneratingPlans, setIsGeneratingPlans] = useState(false);

useEffect(() => {
  const loadAssessment = async () => {
    if (!cloudReady) {
  return;
}    
    if (appData?.assessment) {
  setAssessment(appData.assessment);
  setLoading(false);
  return;
}
    
    if (!onboarding || Object.keys(onboarding).length === 0) {
      setError("No onboarding profile found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await generateAssessment(onboarding);

setAssessment(result);

setAppData((prev) => ({
  ...prev,
  assessment: result,
}));
    } catch (err) {
      console.error("Assessment error:", err);

      setError(
        err.message ||
          "Unable to generate your personalized assessment."
      );
    } finally {
      setLoading(false);
    }
  };

  loadAssessment();
}, [cloudReady]);

const handleGeneratePlans = async () => {
  if (!assessment?.startingTargets) {
    setError("Personalized targets are not available.");
    return;
  }

  try {
    setIsGeneratingPlans(true);
    setError("");

    const targets = assessment.startingTargets;

    // Map onboarding fields to the format expected
    // by the workout-plan AI endpoint.
    const workoutProfile = {
      ...onboarding,

      goal:
        onboarding.goal ||
        profile.goal ||
        "General Fitness",

      experienceLevel:
        onboarding.experienceLevel ||
        "Beginner",

      workoutDaysPerWeek:
        Number(onboarding.workoutDays) ||
        Number(targets.workoutDays) ||
        3,

      sessionDuration:
        Number(onboarding.sessionDuration) ||
        45,

      location:
        onboarding.workoutLocation ||
        "Gym",

      equipment:
        onboarding.equipment || [],

      preferences:
        onboarding.trainingPreferences || [],

      limitations: [
        ...(onboarding.injuries || []),
        ...(onboarding.physicalLimitations || []),
      ],

      assessment: {
        trainingAssessment:
          assessment.trainingAssessment,

        activityAssessment:
          assessment.activityAssessment,

        safetyNotes:
          assessment.safetyNotes,
      },
    };

    // Generate workout and nutrition plans at the same time
const [
  generatedWorkoutPlan,
  generatedNutritionPlan,
] = await Promise.all([
  generateWorkoutPlan(workoutProfile),

  generateNutritionPlan(
    onboarding,
    assessment
  ),
]);

    // Save everything together
    setAppData((prev) => ({
      ...prev,

      profile: {
        ...prev.profile,
        onboardingCompleted: true,
      },

      goals: {
        ...prev.goals,

        calories:
          Number(targets.dailyCalories) ||
          prev.goals?.calories ||
          0,

        protein:
          Number(targets.proteinGrams) ||
          prev.goals?.protein ||
          0,

        water:
          Number(targets.waterLiters) ||
          prev.goals?.water ||
          0,

        steps:
          Number(targets.dailySteps) ||
          prev.goals?.steps ||
          0,
      },

      // Make old plans inactive and new AI plan active
      workoutPlans: [
        ...(prev.workoutPlans || []).map((plan) => ({
          ...plan,
          isActive: false,
        })),

        {
          ...generatedWorkoutPlan,
          isActive: true,
          source: "ai_onboarding",
        },
      ],
nutritionPlan: generatedNutritionPlan,

    }));

        navigate("/", {
      replace: true,
    });
  } catch (err) {
    console.error(
      "Personalized Plan Generation Error:",
      err
    );

    setError(
      err.message ||
        "Unable to generate your personalized plans."
    );
  } finally {
    setIsGeneratingPlans(false);
  }
}; 

return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Your Personalized Assessment
          </p>

          <h1 className="text-3xl font-bold">
            Your SHRED Starting Point
          </h1>

          <p className="mt-3 text-slate-400">
            Based on your goals, lifestyle, nutrition, training preferences
            and health information, SHRED has created your initial fitness
            assessment.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Current Weight</p>
            <p className="text-2xl font-bold">
  {onboarding.weight || profile.weight || "--"} kg
</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Goal Weight</p>
            <p className="text-2xl font-bold text-emerald-400">
  {onboarding.targetWeight || goals.targetWeight || "--"} kg
</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Primary Goal</p>
            <p className="text-2xl font-bold">
  {onboarding.goal || "--"}
</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold">
            AI Assessment
          </h2>

          <p className="mt-3 text-slate-400">
            We're preparing your personalized health, nutrition and training
            recommendations based on your onboarding profile.
          </p>

          {loading && (
  <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/5 p-5">
    <p className="font-semibold text-cyan-400">
      SHRED AI is analyzing your profile...
    </p>

    <p className="mt-2 text-sm text-slate-400">
      We're reviewing your goals, lifestyle, nutrition, training preferences
      and health information to build your personalized assessment.
    </p>
  </div>
)}

{error && (
  <div className="rounded-xl border border-red-500/40 bg-red-500/5 p-5">
    <p className="font-semibold text-red-400">
      Unable to generate assessment
    </p>

    <p className="mt-2 text-sm text-slate-400">
      {error}
    </p>
  </div>
)}

{!loading && !error && assessment && (
  <div className="space-y-6">

    {/* OVERALL ASSESSMENT */}
    <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5">
      <p className="font-semibold text-emerald-400">
        Your Personalized Assessment
      </p>

      <p className="mt-3 leading-7 text-slate-300">
        {assessment.summary}
      </p>
    </div>


    {/* STARTING TARGETS */}
    {assessment.startingTargets && (
      <div>
        <h3 className="mb-4 text-lg font-semibold">
          Your Starting Targets
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-xs text-slate-400">Daily Calories</p>
            <p className="mt-2 text-xl font-bold text-orange-400">
              {assessment.startingTargets.dailyCalories || "--"} kcal
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-xs text-slate-400">Protein</p>
            <p className="mt-2 text-xl font-bold text-emerald-400">
              {assessment.startingTargets.proteinGrams || "--"} g
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-xs text-slate-400">Water</p>
            <p className="mt-2 text-xl font-bold text-cyan-400">
              {assessment.startingTargets.waterLiters || "--"} L
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-xs text-slate-400">Daily Steps</p>
            <p className="mt-2 text-xl font-bold">
              {assessment.startingTargets.dailySteps?.toLocaleString() || "--"}
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
            <p className="text-xs text-slate-400">Training</p>
            <p className="mt-2 text-xl font-bold">
              {assessment.startingTargets.workoutDays || "--"} days
            </p>
          </div>

        </div>
      </div>
    )}


    {/* KEY OBSERVATIONS */}
    {assessment.keyObservations?.length > 0 && (
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">

        <h3 className="text-lg font-semibold">
          Key Observations
        </h3>

        <div className="mt-4 space-y-3">
          {assessment.keyObservations.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 text-slate-300"
            >
              <span className="text-emerald-400">●</span>
              <p>{item}</p>
            </div>
          ))}
        </div>

      </div>
    )}


    {/* PRIORITY AREAS */}
    {assessment.priorityAreas?.length > 0 && (
      <div>

        <h3 className="mb-4 text-lg font-semibold">
          Your Biggest Opportunities
        </h3>

        <div className="grid gap-4 md:grid-cols-2">

          {assessment.priorityAreas.map((priority, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-700 bg-slate-800/50 p-5"
            >
              <p className="font-semibold text-emerald-400">
                {priority.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                {priority.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    )}


    {/* GOAL ASSESSMENT */}
    {assessment.goalAssessment && (
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">

        <h3 className="text-lg font-semibold">
          Goal & Progress Outlook
        </h3>

        <p className="mt-3 leading-7 text-slate-300">
          {assessment.goalAssessment.message}
        </p>

      </div>
    )}


    {/* STRATEGY CARDS */}
    <div className="grid gap-5 lg:grid-cols-2">

      {[
        ["Nutrition Strategy", assessment.nutritionAssessment],
        ["Activity & Lifestyle", assessment.activityAssessment],
        ["Training Strategy", assessment.trainingAssessment],
        ["Sleep & Recovery", assessment.recoveryAssessment],
      ].map(([title, section]) =>
        section ? (
          <div
            key={title}
            className="rounded-xl border border-slate-700 bg-slate-800/50 p-5"
          >

            <h3 className="text-lg font-semibold">
              {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {section.summary}
            </p>

            {section.recommendations?.length > 0 && (
              <div className="mt-4 space-y-3">

                {section.recommendations.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 text-sm text-slate-300"
                  >
                    <span className="text-emerald-400">✓</span>
                    <p>{item}</p>
                  </div>
                ))}

              </div>
            )}

          </div>
        ) : null
      )}

    </div>


    {/* STRENGTHS */}
    {assessment.strengths?.length > 0 && (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

        <h3 className="text-lg font-semibold text-emerald-400">
          What You Already Have Going for You
        </h3>

        <div className="mt-4 space-y-3">

          {assessment.strengths.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 text-slate-300"
            >
              <span className="text-emerald-400">✓</span>
              <p>{item}</p>
            </div>
          ))}

        </div>

      </div>
    )}


    {/* EXPECTED PROGRESS */}
    {assessment.expectedProgress?.summary && (
      <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-5">

        <h3 className="text-lg font-semibold">
          What Progress Could Look Like
        </h3>

        <p className="mt-3 leading-7 text-slate-300">
          {assessment.expectedProgress.summary}
        </p>

      </div>
    )}


    {/* SAFETY NOTES */}
    {assessment.safetyNotes?.length > 0 && (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">

        <h3 className="font-semibold text-amber-400">
          Health & Safety Notes
        </h3>

        <div className="mt-3 space-y-2">

          {assessment.safetyNotes.map((note, index) => (
            <p
              key={index}
              className="text-sm leading-6 text-slate-300"
            >
              {note}
            </p>
          ))}

        </div>

      </div>
    )}

  </div>
)}
        </div>

        <div className="mt-8 flex justify-end">
          <button
  onClick={handleGeneratePlans}
  disabled={
  loading ||
  !assessment ||
  isGeneratingPlans
}
  className="w-full rounded-xl bg-emerald-500 px-6 py-4 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
>
  {isGeneratingPlans
  ? "Building Your Personalized Plans..."
  : "Generate My Personalized Plans"}
</button>
        </div>

      </div>
    </div>
  );
}