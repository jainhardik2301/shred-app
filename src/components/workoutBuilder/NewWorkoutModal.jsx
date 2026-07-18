import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function NewWorkoutModal({
  open,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");

  return (
    <Modal
      open={open}
      title="Create Workout Plan"
      onClose={onClose}
    >
      <Input
        label="Workout Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="mt-8 flex justify-end gap-4">

        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          onClick={() => {
            if (!name.trim()) return;

            onSave({
              name,
              day: "Unassigned",
              exercises: [],
            });

            setName("");
          }}
        >
          Create
        </Button>

      </div>

    </Modal>
  );
}