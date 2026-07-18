import { useEffect, useState } from "react";
import { useApp } from "../../contexts/AppContext";

export default function PreferenceSettings() {
  const { appData, setAppData } = useApp();

  const [preferences, setPreferences] =
    useState({
      weightUnit: "kg",
      heightUnit: "cm",
    });

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    setPreferences({
      weightUnit:
        appData?.preferences?.weightUnit ||
        "kg",

      heightUnit:
        appData?.preferences?.heightUnit ||
        "cm",
    });
  }, [appData?.preferences]);

  function handleChange(e) {
    const { name, value } = e.target;

    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave() {
    setAppData((prev) => ({
      ...prev,

      preferences: {
        ...(prev.preferences || {}),
        ...preferences,
      },
    }));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <div>
        <h2 className="text-2xl font-bold">
          Preferences
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Customize how SHRED displays your data.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Weight Unit
          </label>

          <select
            name="weightUnit"
            value={preferences.weightUnit}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="kg">
              Kilograms (kg)
            </option>

            <option value="lb">
              Pounds (lb)
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Height Unit
          </label>

          <select
            name="heightUnit"
            value={preferences.heightUnit}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="cm">
              Centimeters (cm)
            </option>

            <option value="ft">
              Feet / Inches
            </option>
          </select>
        </div>

      </div>

      <div className="mt-6 flex items-center gap-4">

        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
        >
          Save Preferences
        </button>

        {saved && (
          <span className="text-sm text-emerald-400">
            Preferences saved
          </span>
        )}

      </div>
    </div>
  );
}