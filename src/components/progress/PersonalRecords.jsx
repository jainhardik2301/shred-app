export default function PersonalRecords() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-bold">
        Personal Records
      </h2>

      <div className="space-y-4">

        <Record
          title="Lowest Weight"
          value="-- kg"
        />

        <Record
          title="Highest Protein"
          value="-- g"
        />

        <Record
          title="Best Water Intake"
          value="-- L"
        />

        <Record
          title="Longest Streak"
          value="1 Day"
        />

      </div>

    </div>
  );
}

function Record({ title, value }) {
  return (
    <div className="flex justify-between">

      <span className="text-slate-400">
        {title}
      </span>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  );
}