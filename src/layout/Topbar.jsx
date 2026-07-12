import user from "../data/user";

export default function Topbar() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-5">

      <div>
        <h2 className="text-3xl font-bold">
          {greeting}, {user.profile.name} 👋
        </h2>

        <p className="mt-1 text-slate-400">
          {today}
        </p>
      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">
          <h3 className="font-semibold">
            {user.profile.name}
          </h3>

          <p className="text-sm text-slate-400">
            Goal: {user.profile.targetWeight} kg
          </p>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-xl font-bold">
          {user.profile.name.charAt(0)}
        </div>

      </div>

    </header>
  );
}