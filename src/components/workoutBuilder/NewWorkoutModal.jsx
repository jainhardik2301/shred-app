import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function NewWorkoutModal({
  open,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");

  function handleClose() {
    setName("");
    onClose();
  }

  function handleCreate() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const planId = `plan-${Date.now()}`;

    const newPlan = {
      id: planId,

      name: trimmedName,

      source: "user_created",

      // Custom plans are NOT automatically active.
      // User will explicitly choose which plan is active.
      isActive: false,

      createdAt: new Date().toISOString(),

      days: DAYS.map((day, index) => ({
        id: `${planId}-day-${index}`,

        day,

        name: "Recovery",

        isRestDay: true,

        exercises: [],
      })),
    };

    onSave(newPlan);

    setName("");
  }

  return (
    <Modal
      open={open}
      title="Create Workout Plan"
      onClose={handleClose}
    >
      <Input
        label="Workout Plan Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
        placeholder="e.g. My Strength Plan"
      />

      <p className="mt-3 text-sm text-slate-400">
        Your new plan will include Monday through Sunday.
        You can customize workout days and add exercises
        after creating it.
      </p>

      <div className="mt-8 flex justify-end gap-4">

        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          onClick={handleCreate}
        >
          Create Plan
        </Button>

      </div>

    </Modal>
  );
}