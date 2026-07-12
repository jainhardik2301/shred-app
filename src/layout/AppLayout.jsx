import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Dashboard from "../pages/Dashboard/Dashboard";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-auto p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}