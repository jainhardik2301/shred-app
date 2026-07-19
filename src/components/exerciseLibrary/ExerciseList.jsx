import { useEffect, useState } from "react";

export default function ExerciseList() {
  const [search, setSearch] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setExercises([]);
      setSearchError("");
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError("");

        const response = await fetch(
          `http://localhost:3001/api/exercise-search?q=${encodeURIComponent(
            query
          )}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Exercise search failed.");
        }

        const data = await response.json();

        setExercises(
          Array.isArray(data.exercises)
            ? data.exercises
            : []
        );
      } catch (error) {
        if (error.name !== "AbortError") {
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
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  return (
    <div className="space-y-6">

      {/* SEARCH */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
        <input
          type="text"
          placeholder="Search any exercise, muscle or equipment..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500"
        />
      </div>

      {/* INITIAL STATE */}

      {search.trim().length < 2 && (
        <div className="py-12 text-center">

          <p className="text-lg font-semibold text-slate-300">
            Search for any exercise
          </p>

          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
            Search by exercise, muscle group,
            equipment or describe what you're
            looking for.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">

            {[
              "Chest",
              "Back",
              "Biceps",
              "Shoulders",
              "Legs",
              "Bodyweight",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() =>
                  setSearch(suggestion)
                }
                className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
              >
                {suggestion}
              </button>
            ))}

          </div>

        </div>
      )}

      {/* SEARCHING */}

      {isSearching && (
        <div className="py-12 text-center text-slate-400">
          Searching exercises...
        </div>
      )}

      {/* ERROR */}

      {searchError && (
        <div className="py-12 text-center text-red-400">
          {searchError}
        </div>
      )}

      {/* NO RESULTS */}

      {!isSearching &&
        !searchError &&
        search.trim().length >= 2 &&
        exercises.length === 0 && (

          <div className="py-12 text-center text-slate-400">
            No exercises found.
          </div>

        )}

      {/* RESULTS */}

      {!isSearching &&
        !searchError &&
        exercises.length > 0 && (

          <div>

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h3 className="text-xl font-bold text-white">
                  Search Results
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {exercises.length} exercises found
                  for "{search}"
                </p>
              </div>

            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {exercises.map((exercise) => (

                <div
                  key={exercise.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                >

                  {/* NAME */}

                  <h4 className="text-lg font-bold text-white">
                    {exercise.name}
                  </h4>

                  {/* PRIMARY MUSCLE */}

                  <p className="mt-2 text-sm font-medium text-emerald-400">
                    {exercise.primaryMuscle}
                  </p>

                  {/* SECONDARY MUSCLES */}

                  {exercise.secondaryMuscles?.length >
                    0 && (

                    <p className="mt-1 text-xs text-slate-500">
                      Also targets:{" "}
                      {exercise.secondaryMuscles.join(
                        ", "
                      )}
                    </p>

                  )}

                  {/* TAGS */}

                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {exercise.equipment}
                    </span>

                    <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs capitalize text-slate-300">
                      {exercise.category}
                    </span>

                    <span className="rounded-lg bg-slate-800 px-3 py-1 text-xs capitalize text-slate-300">
                      {exercise.difficulty}
                    </span>

                  </div>

                  {/* SUGGESTED SETS */}

                  <div className="mt-4 text-sm font-semibold text-emerald-400">
                    {exercise.defaultSets} ×{" "}
                    {exercise.defaultReps}
                  </div>

                  {/* INSTRUCTIONS */}

                  {exercise.instructions && (

                    <p className="mt-4 text-sm leading-relaxed text-slate-400">
                      {exercise.instructions}
                    </p>

                  )}

                  {/* SOURCE */}

                  <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-600">
                    SHRED AI Exercise Library
                  </div>

                </div>

              ))}

            </div>

          </div>

        )}

    </div>
  );
}