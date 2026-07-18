export default function FoodCard({
  meal,
  index,
  onDelete,
  onEdit,
}) {
  return (
    <div className="rounded-xl bg-slate-800 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="break-words font-bold">
            {meal.name}
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            {meal.quantity || 0}{" "}
            {meal.unit === "piece" &&
            meal.quantity > 1
              ? "pieces"
              : meal.unit || "g"}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
            <span>
              {meal.calories || 0} kcal
            </span>

            <span>
              {meal.protein || 0}g protein
            </span>

            <span>
              {meal.carbs || 0}g carbs
            </span>

            <span>
              {meal.fat || 0}g fat
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() =>
  onEdit?.(meal, index)
}
              className="flex-1 rounded-lg bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600 sm:flex-none"
            >
              Edit
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              onDelete(index)
            }
            className="flex-1 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 sm:flex-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}