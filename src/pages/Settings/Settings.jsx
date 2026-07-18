import ProfileSettings from "../../components/settings/ProfileSettings";
import GoalSettings from "../../components/settings/GoalSettings";
import PreferenceSettings from "../../components/settings/PreferenceSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import DataSettings from "../../components/settings/DataSettings";

export default function Settings() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your profile, goals and SHRED preferences.
        </p>
      </div>

      <ProfileSettings />

      <GoalSettings />

      <PreferenceSettings />

      <SecuritySettings />

      <DataSettings />

    </div>
  );
}