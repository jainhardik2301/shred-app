import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import Button from "../ui/Button";
import UpdateWeightModal from "./UpdateWeightModal";
import {
  formatWeight,
  weightToDisplay,
} from "../../utils/unitConversions";

export default function WeightUpdateCard() {
  const { appData, updateWeight } = useApp();

  const [open, setOpen] = useState(false);

  const currentWeight =
    Number(appData?.profile?.weight) || 0;

  const weightUnit =
    appData?.preferences?.weightUnit || "kg";

  return (
    <>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-bold">
          Current Weight
        </h2>

        <h1 className="mt-6 text-5xl font-bold text-emerald-400">
          {currentWeight > 0
            ? formatWeight(
                currentWeight,
                weightUnit
              )
            : `-- ${weightUnit}`}
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          {currentWeight > 0
            ? "Your latest recorded weight"
            : "No weight recorded yet"}
        </p>

        <Button
          className="mt-8"
          onClick={() => setOpen(true)}
        >
          {currentWeight > 0
            ? "Update Weight"
            : "Add Weight"}
        </Button>
      </div>

      <UpdateWeightModal
        open={open}
        currentWeight={
          currentWeight > 0
            ? weightToDisplay(
                currentWeight,
                weightUnit
              )
            : ""
        }
        weightUnit={weightUnit}
        onClose={() =>
          setOpen(false)
        }
        onSave={(weightKg) => {
          updateWeight(weightKg);
          setOpen(false);
        }}
      />
    </>
  );
}