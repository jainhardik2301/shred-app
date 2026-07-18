import { Menu } from "lucide-react";
import { useApp } from "../contexts/AppContext";

import {
  formatWeight,
} from "../utils/unitConversions";

export default function Topbar({
  onMenuClick,
}) {
  const { appData } = useApp();

  if (!appData?.profile) {
    return null;
  }

  const profile =
    appData.profile || {};

  const name =
    profile.name || "User";

  const weightUnit =
    appData?.preferences?.weightUnit ||
    "kg";

  const hour =
    new Date().getHours();

  let greeting =
    "Good Evening";

  if (hour < 12) {
    greeting =
      "Good Morning";
  } else if (hour < 18) {
    greeting =
      "Good Afternoon";
  }

  const today =
    new Date().toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

  const targetWeight =
    Number(
      appData?.goals?.targetWeight
    ) || 0;

  return (
    <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-800 bg-slate-900 px-4 py-4 sm:px-6 lg:px-8">
      {/* Left */}

      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="shrink-0 rounded-xl p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={26} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold sm:text-2xl lg:text-3xl">
            {greeting}, {name} 👋
          </h2>

          <p className="mt-1 hidden text-sm text-slate-400 sm:block">
            {today}
          </p>
        </div>
      </div>

      {/* Right */}

      <div className="flex shrink-0 items-center gap-3">
        <div className="hidden text-right md:block">
          <h3 className="font-semibold">
            {name}
          </h3>

          <p className="text-sm text-slate-400">
            Goal:{" "}
            {targetWeight > 0
              ? formatWeight(
                  targetWeight,
                  weightUnit
                )
              : "—"}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-base font-bold sm:h-12 sm:w-12 sm:text-lg lg:h-14 lg:w-14 lg:text-xl">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}