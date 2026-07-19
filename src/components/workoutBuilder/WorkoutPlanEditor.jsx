import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import ExercisePicker from "./ExercisePicker";

export default function WorkoutPlanEditor({
  plan,
}) {
  const {
  appData,
  updateWorkoutPlan,
} = useApp();

const [editingExercise, setEditingExercise] =
  useState(null);

const [editSets, setEditSets] =
  useState("");

const [editReps, setEditReps] =
  useState("");

const [editRestSeconds, setEditRestSeconds] =
  useState("");

const [exercisePickerOpen, setExercisePickerOpen] =
  useState(false);

const [selectedDayId, setSelectedDayId] =
  useState(null);

const [replacingExerciseId, setReplacingExerciseId] =
  useState(null);

const [editingDayId, setEditingDayId] =
  useState(null);

const [editDayName, setEditDayName] =
  useState("");

  // Always use latest plan from context
  // so UI updates without refresh.
  const currentPlan =
    (appData.workoutPlans || []).find(
      (item) =>
        String(item.id) ===
        String(plan.id)
    ) || plan;

  const days =
    currentPlan.days || [];

  // ---------------------------------
  // LEGACY / MANUAL PLAN FALLBACK
  // We'll upgrade manual plan creation
  // to the new format next.
  // ---------------------------------

  if (days.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="text-2xl font-bold text-white">
          {currentPlan.name}
        </h2>

        <p className="mt-4 text-slate-400">
          This plan uses the older workout format.
          Create a new plan to use the weekly workout structure.
        </p>

      </div>
    );
  }

  function handleEditExercise(
  dayId,
  exercise
) {
  setEditingExercise({
    dayId,
    exerciseId: exercise.id,
  });

  setEditSets(
    String(exercise.sets || 3)
  );

  setEditReps(
    String(exercise.reps || "8-12")
  );

  setEditRestSeconds(
    String(
      exercise.restSeconds || 60
    )
  );
}

function handleCancelEdit() {
  setEditingExercise(null);
}

function handleSaveExercise(
  dayId,
  exerciseId
) {
  const updatedPlan = {
    ...currentPlan,

    days: currentPlan.days.map(
      (day) => {

        if (
          String(day.id) !==
          String(dayId)
        ) {
          return day;
        }

        return {
          ...day,

          exercises: (
            day.exercises || []
          ).map((exercise) => {

            if (
              String(exercise.id) !==
              String(exerciseId)
            ) {
              return exercise;
            }

            return {
              ...exercise,

              sets:
                Math.max(
                  1,
                  Number(editSets) || 1
                ),

              reps:
                editReps.trim() ||
                "8-12",

              restSeconds:
                Math.max(
                  0,
                  Number(
                    editRestSeconds
                  ) || 0
                ),
            };
          }),
        };
      }
    ),
  };

  updateWorkoutPlan(updatedPlan);

  setEditingExercise(null);
}

function handleRemoveExercise(
  dayId,
  exerciseId
) {
  const confirmed =
    window.confirm(
      "Remove this exercise from the workout?"
    );

  if (!confirmed) {
    return;
  }

  const updatedPlan = {
    ...currentPlan,

    days: currentPlan.days.map(
      (day) => {

        if (
          String(day.id) !==
          String(dayId)
        ) {
          return day;
        }

        return {
          ...day,

          exercises: (
            day.exercises || []
          ).filter(
            (exercise) =>
              String(exercise.id) !==
              String(exerciseId)
          ),
        };
      }
    ),
  };

  updateWorkoutPlan(updatedPlan);
}
function handleOpenExercisePicker(dayId) {
  setSelectedDayId(dayId);
  setExercisePickerOpen(true);
}

function handleCloseExercisePicker() {
  setExercisePickerOpen(false);
  setSelectedDayId(null);
  setReplacingExerciseId(null);
}

