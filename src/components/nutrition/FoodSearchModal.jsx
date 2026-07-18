import {
  useEffect,
  useState,
} from "react";

import { useApp } from "../../contexts/AppContext";
import QuantitySelector from "./QuantitySelector";

export default function FoodSearchModal({
  open,
  onClose,
  editingMeal = null,
  editingIndex = null,
  onUpdateMeal,
}) {
  const { addMeal } = useApp();

  const [search, setSearch] =
    useState("");

  const [foods, setFoods] =
    useState([]);

  const [
    isSearching,
    setIsSearching,
  ] = useState(false);

  const [
    searchError,
    setSearchError,
  ] = useState("");

  const [
    selectedFood,
    setSelectedFood,
  ] = useState(null);

  const [quantity, setQuantity] =
    useState(100);

  const isEditing =
    editingMeal !== null &&
    editingIndex !== null;

  // ---------------------------------
  // LOAD EXISTING MEAL WHEN EDITING
  // ---------------------------------

  useEffect(() => {
    if (!open) return;

    if (isEditing) {
      const existingMeal = {
        id:
          editingMeal.id ||
          `edit-${editingIndex}`,

        name:
          editingMeal.name,

        unit:
          editingMeal.unit || "g",

        baseQuantity:
          Number(
            editingMeal.quantity
          ) || 100,

        step:
          editingMeal.unit ===
          "piece"
            ? 1
            : 10,

        calories:
          Number(
            editingMeal.calories
          ) || 0,

        protein:
          Number(
            editingMeal.protein
          ) || 0,

        carbs:
          Number(
            editingMeal.carbs
          ) || 0,

        fat:
          Number(
            editingMeal.fat
          ) || 0,

        source:
          editingMeal.source ||
          "Saved Meal",

        brand:
          editingMeal.brand ||
          null,
      };

      setSelectedFood(
        existingMeal
      );

      setQuantity(
        Number(
          editingMeal.quantity
        ) || 100
      );

      setSearch("");
      setFoods([]);
      setSearchError("");

      return;
    }

    setSelectedFood(null);
    setQuantity(100);
    setSearch("");
    setFoods([]);
    setSearchError("");
  }, [
    open,
    editingMeal,
    editingIndex,
    isEditing,
  ]);

  // ---------------------------------
  // DYNAMIC FOOD SEARCH
  // ---------------------------------

  useEffect(() => {
    if (!open) return;

    const query =
      search.trim();

    if (query.length < 2) {
      setFoods([]);
      setSearchError("");
      return;
    }

    const controller =
      new AbortController();

    const timer =
      setTimeout(
        async () => {
          try {
            setIsSearching(true);
            setSearchError("");

            const response =
              await fetch(
                `https://shred-ai.onrender.com/api/food-search?q=${encodeURIComponent(
                  query
                )}`,
                {
                  signal:
                    controller.signal,
                }
              );

            if (!response.ok) {
              throw new Error(
                "Food search failed."
              );
            }

            const data =
              await response.json();

            setFoods(
              Array.isArray(
                data.foods
              )
                ? data.foods
                : []
            );
          } catch (error) {
            if (
              error.name !==
              "AbortError"
            ) {
              console.error(
                "Food search error:",
                error
              );

              setFoods([]);

              setSearchError(
                "Unable to search foods right now."
              );
            }
          } finally {
            if (
              !controller.signal
                .aborted
            ) {
              setIsSearching(
                false
              );
            }
          }
        },
        500
      );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, open]);

  if (!open) return null;

  // ---------------------------------
  // SELECT FOOD
  // ---------------------------------

  function selectFood(food) {
    setSelectedFood(food);

    setQuantity(
      Number(
        food.baseQuantity
      ) || 100
    );
  }

  // ---------------------------------
  // CALCULATE NUTRITION
  // ---------------------------------

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

    const baseQuantity =
      Number(
        selectedFood.baseQuantity
      ) || 1;

    const multiplier =
      Number(value) /
      baseQuantity;

    return {
      calories:
        Math.round(
          Number(
            selectedFood.calories
          ) * multiplier
        ),

      protein:
        +(
          Number(
            selectedFood.protein
          ) * multiplier
        ).toFixed(1),

      carbs:
        +(
          Number(
            selectedFood.carbs
          ) * multiplier
        ).toFixed(1),

      fat:
        +(
          Number(
            selectedFood.fat
          ) * multiplier
        ).toFixed(1),
    };
  }

  const nutrition =
    calculateNutrition(
      quantity
    );

  // ---------------------------------
  // SAVE ADD / EDIT
  // ---------------------------------

  function handleSaveMeal() {
    if (!selectedFood) return;

    const meal = {
      id:
        isEditing
          ? editingMeal.id
          : Date.now(),

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

      source:
        selectedFood.source ||
        editingMeal?.source ||
        "AI Estimate",

      brand:
        selectedFood.brand ||
        editingMeal?.brand ||
        null,
    };

    if (
      isEditing &&
      typeof onUpdateMeal ===
        "function"
    ) {
      onUpdateMeal(
        editingIndex,
        meal
      );
    } else {
      addMeal(meal);
    }

    setSelectedFood(null);
    setQuantity(100);
    setSearch("");
    setFoods([]);
    setSearchError("");

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div className="my-4 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">

          <div className="max-h-[calc(100vh-2rem)] overflow-y-auto p-4 sm:p-6">

            <div className="flex items-center justify-between gap-4">

              <h2 className="text-xl font-bold sm:text-2xl">
                {isEditing
                  ? "Edit Meal"
                  : "Add Meal"}
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

            {/* FOOD SEARCH */}

            <input
              type="text"
              placeholder={
                isEditing
                  ? "Search to replace food..."
                  : "Search food..."
              }
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="mt-5 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-500 sm:mt-6"
            />

            <div className="mt-4 max-h-52 space-y-2 overflow-y-auto">

              {isSearching && (
                <div className="py-4 text-center text-sm text-slate-400">
                  Searching foods...
                </div>
              )}

              {searchError && (
                <div className="py-4 text-center text-sm text-red-400">
                  {searchError}
                </div>
              )}

              {!isSearching &&
                !searchError &&
                search
                  .trim()
                  .length >= 2 &&
                foods.length ===
                  0 && (
                  <div className="py-4 text-center text-sm text-slate-400">
                    No foods found.
                  </div>
                )}

              {foods.map(
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
                      selectedFood
                        ?.id ===
                      food.id
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-semibold">
                      {
                        food.name
                      }
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

                    <div className="mt-1 text-xs opacity-60">
                      Source:{" "}
                      {food.source ||
                        "Nutrition Database"}
                    </div>

                    {food.brand && (
                      <div className="mt-1 text-xs opacity-60">
                        {
                          food.brand
                        }
                      </div>
                    )}

                  </button>
                )
              )}

            </div>

            {/* SELECTED / EDITING MEAL */}

            {selectedFood && (
              <div className="mt-6">

                {isEditing &&
                  search.trim()
                    .length < 2 && (
                    <div className="mb-5 rounded-xl border border-slate-700 bg-slate-800 p-4">

                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Editing
                      </div>

                      <div className="mt-1 font-semibold">
                        {
                          selectedFood.name
                        }
                      </div>

                    </div>
                  )}

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
                    selectedFood.step ||
                    (selectedFood.unit ===
                    "piece"
                      ? 1
                      : 10)
                  }
                />

                <div className="mt-6 rounded-xl bg-slate-800 p-4">

                  <div className="font-semibold">
                    Nutrition Preview
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
                    handleSaveMeal
                  }
                  className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white transition hover:bg-emerald-600"
                >
                  {isEditing
                    ? "Save Changes"
                    : "Add to Today's Meals"}
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