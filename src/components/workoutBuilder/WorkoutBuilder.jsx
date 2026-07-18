import { useState } from "react";
import WorkoutPlans from "./WorkoutPlans";
import WorkoutPlanEditor from "./WorkoutPlanEditor";
import WorkoutScheduler from "./WorkoutScheduler";

export default function WorkoutBuilder() {
  const [selectedPlan, setSelectedPlan] =
    useState(null);

  return (
    <div className="space-y-8">

      <WorkoutScheduler />

      <WorkoutPlans
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
      />

      {selectedPlan && (

        <WorkoutPlanEditor
          plan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />

      )}

    </div>
  );
}