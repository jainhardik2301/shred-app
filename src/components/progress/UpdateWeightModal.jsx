import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import {
  weightToStorage,
} from "../../utils/unitConversions";

export default function UpdateWeightModal({
  open,
  onClose,
  onSave,
  currentWeight,
  weightUnit = "kg",
}) {
  const [weight, setWeight] =
    useState(currentWeight);

  useEffect(() => {
    setWeight(currentWeight);
  }, [currentWeight, open]);

  function handleSave() {
    const value = Number(weight);

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return;
    }

    const weightKg =
      weightToStorage(
        value,
        weightUnit
      );

    onSave(weightKg);
  }

  return (
    <Modal
      open={open}
      title="Update Weight"
      onClose={onClose}
    >
      <Input
        label={`Current Weight (${weightUnit})`}
        type="number"
        step="0.1"
        min="1"
        value={weight}
        onChange={(e) =>
          setWeight(e.target.value)
        }
      />

      <div className="mt-8 flex justify-end gap-4">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSave}
        >
          Save Weight
        </Button>
      </div>
    </Modal>
  );
}