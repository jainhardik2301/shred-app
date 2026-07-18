import { useState } from "react";
import { exerciseLibrary } from "../../data/exerciseLibrary";
import { useApp } from "../../contexts/AppContext";
import ExercisePicker from "./ExercisePicker";

export default function WorkoutPlanEditor({
  plan,
  setSelectedPlan,
}) {
  const {
    addExerciseToWorkoutPlan,
    removeExerciseFromWorkoutPlan,
    renameWorkoutPlan,
    deleteWorkoutPlan,
    duplicateWorkoutPlan,
  } = useApp();

  const [openPicker, setOpenPicker] = useState(false);

  const allExercises = Object.values(exerciseLibrary).flat();

  const getExercise = (item) => {
    if (typeof item === "object") return item;

    return allExercises.find((e) => e.id === item);
  };

  function handleAdd(exercise) {
    addExerciseToWorkoutPlan(plan.id, exercise);

    setSelectedPlan({
      ...plan,
      exercises: [...plan.exercises, exercise],
    });

    setOpenPicker(false);
  }

  function handleRemove(exerciseId) {
    removeExerciseFromWorkoutPlan(plan.id, exerciseId);

    setSelectedPlan({
      ...plan,
      exercises: plan.exercises.filter((exercise) => {
        const id =
          typeof exercise === "object"
            ? exercise.id
            : exercise;

        return id !== exerciseId;
      }),
    });
  }

  function handleDuplicate() {
    duplicateWorkoutPlan(plan.id);
  }

  function handleDelete() {
    if (
      !window.confirm(
        "Delete this workout plan?"
      )
    )
      return;

    deleteWorkoutPlan(plan.id);

    setSelectedPlan(null);
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="mb-6 flex items-start justify-between">

          <div className="space-y-3 flex-1">

            <input
              value={plan.name}
              onChange={(e) => {
                renameWorkoutPlan(
                  plan.id,
                  e.target.value
                );

                setSelectedPlan({
                  ...plan,
                  name: e.target.value,
                });
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-xl font-bold text-white"
            />

            <p className="text-slate-400">
              {plan.day}
            </p>

          </div>

          <div className="ml-6 flex gap-3">

            <button
              onClick={() => setOpenPicker(true)}
              className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white hover:bg-emerald-600"
            >
              + Add Exercise
            </button>

            <button
              onClick={handleDuplicate}
              className="rounded-xl bg-slate-700 px-5 py-3 font-semibold text-white hover:bg-slate-600"
            >
              Duplicate
            </button>

            <button
              onClick={handleDelete}
              className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>

          </div>

        </div>

        <div className="space-y-3">

          {plan.exercises.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">

              No exercises added yet.

            </div>

          ) : (

            plan.exercises.map((item) => {

              const exercise = getExercise(item);

              if (!exercise) return null;

              return (

                <div
                  key={exercise.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800 p-4"
                >

                  <div>

                    <h3 className="font-semibold text-white">
                      {exercise.name}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {exercise.sets}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      handleRemove(exercise.id)
                    }
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>

                </div>

              );
            })

          )}

        </div>

      </div>

      <ExercisePicker
        open={openPicker}
        onClose={() => setOpenPicker(false)}
        onSelect={handleAdd}
      />
    </>
  );
}