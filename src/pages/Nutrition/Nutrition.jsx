import { useState } from "react";
import { useApp } from "../../contexts/AppContext";

import FoodCard from "../../components/nutrition/FoodCard";
import FoodSearchModal from "../../components/nutrition/FoodSearchModal";
import NutritionInsights from "../../components/nutrition/NutritionInsights";

export default function NutritionDashboard() {
  const { appData, deleteMeal } = useApp();

  const [foodModalOpen, setFoodModalOpen] = useState(false);

  const meals = appData?.meals || [];

  const calories =
    Number(appData?.today?.calories) || 0;

  const protein =
    Number(appData?.today?.protein) || 0;

  const water =
    Number(appData?.today?.water) || 0;

  const calorieGoal =
    Number(appData?.goals?.calories) || 0;

  const proteinGoal =
    Number(appData?.goals?.protein) || 0;

  const waterGoal =
    Number(appData?.goals?.water) || 0;

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Nutrition
          </h1>

          <p className="mt-2 text-slate-400">
            Track today's nutrition intake
          </p>
        </div>

        <button
          onClick={() => setFoodModalOpen(true)}
          className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white transition hover:bg-emerald-600"
        >
          + Add Meal
        </button>
      </div>

      {/* NUTRITION SUMMARY */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <SummaryCard
          title="Calories"
          value={Math.round(calories)}
          goal={
            calorieGoal
              ? `Goal ${calorieGoal} kcal`
              : "No goal set"
          }
          valueClass="text-orange-400"
        />

        <SummaryCard
          title="Protein"
          value={`${protein.toFixed(1)} g`}
          goal={
            proteinGoal
              ? `Goal ${proteinGoal} g`
              : "No goal set"
          }
          valueClass="text-emerald-400"
        />

        <SummaryCard
          title="Water"
          value={`${water} L`}
          goal={
            waterGoal
              ? `Goal ${waterGoal} L`
              : "No goal set"
          }
          valueClass="text-sky-400"
        />

        <SummaryCard
          title="Meals"
          value={meals.length}
          goal={`${meals.length} food ${
            meals.length === 1 ? "item" : "items"
          }`}
          valueClass="text-violet-400"
        />

      </div>

      {/* TODAY'S MEALS */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Today's Meals
          </h2>

          <span className="text-slate-400">
            {meals.length} Food{" "}
            {meals.length === 1 ? "Item" : "Items"}
          </span>

        </div>

        {meals.length === 0 ? (

          <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-12 text-center">

            <p className="text-slate-400">
              No meals added yet.
            </p>

            <button
              onClick={() => setFoodModalOpen(true)}
              className="mt-4 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
            >
              + Add your first meal
            </button>

          </div>

        ) : (

          <div className="mt-6 space-y-3">

            {meals.map((meal, index) => (

              <FoodCard
                key={meal.id || index}
                meal={meal}
                index={index}
                onDelete={deleteMeal}
              />

            ))}

          </div>

        )}

      </div>

      {/* MACRO SUMMARY */}

      <div className="grid gap-6 md:grid-cols-3">

        <MacroCard
          title="Protein"
          value={`${protein.toFixed(1)} g`}
        />

        <MacroCard
          title="Carbohydrates"
          value={`${(
            Number(appData?.today?.carbs) || 0
          ).toFixed(1)} g`}
        />

        <MacroCard
          title="Fat"
          value={`${(
            Number(appData?.today?.fat) || 0
          ).toFixed(1)} g`}
        />

      </div>

      {/* DAILY INSIGHTS */}

      <NutritionInsights />

      {/* ADD MEAL MODAL */}

      <FoodSearchModal
        open={foodModalOpen}
        onClose={() => setFoodModalOpen(false)}
      />

    </div>
  );
}


/* SUMMARY CARD */

function SummaryCard({
  title,
  value,
  goal,
  valueClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <p className="text-slate-400">
        {title}
      </p>

      <h2
        className={`mt-4 text-4xl font-bold ${valueClass}`}
      >
        {value}
      </h2>

      <p className="mt-3 text-slate-500">
        {goal}
      </p>

    </div>
  );
}


/* MACRO CARD */

function MacroCard({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}