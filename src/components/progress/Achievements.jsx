const achievements = [
  {
    emoji: "🏅",
    title: "First Login",
    unlocked: true,
  },
  {
    emoji: "🥗",
    title: "First Meal Logged",
    unlocked: true,
  },
  {
    emoji: "💧",
    title: "Water Goal",
    unlocked: false,
  },
  {
    emoji: "🔥",
    title: "7 Day Streak",
    unlocked: false,
  },
];

export default function Achievements() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-bold">
        Achievements
      </h2>

      <div className="space-y-4">

        {achievements.map((item) => (

          <div
            key={item.title}
            className="flex items-center justify-between rounded-xl bg-slate-800 p-4"
          >

            <div className="flex items-center gap-3">

              <span className="text-2xl">
                {item.emoji}
              </span>

              <span>
                {item.title}
              </span>

            </div>

            <span
              className={
                item.unlocked
                  ? "text-emerald-400"
                  : "text-slate-500"
              }
            >
              {item.unlocked
                ? "Unlocked"
                : "Locked"}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}