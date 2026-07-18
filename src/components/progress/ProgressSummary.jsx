import ProgressStats from "./ProgressStats";
import WeightHistory from "./WeightHistory";
import BodyMeasurements from "./BodyMeasurements";
import Achievements from "./Achievements";

export default function ProgressSummary() {
  return (
    <div className="space-y-8">

      <ProgressStats />

      <div className="grid grid-cols-2 gap-6">

        <WeightHistory />

        <BodyMeasurements />

      </div>

      <Achievements />

    </div>
  );
}