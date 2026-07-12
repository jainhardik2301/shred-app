import {
  IconHome,
  IconSalad,
  IconChartBar,
  IconRobot,
  IconSettings,
} from "@tabler/icons-react";

const menu = [
  { icon: IconHome, label: "Dashboard" },
  { icon: IconSalad, label: "Nutrition" },
  { icon: IconChartBar, label: "Progress" },
  { icon: IconRobot, label: "Coach" },
  { icon: IconSettings, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-emerald-400">
          SHRED
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Track • Transform • Triumph
        </p>
      </div>

      <nav className="px-3">
        {menu.map((item) => (
          <button
            key={item.label}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-slate-800"
          >
            <item.icon size={22} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}