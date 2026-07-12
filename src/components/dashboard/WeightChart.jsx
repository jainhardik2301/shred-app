import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";

import user from "../../data/user";

export default function WeightChart() {
  return (
    <div className="rounded-2xl bg-slate-900 p-8">
      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Weekly Weight Trend
          </h2>

          <p className="text-slate-400 mt-2">
            Last 7 Days
          </p>
        </div>

        <div className="text-right">

          <div className="text-4xl font-bold">
            {user.profile.currentWeight} kg
          </div>

          <div className="text-emerald-400 mt-2">
            ↓ 0.8 kg this week
          </div>

        </div>

      </div>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={user.weightHistory}>
            <XAxis
              dataKey="day"
              tick={{ fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="weight"
              stroke="#10b981"
              strokeWidth={4}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}