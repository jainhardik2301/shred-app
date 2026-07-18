export default function QuantitySelector({
  quantity,
  setQuantity,
  unit = "g",
  step = 10,
}) {
  function decrease() {
    setQuantity((prev) =>
      Math.max(step, Number(prev) - step)
    );
  }

  function increase() {
    setQuantity((prev) =>
      Number(prev) + step
    );
  }

  return (
    <div>
      <label className="mb-2 block text-sm text-slate-400">
        Quantity ({unit})
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrease}
          className="rounded-lg bg-slate-800 px-4 py-2"
        >
          −
        </button>

        <input
          type="number"
          min={step}
          step={step}
          value={quantity}
          onChange={(e) =>
            setQuantity(
              Math.max(step, Number(e.target.value))
            )
          }
          className="w-28 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-center"
        />

        <button
          type="button"
          onClick={increase}
          className="rounded-lg bg-slate-800 px-4 py-2"
        >
          +
        </button>
      </div>
    </div>
  );
}