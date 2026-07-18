import Modal from "../ui/Modal";
import { exerciseLibrary } from "../../data/exerciseLibrary";

export default function ExercisePicker({
  open,
  onClose,
  onSelect,
}) {

  return (

    <Modal
      open={open}
      title="Exercise Library"
      onClose={onClose}
    >

      <div className="max-h-[500px] overflow-y-auto">

        <div className="space-y-8">

          {Object.entries(exerciseLibrary).map(
            ([group, exercises]) => (

              <div key={group}>

                <h3 className="mb-4 text-xl font-bold">

                  {group}

                </h3>

                <div className="space-y-3">

                  {exercises.map((exercise) => (

                    <div
                      key={exercise.id}
                      className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-4"
                    >

                      <div>

                        <h4 className="font-semibold">

                          {exercise.name}

                        </h4>

                        <p className="text-sm text-slate-400">

                          {exercise.sets}

                        </p>

                      </div>

                      <button
                        onClick={() => onSelect(exercise)}
                        className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white hover:bg-emerald-600"
                      >
                        Add
                      </button>

                    </div>

                  ))}

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </Modal>

  );
}