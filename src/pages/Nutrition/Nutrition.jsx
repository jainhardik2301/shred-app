import { useState } from "react";
import { useApp } from "../../contexts/AppContext";

import FoodCard from "../../components/nutrition/FoodCard";
import FoodSearchModal from "../../components/nutrition/FoodSearchModal";
import NutritionInsights from "../../components/nutrition/NutritionInsights";
import { generateNutritionPlan } from "../../services/nutritionPlanService";

export default function NutritionDashboard() {
  const { appData, setAppData, deleteMeal, updateMeal } = useApp();

  const [foodModalOpen, setFoodModalOpen] = useState(false);
const [activeTab, setActiveTab] = useState("tracking");
const [selectedMealDay, setSelectedMealDay] = useState("Monday");
const [isRegeneratingNutrition, setIsRegeneratingNutrition] =
  useState(false);

const [nutritionPlanError, setNutritionPlanError] =
  useState("");
  const [editingMeal, setEditingMeal] = useState(null);
const [editingIndex, setEditingIndex] = useState(null);

  const meals = appData?.meals || [];

  const nutritionPlan =
  appData?.nutritionPlan || null;

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

  const handleRegenerateNutritionPlan = async () => {
  try {
    setIsRegeneratingNutrition(true);
    setNutritionPlanError("");

    const onboarding =
      appData?.onboardingProfile || {};

    const assessment =
      appData?.assessment || {};

    if (!Object.keys(onboarding).length) {
      throw new Error(
        "Your onboarding profile could not be found."
      );
    }

    const newNutritionPlan =
      await generateNutritionPlan(
        onboarding,
        assessment
      );

    setAppData((prev) => ({
      ...prev,
      nutritionPlan: newNutritionPlan,
    }));

    setSelectedMealDay("Monday");
  } catch (error) {
    console.error(
      "Nutrition Plan Regeneration Error:",
      error
    );

    setNutritionPlanError(
      error.message ||
        "Unable to regenerate your nutrition plan."
    );
  } finally {
    setIsRegeneratingNutrition(false);
  }
};
  
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

        {activeTab === "tracking" && (
  <button
    onClick={() => setFoodModalOpen(true)}
    className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white transition hover:bg-emerald-600"
        >
    + Add Meal
  </button>
)}
              </div>

      {/* NUTRITION TABS */}

<div className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1">

  <button
    type="button"
    onClick={() => setActiveTab("tracking")}
    className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
      activeTab === "tracking"
        ? "bg-emerald-500 text-slate-950"
        : "text-slate-400 hover:text-white"
    }`}
  >
    Today's Tracking
  </button>

  <button
    type="button"
    onClick={() => setActiveTab("plan")}
    className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
      activeTab === "plan"
        ? "bg-violet-600 text-white"
        : "text-slate-400 hover:text-white"
    }`}
  >
    ✨ My Nutrition Plan
  </button>

</div>

