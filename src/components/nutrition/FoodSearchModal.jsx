import { useState } from "react";
import { useApp } from "../../contexts/AppContext";
import QuantitySelector from "./QuantitySelector";

const foods = [
  {
    id: 1,
    name: "Paneer",
    unit: "g",
    baseQuantity: 100,
    step: 10,
    calories: 265,
    protein: 18.3,
    carbs: 1.2,
    fat: 20.8,
  },
  {
    id: 2,
    name: "Idli",
    unit: "piece",
    baseQuantity: 1,
    step: 1,
    calories: 58,
    protein: 2,
    carbs: 12,
    fat: 0.4,
  },
  {
    id: 3,
    name: "Sambar",
    unit: "ml",
    baseQuantity: 100,
    step: 50,
    calories: 53,
    protein: 2.5,
    carbs: 8,
    fat: 1.2,
  },
  {
    id: 4,
    name: "Hung Curd",
    unit: "g",
    baseQuantity: 100,
    step: 10,
    calories: 90,
    protein: 10,
    carbs: 4,
    fat: 3,
  },
  {
    id: 5,
    name: "Apple",
    unit: "piece",
    baseQuantity: 1,
    step: 1,
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
  },
  {
    id: 6,
    name: "Banana",
    unit: "piece",
    baseQuantity: 1,
    step: 1,
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
  },
  {
    id: 7,
    name: "Sprouts",
    unit: "g",
    baseQuantity: 100,
    step: 10,
    calories: 30,
    protein: 3,
    carbs: 6,
    fat: 0.2,
  },
  {
    id: 8,
    name: "Kala Chana",
    unit: "g",
    baseQuantity: 100,
    step: 10,
    calories: 164,
    protein: 8.9,
    carbs: 27,
    fat: 2.6,
  },
  {
    id: 9,
    name: "Roti",
    unit: "piece",
    baseQuantity: 1,
    step: 1,
    calories: 100,
    protein: 3,
    carbs: 20,
    fat: 1,
  },
  {
    id: 10,
    name: "Milk",
    unit: "ml",
    baseQuantity: 100,
    step: 50,
    calories: 61,
    protein: 3.2,
    carbs: 4.8,
    fat: 3.3,
  },
];

export default function FoodSearchModal({
  open,
  onClose,
}) {
  const { addMeal } = useApp();

  const [search, setSearch] =
    useState("");

  const [
    selectedFood,
    setSelectedFood,
  ] = useState(null);

  const [quantity, setQuantity] =
    useState(100);

  if (!open) return null;

  const filteredFoods =
    foods.filter((food) =>
      food.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  function selectFood(food) {
    setSelectedFood(food);
    setQuantity(
      food.baseQuantity
    );
  }

  function calculateNutrition(
    value
  ) {
    if (!selectedFood) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }

    const multiplier =
      Number(value) /
      selectedFood.baseQuantity;

    return {
      calories: Math.round(
        selectedFood.calories *
          multiplier
      ),

      protein: +(
        selectedFood.protein *
        multiplier
      ).toFixed(1),

      carbs: +(
        selectedFood.carbs *
        multiplier
      ).toFixed(1),

      fat: +(
        selectedFood.fat *
        multiplier
      ).toFixed(1),
    };
  }

  const nutrition =
    calculateNutrition(
      quantity
    );

  function handleAddMeal() {
    if (!selectedFood) return;

    const meal = {
      id: Date.now(),

      name:
        selectedFood.name,

      quantity:
        Number(quantity),

      unit:
        selectedFood.unit,

      calories:
        nutrition.calories,

      protein:
        nutrition.protein,

      carbs:
        nutrition.carbs,

      fat:
        nutrition.fat,
    };

    addMeal(meal);

    setSelectedFood(null);
    setQuantity(100);
    setSearch("");

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="my-4 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
          <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold sm:text-2xl">
                Add Meal
              </h2>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                ×
              </button>
            </div>

            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500 sm:mt-6"
            />

            <div className="mt-4 max-h-52 space-y-2 overflow-y-auto">
              {filteredFoods.map(
                (food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() =>
                      selectFood(
                        food
                      )
                    }
                    className={`w-full rounded-xl p-3 text-left sm:p-4 ${
                      selectedFood?.id ===
                      food.id
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-semibold">
                      {food.name}
                    </div>

                    <div className="mt-1 text-sm opacity-80">
                      {
                        food.calories
                      }{" "}
                      kcal •{" "}
                      {
                        food.protein
                      }
                      g protein per{" "}
                      {
                        food.baseQuantity
                      }{" "}
                      {food.unit}
                    </div>
                  </button>
                )
              )}
            </div>

            {selectedFood && (
              <div className="mt-6">
                <QuantitySelector
                  quantity={
                    quantity
                  }
                  setQuantity={
                    setQuantity
                  }
                  unit={
                    selectedFood.unit ===
                      "piece" &&
                    quantity > 1
                      ? "pieces"
                      : selectedFood.unit
                  }
                  step={
                    selectedFood.step
                  }
                />

                <div className="mt-6 rounded-xl bg-slate-800 p-4">
                  <div className="font-semibold">
                    Nutrition
                    Preview
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4 sm:gap-2">
                    <NutritionValue
                      value={
                        nutrition.calories
                      }
                      label="kcal"
                    />

                    <NutritionValue
                      value={`${nutrition.protein}g`}
                      label="Protein"
                    />

                    <NutritionValue
                      value={`${nutrition.carbs}g`}
                      label="Carbs"
                    />

                    <NutritionValue
                      value={`${nutrition.fat}g`}
                      label="Fat"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleAddMeal
                  }
                  className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white transition hover:bg-emerald-600"
                >
                  Add to Today's
                  Meals
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NutritionValue({
  value,
  label,
}) {
  return (
    <div>
      <div className="font-semibold text-white">
        {value}
      </div>

      <div className="mt-1 text-slate-400">
        {label}
      </div>
    </div>
  );
}