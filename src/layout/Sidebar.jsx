import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  Home,
  UtensilsCrossed,
  CalendarDays,
  Dumbbell,
  BarChart3,
  Bot,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useAuth,
} from "../contexts/AuthContext";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: Home,
  },
  {
    name: "Nutrition",
    path: "/nutrition",
    icon: UtensilsCrossed,
  },
  {
    name: "Habits",
    path: "/habits",
    icon: CalendarDays,
  },
  {
    name: "Workout",
    path: "/workout",
    icon: Dumbbell,
  },
  {
    name: "Progress",
    path: "/progress",
    icon: BarChart3,
  },
  {
    name: "Coach",
    path: "/coach",
    icon: Bot,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  open = false,
  onClose,
}) {
  return (
    <>
      {/* Desktop Sidebar */}

      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-900 lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}

      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-800 bg-slate-900 shadow-2xl transition-transform duration-300 lg:hidden ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div>
            <h1 className="text-3xl font-black tracking-wide text-emerald-400">
              SHRED
            </h1>

            <p className="mt-1 text-xs text-slate-400">
              Track • Transform • Triumph
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <SidebarNavigation
          onNavigate={onClose}
        />
      </aside>
    </>
  );
}


function SidebarContent() {
  return (
    <>
      <div className="border-b border-slate-800 p-8">
        <h1 className="text-5xl font-black tracking-wide text-emerald-400">
          SHRED
        </h1>

        <p className="mt-2 text-slate-400">
          Track • Transform • Triumph
        </p>
      </div>

      <SidebarNavigation />
    </>
  );
}


function SidebarNavigation({
  onNavigate,
}) {
  const { logout } = useAuth();

  const navigate =
    useNavigate();

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();

      if (onNavigate) {
        onNavigate();
      }

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Failed to sign out:",
        error
      );

      setLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">

      {/* NAVIGATION */}

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon =
            item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({
                isActive,
              }) =>
                `flex items-center gap-4 rounded-xl px-5 py-4 transition ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={22} />

              <span className="text-lg font-medium">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* SIGN OUT */}

      <div className="border-t border-slate-800 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut size={22} />

          <span className="text-lg font-medium">
            {loggingOut
              ? "Signing out..."
              : "Sign Out"}
          </span>
        </button>
      </div>

    </div>
  );
}