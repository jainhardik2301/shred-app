import { useApp } from "../../contexts/AppContext";

export default function WorkoutHistory() {
  const { appData } = useApp();

  const history =
    appData?.workoutHistory || [];

  // ---------------------------------
  // FORMAT DURATION
  // ---------------------------------

  function formatDuration(seconds) {
    const totalSeconds =
      Number(seconds) || 0;

    const hours =
      Math.floor(
        totalSeconds / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) /
          60
      );

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes} min`;
  }

  // ---------------------------------
  // FORMAT DATE
  // ---------------------------------

  function formatDate(dateValue) {
    if (!dateValue) {
      return "Date unavailable";
    }

    const date =
      new Date(dateValue);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "Date unavailable";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-2xl font-bold">
        Workout History
      </h2>

      <p className="mt-2 text-slate-400">
        Your recently completed workout sessions.
      </p>

      {history.length === 0 ? (

        <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
          No completed workouts yet.
        </div>

      ) : (

        <div className="mt-6 space-y-4">

          {[...history]
            .reverse()
            .slice(0, 10)
            .map(
              (
                session,
                index
              ) => {

                const duration =
                  session.durationSeconds ??
                  session.seconds ??
                  0;

                const calories =
                  Number(
                    session.calories
                  ) || 0;

                const totalSets =
                  Number(
                    session.totalSets
                  ) || 0;

                const completedSets =
                  Number(
                    session.completedSets
                  ) || 0;

                const completion =
                  session.completionPercentage ??
                  (
                    totalSets > 0
                      ? Math.round(
                          (
                            completedSets /
                            totalSets
                          ) * 100
                        )
                      : 0
                  );

                return (

                  <div
                    key={
                      session.id ||
                      `${session.completedAt}-${index}`
                    }
                    className="rounded-xl border border-slate-800 bg-slate-800 p-4"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* WORKOUT INFO */}

                      <div>

                        <h3 className="font-semibold text-white">
                          {session.name ||
                            session.planName ||
                            "Completed Workout"}
                        </h3>

                        {session.planName &&
                          session.name && (

                          <p className="mt-1 text-sm text-slate-400">
                            {session.planName}
                          </p>

                        )}

                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(
                            session.completedAt
                          )}
                        </p>

                      </div>

                      {/* STATS */}

                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm sm:grid-cols-4">

                        <div>

                          <p className="text-slate-400">
                            Duration
                          </p>

                          <p className="mt-1 font-semibold text-white">
                            {formatDuration(
                              duration
                            )}
                          </p>

                        </div>

                        <div>

                          <p className="text-slate-400">
                            Sets
                          </p>

                          <p className="mt-1 font-semibold text-white">
                            {completedSets}/
                            {totalSets}
                          </p>

                        </div>

                        <div>

                          <p className="text-slate-400">
                            Completion
                          </p>

                          <p className="mt-1 font-semibold text-emerald-400">
                            {completion}%
                          </p>

                        </div>

                        <div>

                          <p className="text-slate-400">
                            Calories
                          </p>

                          <p className="mt-1 font-semibold text-orange-400">
                            {calories} kcal
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

        </div>

      )}

    </div>
  );
}