{activeTab === "tracking" && (
  <>
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
  onEdit={(meal, index) => {
    setEditingMeal(meal);
    setEditingIndex(index);
  }}
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

        </>
)}
      {activeTab === "plan" && (
  <div className="space-y-6">

    {!nutritionPlan ? (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
        <h2 className="text-xl font-bold">
          No Nutrition Plan Yet
        </h2>

        <p className="mt-2 text-slate-400">
          Complete your personalized assessment to generate your AI nutrition plan.
        </p>
      </div>
    ) : (
      <>

        {/* PLAN OVERVIEW */}
        <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-6">

  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

    <div>
      <p className="text-sm font-semibold text-violet-400">
        ✨ AI PERSONALIZED
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        {nutritionPlan.name}
      </h2>

      <p className="mt-3 max-w-4xl leading-7 text-slate-300">
        {nutritionPlan.summary}
      </p>
    </div>

    <button
      type="button"
      onClick={handleRegenerateNutritionPlan}
      disabled={isRegeneratingNutrition}
      className="shrink-0 rounded-xl border border-violet-500/50 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isRegeneratingNutrition
        ? "Regenerating..."
        : "↻ Regenerate Plan"}
    </button>

  </div>

  {nutritionPlanError && (
    <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
      {nutritionPlanError}
    </div>
  )}

</div>


        {/* DAILY TARGETS */}
        {nutritionPlan.dailyTargets && (
          <div>
            <h2 className="mb-4 text-xl font-bold">
              Your Daily Targets
            </h2>

            <div className="grid gap-4 md:grid-cols-3">

              <PlanTarget
                title="Calories"
                value={`${nutritionPlan.dailyTargets.calories || "--"} kcal`}
              />

              <PlanTarget
                title="Protein"
                value={`${nutritionPlan.dailyTargets.protein || "--"} g`}
              />

              <PlanTarget
                title="Water"
                value={`${nutritionPlan.dailyTargets.water || "--"} L`}
              />

            </div>
          </div>
        )}


        {/* MEAL STRUCTURE */}
        {nutritionPlan.mealStructure && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold">
              Recommended Meal Structure
            </h2>

            <p className="mt-2 text-emerald-400">
              {nutritionPlan.mealStructure.mealsPerDay} meals per day
            </p>

            <p className="mt-3 leading-7 text-slate-300">
              {nutritionPlan.mealStructure.description}
            </p>
          </div>
        )}


        {/* 7-DAY MEAL PLAN */}
{nutritionPlan.weeklyMealPlan?.length > 0 && (
  <div>
    <div className="mb-4">
      <h2 className="text-xl font-bold">
        Your 7-Day Meal Plan
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Select a day to view your personalized meals.
      </p>
    </div>

    {/* DAY SELECTOR */}
    <div className="mb-6 grid grid-cols-4 gap-2 md:grid-cols-7">
      {nutritionPlan.weeklyMealPlan.map((dayPlan) => (
        <button
          key={dayPlan.day}
          type="button"
          onClick={() => setSelectedMealDay(dayPlan.day)}
          className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
            selectedMealDay === dayPlan.day
              ? "border-emerald-500 bg-emerald-500 text-slate-950"
              : "border-slate-700 bg-slate-900 text-slate-300 hover:border-emerald-500/50"
          }`}
        >
          {dayPlan.day.slice(0, 3)}
        </button>
      ))}
    </div>

    {/* SELECTED DAY MEALS */}
    {nutritionPlan.weeklyMealPlan
      .filter(
        (dayPlan) =>
          dayPlan.day === selectedMealDay
      )
      .map((dayPlan) => (
        <div key={dayPlan.day}>

          <h3 className="mb-4 text-lg font-bold text-emerald-400">
            {dayPlan.day}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            {dayPlan.meals?.map((meal, index) => (
              <div
                key={`${dayPlan.day}-${meal.meal}-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <h4 className="font-bold text-emerald-400">
                  {meal.meal}
                </h4>

                <div className="mt-3 space-y-2">
                  {meal.foods?.map(
                    (food, foodIndex) => (
                      <p
                        key={foodIndex}
                        className="text-sm text-slate-300"
                      >
                        • {food}
                      </p>
                    )
                  )}
                </div>

                {meal.guidance && (
                  <p className="mt-4 border-t border-slate-800 pt-4 text-sm leading-6 text-slate-500">
                    {meal.guidance}
                  </p>
                )}

              </div>
            ))}

          </div>

        </div>
      ))}

  </div>
)}

        {/* PERSONALIZED STRATEGIES */}
        <div className="grid gap-5 lg:grid-cols-2">

          <PlanSection
            title="Protein Strategy"
            items={nutritionPlan.proteinStrategy}
          />

          <PlanSection
            title="Hydration Strategy"
            items={nutritionPlan.hydrationStrategy}
          />

          <PlanSection
            title="Craving Control"
            items={nutritionPlan.cravingStrategy}
          />

          <PlanSection
            title="Eating Out Strategy"
            items={nutritionPlan.eatingOutStrategy}
          />

        </div>


        {/* FOOD PRIORITIES */}
        <div className="grid gap-5 md:grid-cols-2">

          <PlanSection
            title="Foods to Prioritize"
            items={nutritionPlan.foodsToPrioritize}
          />

          <PlanSection
            title="Foods to Limit"
            items={nutritionPlan.foodsToLimit}
          />

        </div>


        {/* FLEXIBILITY */}
        <PlanSection
          title="Your Flexibility Rules"
          items={nutritionPlan.flexibilityRules}
        />

      </>
    )}

  </div>
)}

      {/* ADD MEAL MODAL */}

      <FoodSearchModal
  open={foodModalOpen || editingMeal !== null}
  onClose={() => {
    setFoodModalOpen(false);
    setEditingMeal(null);
    setEditingIndex(null);
  }}
  editingMeal={editingMeal}
  editingIndex={editingIndex}
  onUpdateMeal={(index, updatedMeal) => {
    updateMeal(index, updatedMeal);

    setEditingMeal(null);
    setEditingIndex(null);
  }}
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

function PlanTarget({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-emerald-400">
        {value}
      </p>
    </div>
  );
}
function PlanSection({ title, items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-lg font-bold">
        {title}
      </h2>

      <div className="mt-4 space-y-3">

        {items.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 text-sm leading-6 text-slate-300"
          >
            <span className="text-emerald-400">
              ✓
            </span>

            <p>{item}</p>
          </div>
        ))}

      </div>

    </div>
  );
}