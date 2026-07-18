import { useState, useEffect } from "react";
import { useApp } from "../../contexts/AppContext";

import {
  weightToDisplay,
  weightToStorage,
  cmToFeetInches,
  feetInchesToCm,
} from "../../utils/unitConversions";

export default function ProfileSettings() {
  const { appData, setAppData } = useApp();

  const weightUnit =
    appData?.preferences?.weightUnit || "kg";

  const heightUnit =
    appData?.preferences?.heightUnit || "cm";

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    heightFeet: "",
    heightInches: "",
    weight: "",
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const heightCm =
      Number(appData?.profile?.height) || 0;

    const convertedHeight =
      cmToFeetInches(heightCm);

    setProfile({
      name:
        appData?.profile?.name || "",

      age:
        appData?.profile?.age || "",

      gender:
        appData?.profile?.gender || "",

      height:
        heightCm || "",

      heightFeet:
        heightCm
          ? convertedHeight.feet
          : "",

      heightInches:
        heightCm
          ? convertedHeight.inches
          : "",

      weight:
        appData?.profile?.weight
          ? weightToDisplay(
              appData.profile.weight,
              weightUnit
            )
          : "",
    });
  }, [
    appData?.profile,
    weightUnit,
    heightUnit,
  ]);

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSave(e) {
    e.preventDefault();

    const storedWeight =
      profile.weight === ""
        ? ""
        : weightToStorage(
            profile.weight,
            weightUnit
          );

    const storedHeight =
      heightUnit === "ft"
        ? feetInchesToCm(
            profile.heightFeet,
            profile.heightInches
          )
        : Number(profile.height);

    setAppData((prev) => ({
      ...prev,

      profile: {
        ...(prev.profile || {}),

        name:
          profile.name.trim(),

        age:
          profile.age === ""
            ? ""
            : Number(profile.age),

        gender:
          profile.gender,

        height:
          storedHeight === ""
            ? ""
            : Number(
                Number(
                  storedHeight
                ).toFixed(2)
              ),

        weight:
          storedWeight === ""
            ? ""
            : storedWeight,
      },
    }));

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div>
        <h2 className="text-2xl font-bold">
          Profile
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Manage your personal information.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <Field
          label="Name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Your name"
        />

        <Field
          label="Age"
          name="age"
          type="number"
          min="1"
          value={profile.age}
          onChange={handleChange}
          placeholder="Age"
        />

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Gender
          </label>

          <select
            name="gender"
            value={profile.gender}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
          >
            <option value="">
              Select gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>

            <option value="Prefer not to say">
              Prefer not to say
            </option>
          </select>
        </div>

        {heightUnit === "ft" ? (
          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Height (ft / in)
            </label>

            <div className="grid grid-cols-2 gap-3">
              <input
                name="heightFeet"
                type="number"
                min="0"
                value={
                  profile.heightFeet
                }
                onChange={handleChange}
                placeholder="Feet"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
              />

              <input
                name="heightInches"
                type="number"
                min="0"
                max="11"
                value={
                  profile.heightInches
                }
                onChange={handleChange}
                placeholder="Inches"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        ) : (
          <Field
            label="Height (cm)"
            name="height"
            type="number"
            min="1"
            value={profile.height}
            onChange={handleChange}
            placeholder="Height in cm"
          />
        )}

        <Field
          label={`Current Weight (${weightUnit})`}
          name="weight"
          type="number"
          min="1"
          step="0.1"
          value={profile.weight}
          onChange={handleChange}
          placeholder={`Weight in ${weightUnit}`}
        />

      </div>

      <div className="mt-6 flex items-center gap-4">

        <button
          type="submit"
          className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
        >
          Save Profile
        </button>

        {saved && (
          <span className="text-sm text-emerald-400">
            Profile saved
          </span>
        )}

      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
  step,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-400">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500"
      />
    </div>
  );
}