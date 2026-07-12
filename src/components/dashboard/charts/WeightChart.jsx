import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import history from "../../../data/history";

export default function WeightChart() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <h3 className="mb-5 text-xl font-semibold">
        Weight Trend
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={history.weight}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
          />

          <XAxis
            dataKey="day"
            stroke="#94a3b8"
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={4}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}