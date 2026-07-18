import ExerciseFilters from "./ExerciseFilters";
import ExerciseList from "./ExerciseList";

export default function ExerciseLibrary() {
  return (
    <div className="space-y-8">

      <ExerciseFilters />

      <ExerciseList />

    </div>
  );
}