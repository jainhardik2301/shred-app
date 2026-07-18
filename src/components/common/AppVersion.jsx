import { VERSION } from "../../constants/appConstants";

export default function AppVersion() {
  return (
    <div className="fixed bottom-4 right-4 rounded-full bg-slate-900 px-4 py-2 text-xs text-slate-500 shadow-lg">

      SHRED v{VERSION}

    </div>
  );
}