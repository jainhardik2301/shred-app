import { useApp } from "../../contexts/AppContext";

export default function HabitTips() {
  const { appData } = useApp();

  const water = Number(appData?.today?.water) || 0;
  const steps = Number(appData?.today?.steps) || 0;
  const sleep = Number(appData?.today?.sleep) || 0;

  const waterGoal = Number(appData?.goals?.water) || 3.4;
  const stepsGoal = Number(appData?.goals?.steps) || 10000;

  const waterProgress =
    waterGoal > 0
      ? water / waterGoal
      : 0;

  const stepsProgress =
    stepsGoal > 0
      ? steps / stepsGoal
      : 0;

  const sleepProgress =
    sleep / 7;

  let title = "Keep Going";
  let message =
    "You're making good progress today. Keep building consistency.";

  if (
    waterProgress <= stepsProgress &&
    waterProgress <= sleepProgress &&
    waterProgress < 1
  ) {
    title = "Hydration Reminder";
    message =
      "Drink another glass of water to stay hydrated.";
  } else if (
    stepsProgress <= waterProgress &&
    stepsProgress <= sleepProgress &&
    stepsProgress < 1
  ) {
    title = "Time to Move";
    message =
      "A short walk can help you move closer to your daily step goal.";
  } else if (sleepProgress < 1) {
    title = "Recovery Reminder";
    message =
      "Aim for at least 7 hours of sleep to support recovery.";
  } else {
    title = "Daily Goals Complete";
    message =
      "Great work. You've completed your core daily habit goals.";
  }

  return (
    <div className="rounded-2xl border border-emerald-800 bg-emerald-950/20 p-6">
      <h2 className="text-xl font-bold">
        💡 {title}
      </h2>

      <p className="mt-5 text-slate-300">
        {message}
      </p>
    </div>
  );
}