import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import NewWorkoutModal from "./NewWorkoutModal";
import { generateWorkoutPlan } from "../../services/workoutPlanService";

export default function WorkoutPlans({
  selectedPlan,
  setSelectedPlan,
}) {
  const {
    appData,
    addWorkoutPlan,
    deleteWorkoutPlan,
  } = useApp();

  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] =
    useState(false);
  const [generateError, setGenerateError] =
    useState("");

  const plans = appData.workoutPlans || [];

  // -----------------------------------------
  // DELETE PLAN
  // -----------------------------------------

  function handleDeletePlan(e, plan) {
    e.stopPropagation();

    const confirmed = window.confirm(
      `Are you sure you want to delete "${plan.name}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteWorkoutPlan(plan.id);

    if (
      String(selectedPlan?.id) ===
      String(plan.id)
    ) {
      setSelectedPlan(null);
    }
  }

  // -----------------------------------------
  // PLAN STATS
  // -----------------------------------------

  function getPlanStats(plan) {
    // NEW WEEKLY PLAN FORMAT

    if (
      Array.isArray(plan.days) &&
      plan.days.length > 0
    ) {
      const workoutDays =
        plan.days.filter(
          (day) => !day.isRestDay
        );

      const restDays =
        plan.days.filter(
          (day) => day.isRestDay
        );

      const totalExercises =
        plan.days.reduce(
          (total, day) =>
            total +
            (day.exercises?.length || 0),
          0
        );

      return {
        workoutDays:
          workoutDays.length,

        restDays:
          restDays.length,

        totalExercises,
      };
    }

    // OLD / MANUAL FORMAT

    return {
      workoutDays:
        plan.exercises?.length > 0
          ? 1
          : 0,

      restDays: 0,

      totalExercises:
        plan.exercises?.length || 0,
    };
  }

  // -----------------------------------------
  // GENERATE AI PLAN
  // -----------------------------------------

  async function handleGenerateAIPlan() {
  try {
    setIsGenerating(true);
    setGenerateError("");

    const onboarding =
      appData?.onboardingProfile || {};

    const assessment =
      appData?.assessment || {};

    if (!Object.keys(onboarding).length) {
      throw new Error(
        "Your onboarding profile could not be found."
      );
    }

    const targets =
      assessment?.startingTargets || {};

    const workoutProfile = {
      ...onboarding,

      goal:
        onboarding.goal ||
        appData?.profile?.goal ||
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
        "Home",

      equipment:
        onboarding.equipment || [],

      preferences:
        onboarding.trainingPreferences || [],

      limitations: [
        ...(Array.isArray(onboarding.injuries)
          ? onboarding.injuries
          : onboarding.injuries
            ? [onboarding.injuries]
            : []),

        ...(Array.isArray(onboarding.physicalLimitations)
          ? onboarding.physicalLimitations
          : onboarding.physicalLimitations
            ? [onboarding.physicalLimitations]
            : []),

        ...(Array.isArray(onboarding.medicalRestrictions)
          ? onboarding.medicalRestrictions
          : onboarding.medicalRestrictions
            ? [onboarding.medicalRestrictions]
            : []),
      ],

      assessment: {
        trainingAssessment:
          assessment?.trainingAssessment || "",

        activityAssessment:
          assessment?.activityAssessment || "",

        safetyNotes:
          assessment?.safetyNotes || "",
      },
    };

    const generatedPlan =
      await generateWorkoutPlan(
        workoutProfile
      );

    const finalPlan = {
      ...generatedPlan,
      isActive: true,
      source: "ai_generated",
    };

    addWorkoutPlan(finalPlan);

    setSelectedPlan(finalPlan);

  } catch (error) {
    console.error(
      "AI Plan Generation Error:",
      error
    );

    setGenerateError(
      error.message ||
        "Unable to generate workout plan."
    );

  } finally {
    setIsGenerating(false);
  }
}

  return (
    <>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <h2 className="text-2xl font-bold">
            My Workout Plans
          </h2>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={
                handleGenerateAIPlan
              }
              disabled={
                isGenerating
              }
              className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating
                ? "Generating..."
                : "✨ Generate AI Plan"}
            </button>

            <button
              type="button"
              onClick={() =>
                setOpen(true)
              }
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white"
            >
              + New Plan
            </button>

          </div>

        </div>

        {/* ERROR */}

        {generateError && (

          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {generateError}
          </div>

        )}

        {/* PLANS */}

        {plans.length > 0 ? (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {plans.map((plan) => {

              const stats =
                getPlanStats(plan);

              return (

                <div
                  key={plan.id}
                  onClick={() =>
                    setSelectedPlan(
                      plan
                    )
                  }
                  className={`cursor-pointer rounded-xl border p-5 transition ${
                    String(
                      selectedPlan?.id
                    ) ===
                    String(plan.id)
                      ? "border-emerald-500 bg-slate-800"
                      : "border-slate-800 bg-slate-800 hover:border-emerald-500"
                  }`}
                >

                  {/* PLAN HEADER */}

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-bold text-white">
                        {plan.name}
                      </h3>

                      {plan.source ===
                        "ai_onboarding" && (

                        <p className="mt-2 text-xs font-semibold text-violet-400">
                          ✨ AI Personalized
                        </p>

                      )}

                      {plan.source ===
                        "ai_generated" && (

                        <p className="mt-2 text-xs font-semibold text-violet-400">
                          ✨ AI Generated
                        </p>

                      )}

                      {plan.isActive && (

                        <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">
                          Active Plan
                        </span>

                      )}

                    </div>

                    <button
                      type="button"
                      onClick={(e) =>
                        handleDeletePlan(
                          e,
                          plan
                        )
                      }
                      className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      Delete
                    </button>

                  </div>

                  {/* PLAN STATS */}

                  <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">

                    <span className="text-emerald-400">
                      {
                        stats.workoutDays
                      }{" "}
                      Workout Days
                    </span>

                    {stats.restDays >
                      0 && (

                      <span className="text-slate-400">
                        {
                          stats.restDays
                        }{" "}
                        Rest Days
                      </span>

                    )}

                    <span className="text-slate-400">
                      {
                        stats.totalExercises
                      }{" "}
                      Exercises
                    </span>

                  </div>

                  <p className="mt-4 text-xs text-slate-500">
                    Click to view plan
                  </p>

                </div>

              );
            })}

          </div>

        ) : (

          <div className="rounded-xl border border-dashed border-slate-700 py-12 text-center">

            <h3 className="text-lg font-semibold text-white">
              No workout plans yet
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Your personalized workout plan will appear here after onboarding.
            </p>

          </div>

        )}

      </div>

      {/* NEW MANUAL PLAN */}

      <NewWorkoutModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        onSave={(plan) => {
          addWorkoutPlan(
            plan
          );

          setOpen(false);
        }}
      />

    </>
  );
}