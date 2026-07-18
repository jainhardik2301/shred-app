export default function BodyMeasurements() {
  const measurements = [
    { label: "Chest", value: "-- cm" },
    { label: "Waist", value: "-- cm" },
    { label: "Hips", value: "-- cm" },
    { label: "Arms", value: "-- cm" },
    { label: "Thighs", value: "-- cm" },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-bold">
        Body Measurements
      </h2>

      <div className="space-y-4">

        {measurements.map((item) => (

          <div
            key={item.label}
            className="flex items-center justify-between"
          >

            <span className="text-slate-400">
              {item.label}
            </span>

            <span className="font-semibold">
              {item.value}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}