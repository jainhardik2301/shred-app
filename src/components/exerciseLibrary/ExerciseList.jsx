import { exerciseLibrary } from "../../data/exerciseLibrary";

export default function ExerciseList() {
  return (
    <div className="space-y-8">

      {Object.entries(exerciseLibrary).map(([group, exercises]) => (

        <section key={group}>

          <h2 className="mb-5 text-2xl font-bold text-white">
            {group}
          </h2>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {exercises.map((exercise) => (

              <div
                key={exercise.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-emerald-500"
              >

                <h3 className="text-xl font-semibold">
                  {exercise.name}
                </h3>

                <p className="mt-2 text-slate-400">
                  {exercise.equipment}
                </p>

                <div className="mt-5 flex items-center justify-between">

                  <span className="rounded-full bg-slate-800 px-3 py-1 text-sm">
                    {exercise.type}
                  </span>

                  <span className="font-semibold text-emerald-400">
                    {exercise.sets}
                  </span>

                </div>

              </div>

            ))}

          </div>

        </section>

      ))}

    </div>
  );
}