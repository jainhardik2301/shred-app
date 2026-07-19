import {
  useEffect,
  useState,
} from "react";

import Modal from "../ui/Modal";

export default function ExercisePicker({
  open,
  onClose,
  onSelect,
}) {
  const [search, setSearch] =
    useState("");

  const [exercises, setExercises] =
    useState([]);

  const [isSearching, setIsSearching] =
    useState(false);

  const [searchError, setSearchError] =
    useState("");

  const [
    selectedExercise,
    setSelectedExercise,
  ] = useState(null);

  const [sets, setSets] =
    useState(3);

  const [reps, setReps] =
    useState("8-12");

  // ---------------------------------
  // RESET MODAL
  // ---------------------------------

  useEffect(() => {
    if (!open) {
      setSearch("");
      setExercises([]);
      setSearchError("");
      setIsSearching(false);
      setSelectedExercise(null);
      setSets(3);
      setReps("8-12");
    }
  }, [open]);

  // ---------------------------------
  // DYNAMIC AI EXERCISE SEARCH
  // ---------------------------------

  useEffect(() => {
    if (!open) return;

    // Don't search while configuring
    if (selectedExercise) return;

    const query = search.trim();

    if (query.length < 2) {
      setExercises([]);
      setSearchError("");
      return;
    }

    const controller =
      new AbortController();

    const timer = setTimeout(
      async () => {
        try {
          setIsSearching(true);
          setSearchError("");

          const response =
            await fetch(
              `http://localhost:3001/api/exercise-search?q=${encodeURIComponent(
                query
              )}`,
              {
                signal:
                  controller.signal,
              }
            );

          if (!response.ok) {
            throw new Error(
              "Exercise search failed."
            );
          }

          const data =
            await response.json();

          setExercises(
            Array.isArray(
              data.exercises
            )
              ? data.exercises
              : []
          );
        } catch (error) {
          if (
            error.name !==
            "AbortError"
          ) {
            console.error(
              "Exercise search error:",
              error
            );

            setExercises([]);

            setSearchError(
              "Unable to search exercises right now."
            );
          }
        } finally {
          if (
            !controller.signal.aborted
          ) {
            setIsSearching(false);
          }
        }
      },
      500
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    search,
    open,
    selectedExercise,
  ]);

  // ---------------------------------
  // SELECT EXERCISE
  // ---------------------------------

  function handleSelect(exercise) {
    setSelectedExercise(
      exercise
    );

    setSets(
      Number(
        exercise.defaultSets
      ) || 3
    );

    setReps(
      String(
        exercise.defaultReps ||
        "8-12"
      )
    );
  }

  // ---------------------------------
  // ADD EXERCISE
  // ---------------------------------

  function handleAddExercise() {
    if (!selectedExercise) {
      return;
    }

    const finalSets =
      Math.max(
        1,
        Number(sets) || 1
      );

    const finalReps =
      String(reps).trim() ||
      "8-12";

    const exerciseToAdd = {
      ...selectedExercise,

      sets: finalSets,

      reps: finalReps,
    };

    onSelect(
      exerciseToAdd
    );

    // Reset picker after adding
    setSelectedExercise(null);
    setSearch("");
    setExercises([]);
    setSets(3);
    setReps("8-12");
  }

  // ---------------------------------
  // BACK TO SEARCH
  // ---------------------------------

  function handleBack() {
    setSelectedExercise(null);
  }

  // ---------------------------------
  // CONFIGURE EXERCISE SCREEN
  // ---------------------------------

  if (selectedExercise) {
    return (
      <Modal
        open={open}
        title="Configure Exercise"
        onClose={onClose}
      >
        <div className="space-y-6">

          {/* EXERCISE DETAILS */}

          <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">

            <h3 className="text-lg font-bold text-white">
              {
                selectedExercise.name
              }
            </h3>

            <p className="mt-1 text-sm font-medium text-emerald-400">
              {
                selectedExercise.primaryMuscle
              }
            </p>

            {selectedExercise
              .secondaryMuscles
              ?.length > 0 && (
              <p className="mt-1 text-xs text-slate-400">
                Also targets:{" "}
                {selectedExercise.secondaryMuscles.join(
                  ", "
                )}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">

              <span className="rounded-lg bg-slate-700 px-3 py-1 text-xs text-slate-300">
                {
                  selectedExercise.equipment
                }
              </span>

              <span className="rounded-lg bg-slate-700 px-3 py-1 text-xs capitalize text-slate-300">
                {
                  selectedExercise.difficulty
                }
              </span>

              <span className="rounded-lg bg-slate-700 px-3 py-1 text-xs capitalize text-slate-300">
                {
                  selectedExercise.category
                }
              </span>

            </div>

            {selectedExercise.instructions && (
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                {
                  selectedExercise.instructions
                }
              </p>
            )}

          </div>

          {/* SETS */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Sets
            </label>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setSets(
                    Math.max(
                      1,
                      Number(sets) -
                        1
                    )
                  )
                }
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-xl font-bold text-white transition hover:bg-slate-700"
              >
                −
              </button>

              <input
                type="number"
                min="1"
                max="20"
                value={sets}
                onChange={(e) =>
                  setSets(
                    e.target.value
                  )
                }
                className="h-12 w-24 rounded-xl border border-slate-700 bg-slate-800 text-center text-lg font-bold text-white outline-none focus:border-emerald-500"
              />

              <button
                type="button"
                onClick={() =>
                  setSets(
                    Number(sets) +
                      1
                  )
                }
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-xl font-bold text-white transition hover:bg-slate-700"
              >
                +
              </button>

            </div>
          </div>

          {/* REPS */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Reps
            </label>

            <input
              type="text"
              value={reps}
              onChange={(e) =>
                setReps(
                  e.target.value
                )
              }
              placeholder="e.g. 8-12"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              You can enter a single
              number such as 10, a range
              such as 8-12, or a duration
              such as 30 sec.
            </p>

          </div>

          {/* PREVIEW */}

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">

            <p className="text-xs font-medium uppercase tracking-wide text-emerald-400">
              Workout Target
            </p>

            <p className="mt-1 text-lg font-bold text-white">
              {sets || 0} ×{" "}
              {reps || "—"}
            </p>

          </div>

          {/* ACTIONS */}

          <div className="flex gap-3">

            <button
              type="button"
              onClick={
                handleBack
              }
              className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-700"
            >
              Back
            </button>

            <button
              type="button"
              onClick={
                handleAddExercise
              }
              className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white transition hover:bg-emerald-600"
            >
              Add to Workout
            </button>

          </div>

        </div>
      </Modal>
    );
  }

  // ---------------------------------
  // SEARCH SCREEN
  // ---------------------------------

  return (
    <Modal
      open={open}
      title="Add Exercise"
      onClose={onClose}
    >
      <div className="space-y-5">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search exercises, muscles, equipment..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          autoFocus
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
        />

        {/* INITIAL STATE */}

        {!search.trim() && (
          <div className="py-8 text-center">

            <p className="text-slate-400">
              Search for any exercise
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Try "chest",
              "rear delts",
              "beginner back" or
              "legs without equipment".
            </p>

          </div>
        )}

        {/* SEARCHING */}

        {isSearching && (
          <div className="py-8 text-center text-sm text-slate-400">
            Searching exercises...
          </div>
        )}

        {/* ERROR */}

        {searchError && (
          <div className="py-8 text-center text-sm text-red-400">
            {searchError}
          </div>
        )}

        {/* NO RESULTS */}

        {!isSearching &&
          !searchError &&
          search.trim().length >=
            2 &&
          exercises.length ===
            0 && (
            <div className="py-8 text-center text-sm text-slate-400">
              No exercises found.
            </div>
          )}

        {/* RESULTS */}

        {!isSearching &&
          exercises.length > 0 && (

          <div className="max-h-[500px] space-y-3 overflow-y-auto">

            {exercises.map(
              (exercise) => (

                <div
                  key={
                    exercise.id
                  }
                  className="rounded-xl border border-slate-700 bg-slate-800 p-4"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0 flex-1">

                      <h4 className="font-semibold text-white">
                        {
                          exercise.name
                        }
                      </h4>

                      <p className="mt-1 text-sm text-emerald-400">
                        {
                          exercise.primaryMuscle
                        }
                      </p>

                      {exercise
                        .secondaryMuscles
                        ?.length >
                        0 && (

                        <p className="mt-1 text-xs text-slate-400">
                          Also targets:{" "}
                          {exercise.secondaryMuscles.join(
                            ", "
                          )}
                        </p>

                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleSelect(
                          exercise
                        )
                      }
                      className="shrink-0 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-600"
                    >
                      Select
                    </button>

                  </div>

                  {/* DETAILS */}

                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="rounded-lg bg-slate-700 px-2 py-1 text-xs text-slate-300">
                      {
                        exercise.equipment
                      }
                    </span>

                    <span className="rounded-lg bg-slate-700 px-2 py-1 text-xs capitalize text-slate-300">
                      {
                        exercise.difficulty
                      }
                    </span>

                    <span className="rounded-lg bg-slate-700 px-2 py-1 text-xs capitalize text-slate-300">
                      {
                        exercise.category
                      }
                    </span>

                  </div>

                  {/* AI SUGGESTION */}

                  <p className="mt-3 text-sm text-slate-400">
                    Suggested:{" "}
                    {
                      exercise.defaultSets
                    }{" "}
                    sets ×{" "}
                    {
                      exercise.defaultReps
                    }
                  </p>

                  {/* INSTRUCTIONS */}

                  {exercise.instructions && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      {
                        exercise.instructions
                      }
                    </p>
                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>
    </Modal>
  );
}