function handleAddExercise(exercise) {
  if (!selectedDayId) {
    return;
  }

  const newExercise = {
    ...exercise,

    id: replacingExerciseId
      ? replacingExerciseId
      : `exercise-${Date.now()}`,

    sets:
      Number(
        exercise.sets ||
        exercise.defaultSets
      ) || 3,

    reps:
      String(
        exercise.reps ||
        exercise.defaultReps ||
        "8-12"
      ),

    restSeconds:
      Number(
        exercise.restSeconds
      ) || 60,

    source:
      exercise.source || "AI",
  };

  const updatedPlan = {
    ...currentPlan,

    days: currentPlan.days.map(
      (day) => {
        if (
          String(day.id) !==
          String(selectedDayId)
        ) {
          return day;
        }

        // REPLACE EXISTING EXERCISE

        if (replacingExerciseId) {
          return {
            ...day,

            exercises: (
              day.exercises || []
            ).map((existingExercise) =>
              String(existingExercise.id) ===
              String(replacingExerciseId)
                ? newExercise
                : existingExercise
            ),
          };
        }

        // ADD NEW EXERCISE

        return {
          ...day,

          isRestDay: false,

          exercises: [
            ...(day.exercises || []),
            newExercise,
          ],
        };
      }
    ),
  };

  updateWorkoutPlan(updatedPlan);

  handleCloseExercisePicker();
}

function handleReplaceExercise(
  dayId,
  exerciseId
) {
  setSelectedDayId(dayId);
  setReplacingExerciseId(exerciseId);
  setExercisePickerOpen(true);
}

function handleToggleWorkoutDay(dayId) {
  const updatedPlan = {
    ...currentPlan,

    days: currentPlan.days.map((day) => {
      if (
        String(day.id) !==
        String(dayId)
      ) {
        return day;
      }

      // WORKOUT DAY → REST DAY
      if (!day.isRestDay) {
        const confirmed =
          day.exercises?.length > 0
            ? window.confirm(
                "Changing this to a recovery day will remove all exercises from this day. Continue?"
              )
            : true;

        if (!confirmed) {
          return day;
        }

        return {
          ...day,
          name: "Recovery",
          isRestDay: true,
          exercises: [],
        };
      }

      // REST DAY → WORKOUT DAY
      return {
        ...day,
        name: "Workout",
        isRestDay: false,
        exercises: [],
      };
    }),
  };

  updateWorkoutPlan(updatedPlan);
}
function handleEditDay(day) {
  setEditingDayId(day.id);

  setEditDayName(
    day.name || "Workout"
  );
}

function handleSaveDayName(dayId) {
  const name =
    editDayName.trim();

  if (!name) {
    return;
  }

  const updatedPlan = {
    ...currentPlan,

    days: currentPlan.days.map(
      (day) =>
        String(day.id) ===
        String(dayId)
          ? {
              ...day,
              name,
            }
          : day
    ),
  };

  updateWorkoutPlan(updatedPlan);

  setEditingDayId(null);
  setEditDayName("");
}

