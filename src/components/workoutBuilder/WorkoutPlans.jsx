import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import NewWorkoutModal from "./NewWorkoutModal";

export default function WorkoutPlans({
  selectedPlan,
  setSelectedPlan,
}) {
  const {
    appData,
    addWorkoutPlan,
  } = useApp();

  const [open, setOpen] = useState(false);

  const plans = appData.workoutPlans || [];

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            My Workout Plans
          </h2>

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white"
          >
            + New Plan
          </button>

        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {plans.map((plan) => (

            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`cursor-pointer rounded-xl border p-5 transition ${
                selectedPlan?.id === plan.id
                  ? "border-emerald-500 bg-slate-800"
                  : "border-slate-800 bg-slate-800 hover:border-emerald-500"
              }`}
            >

              <h3 className="text-xl font-semibold">
                {plan.name}
              </h3>

              <p className="mt-2 text-slate-400">
                {plan.day}
              </p>

              <p className="mt-5 text-sm text-emerald-400">
                {plan.exercises.length} Exercises
              </p>

            </div>

          ))}

        </div>

      </div>

      <NewWorkoutModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(plan) => {
          addWorkoutPlan(plan);
          setOpen(false);
        }}
      />

    </>
  );
}