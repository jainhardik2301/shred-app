import { useApp } from "../../contexts/AppContext";

export default function TodayChecklist() {
  const { appData } = useApp();

  if (!appData) return null;

  const today = appData?.today || {};
  const goals = appData?.goals || {};

  const stepsGoal =
    Number(goals.steps) ||
    Number(goals.stepGoal) ||
    0;

  const tasks = [
    {
      id: 1,
      title: "Hit your calorie target",
      completed:
        Number(goals.calories) > 0 &&
        Number(today.calories) >=
          Number(goals.calories),
    },
    {
      id: 2,
      title: "Reach your protein goal",
      completed:
        Number(goals.protein) > 0 &&
        Number(today.protein) >=
          Number(goals.protein),
    },
    {
      id: 3,
      title: "Drink enough water",
      completed:
        Number(goals.water) > 0 &&
        Number(today.water) >=
          Number(goals.water),
    },
    {
      id: 4,
      title: "Complete your daily steps",
      completed:
        stepsGoal > 0 &&
        Number(today.steps) >= stepsGoal,
    },
    {
      id: 5,
      title: "Sleep at least 8 hours",
      completed:
        Number(today.sleep) >= 8,
    },
  ];

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const percentage =
    (completed / tasks.length) * 100;

  return (
    <div className="mt-8 rounded-2xl bg-slate-900 p-8">
      <h2 className="mb-8 text-2xl font-bold">
        Today's Checklist
      </h2>

      <div className="space-y-5">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  task.completed
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-slate-500"
                }`}
              >
                {task.completed && (
                  <span className="text-sm text-white">
                    ✓
                  </span>
                )}
              </div>

              <span
                className={
                  task.completed
                    ? "text-white"
                    : "text-slate-400"
                }
              >
                {task.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex justify-between">
          <span className="text-slate-400">
            Progress
          </span>

          <span>
            {completed} / {tasks.length}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}