function handleCancelDayEdit() {
  setEditingDayId(null);
  setEditDayName("");
}
  return (
    <div className="space-y-6">

      {/* PLAN HEADER */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-2xl font-bold text-white">
                {currentPlan.name}
              </h2>

              {currentPlan.isActive && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                  Active Plan
                </span>
              )}

            </div>

            {currentPlan.source ===
              "ai_onboarding" && (

              <p className="mt-2 text-sm font-medium text-violet-400">
                ✨ Personalized by AI
              </p>

            )}

          </div>

        </div>

      </div>

      {/* WEEKLY SCHEDULE */}

      <div className="space-y-4">

        {days.map((day) => (

          <div
            key={day.id || day.day}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >

            {/* DAY HEADER */}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h3 className="text-xl font-bold text-white">
                  {day.day}
                </h3>

                <p
                  className={`mt-1 text-sm font-medium ${
                    day.isRestDay
                      ? "text-slate-400"
                      : "text-emerald-400"
                  }`}
                >
                  {day.name}
                </p>

              </div>

              <div className="flex flex-wrap items-center gap-3">

  {day.isRestDay ? (

    <>
      <span className="w-fit rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">
        Recovery Day
      </span>

      <button
        type="button"
        onClick={() =>
          handleToggleWorkoutDay(
            day.id
          )
        }
        className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20"
      >
        + Make Workout Day
      </button>
    </>

  ) : (

    <>
      <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
        {day.exercises?.length || 0} Exercises
      </span>

      <button
        type="button"
        onClick={() =>
          handleOpenExercisePicker(
            day.id
          )
        }
        className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        + Add Exercise
      </button>

      <button
  type="button"
  onClick={() =>
    handleEditDay(day)
  }
  className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-600"
>
  Edit Day
</button>
      
      <button
        type="button"
        onClick={() =>
          handleToggleWorkoutDay(
            day.id
          )
        }
        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-600"
      >
        Make Rest Day
      </button>
    </>

  )}

</div>

            </div>

            {editingDayId === day.id && (

  <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-800 p-4 sm:flex-row sm:items-end">

    <div className="flex-1">

      <label className="mb-2 block text-sm font-semibold text-slate-300">
        Workout Day Name
      </label>

      <input
        type="text"
        value={editDayName}
        onChange={(e) =>
          setEditDayName(
            e.target.value
          )
        }
        placeholder="e.g. Push Day, Upper Body, Leg Day"
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
      />

    </div>

    <button
      type="button"
      onClick={() =>
        handleSaveDayName(
          day.id
        )
      }
      className="rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-white"
    >
      Save
    </button>

    <button
      type="button"
      onClick={
        handleCancelDayEdit
      }
      className="rounded-lg bg-slate-700 px-4 py-3 font-semibold text-white"
    >
      Cancel
    </button>

  </div>

)}
            
            {/* REST DAY */}

            {day.isRestDay ? (

              <div className="mt-5 rounded-xl border border-dashed border-slate-700 p-5">

                <p className="text-sm text-slate-400">
                  Rest and recovery
                </p>

              </div>

            ) : (

              /* EXERCISES */

              <div className="mt-5 space-y-3">

                {(day.exercises || []).map(
                  (exercise) => (

                    <div
                      key={exercise.id}
                      className="rounded-xl border border-slate-700 bg-slate-800 p-4"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* EXERCISE DETAILS */}

                        <div>

                          <h4 className="font-bold text-white">
                            {exercise.name}
                          </h4>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">

                            <span className="font-semibold text-emerald-400">
                              {exercise.sets} ×{" "}
                              {exercise.reps}
                            </span>

                            {exercise.equipment && (

                              <span className="text-slate-400">
                                {
                                  exercise.equipment
                                }
                              </span>

                            )}

                            {exercise.primaryMuscle && (

                              <span className="text-slate-400">
                                {
                                  exercise.primaryMuscle
                                }
                              </span>

                            )}

                          </div>

                          {exercise.restSeconds >
                            0 && (

                            <p className="mt-2 text-xs text-slate-500">
                              Rest:{" "}
                              {
                                exercise.restSeconds
                              }{" "}
                              sec
                            </p>

                          )}

                        </div>

                        {/* SOURCE */}

                        <div className="flex items-center gap-2">

  {exercise.source === "AI" && (
    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400">
      AI
    </span>
  )}

  <button
    type="button"
    onClick={() =>
      handleEditExercise(
        day.id,
        exercise
      )
    }
    className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-600"
  >
    Edit
  </button>

  <button
  type="button"
  onClick={() =>
    handleReplaceExercise(
      day.id,
      exercise.id
    )
  }
  className="rounded-lg bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-400 hover:bg-violet-500/20"
>
  Replace
</button>
  
  <button
    type="button"
    onClick={() =>
      handleRemoveExercise(
        day.id,
        exercise.id
      )
    }
    className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20"
  >
    Remove
  </button>

</div>

                      </div>
                      {editingExercise?.dayId ===
  day.id &&
  editingExercise?.exerciseId ===
    exercise.id && (

  <div className="mt-4 grid gap-3 border-t border-slate-700 pt-4 sm:grid-cols-3">

    <div>
      <label className="mb-1 block text-xs text-slate-400">
        Sets
      </label>

      <input
        type="number"
        min="1"
        value={editSets}
        onChange={(e) =>
          setEditSets(
            e.target.value
          )
        }
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="mb-1 block text-xs text-slate-400">
        Reps
      </label>

      <input
        type="text"
        value={editReps}
        onChange={(e) =>
          setEditReps(
            e.target.value
          )
        }
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="mb-1 block text-xs text-slate-400">
        Rest (seconds)
      </label>

      <input
        type="number"
        min="0"
        value={editRestSeconds}
        onChange={(e) =>
          setEditRestSeconds(
            e.target.value
          )
        }
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white"
      />
    </div>

    <div className="flex gap-2 sm:col-span-3">

      <button
        type="button"
        onClick={() =>
          handleSaveExercise(
            day.id,
            exercise.id
          )
        }
        className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
      >
        Save Changes
      </button>

      <button
        type="button"
        onClick={
          handleCancelEdit
        }
        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white"
      >
        Cancel
      </button>

    </div>

  </div>

)}

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        ))}

      </div>

    <ExercisePicker
  open={exercisePickerOpen}
  onClose={handleCloseExercisePicker}
  onSelect={handleAddExercise}
/>

</div>
);
}