import { useApp } from "../../contexts/AppContext";

export default function WorkoutHistory() {
  const { appData } = useApp();

  const history =
    appData?.workoutHistory || [];

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

        <div className="mt-6 space-y-3">

          {[...history]
            .reverse()
            .slice(0, 10)
            .map((session) => (

              <div
                key={session.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-800 p-4"
              >

                <div>

                  <h3 className="font-semibold">
                    {session.planName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    {new Date(
                      session.completedAt
                    ).toLocaleDateString()}
                  </p>

                </div>

                <div className="flex gap-6 text-sm">

                  <div>
                    <p className="text-slate-400">
                      Duration
                    </p>

                    <p className="font-semibold">
                      {Math.floor(
                        session.seconds / 60
                      )} min
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Volume
                    </p>

                    <p className="font-semibold">
                      {session.totalVolume.toLocaleString()} kg
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Calories
                    </p>

                    <p className="font-semibold">
                      {session.calories} kcal
                    </p>
                  </div>

                </div>

              </div>

            ))}

        </div>

      )}

    </div>
  );
}