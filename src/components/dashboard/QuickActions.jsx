import { useNavigate } from "react-router-dom";
import { useApp } from "../../contexts/AppContext";
import Button from "../ui/Button";

export default function QuickActions() {
  const navigate = useNavigate();
  const { setAppData } = useApp();

  function handleLogWater() {
    setAppData((prev) => ({
      ...prev,

      today: {
        ...(prev.today || {}),

        water:
          (Number(prev.today?.water) || 0) +
          0.25,
      },
    }));
  }

  return (
    <div className="mt-8 rounded-2xl bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-bold">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-4">

        <Button
          onClick={() =>
            navigate("/nutrition")
          }
        >
          Add Meal
        </Button>

        <Button
          variant="secondary"
          onClick={handleLogWater}
        >
          Log Water
        </Button>

        <Button
          variant="info"
          onClick={() =>
            navigate("/progress")
          }
        >
          Update Weight
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            navigate("/progress")
          }
        >
          View Progress
        </Button>

      </div>

    </div>
  );
}