import user from "../../data/user";

export default function TodayChecklist() {
  const completed = user.tasks.filter(task => task.completed).length;
  const percentage = (completed / user.tasks.length) * 100;

  return (
    <div className="rounded-2xl bg-slate-900 p-8">
      <h2 className="text-2xl font-bold mb-8">
        Today's Checklist
      </h2>

      <div className="space-y-5">
        {user.tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">

              <div
                className={`h-6 w-6 rounded-full border-2 flex items-center justify-center
                ${
                  task.completed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-slate-500"
                }`}
              >
                {task.completed && (
                  <span className="text-white text-sm">
                    ✓
                  </span>
                )}
              </div>

              <span
                className={`${
                  task.completed
                    ? "text-white"
                    : "text-slate-400"
                }`}
              >
                {task.title}
              </span>

            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">

        <div className="flex justify-between mb-3">
          <span className="text-slate-400">
            Progress
          </span>

          <span>
            {completed} / {user.tasks.length}
          </span>
        </div>

        <div className="h-3 bg-slate-800 rounded-full">

          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}