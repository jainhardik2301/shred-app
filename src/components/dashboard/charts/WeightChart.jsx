import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useApp } from "../../../contexts/AppContext";
import {
  kgToLb,
} from "../../../utils/unitConversions";

export default function WeightChart() {
  const { appData } = useApp();

  const history =
    appData?.history?.weight ?? [];

  const weightUnit =
    appData?.preferences?.weightUnit ||
    "kg";

  if (history.length === 0) return null;

  const sameDay = history.every(
    (item) => {
      const first = new Date(
        history[0].date
      );

      const current = new Date(
        item.date
      );

      return (
        first.getDate() ===
          current.getDate() &&
        first.getMonth() ===
          current.getMonth() &&
        first.getFullYear() ===
          current.getFullYear()
      );
    }
  );

  const chartData = history.map(
    (entry) => {
      const date = new Date(
        entry.date
      );

      const storedWeight =
        Number(entry.value) || 0;

      const displayWeight =
        weightUnit === "lb"
          ? kgToLb(storedWeight)
          : storedWeight;

      return {
        weight: Number(
          displayWeight.toFixed(1)
        ),

        label: sameDay
          ? date.toLocaleTimeString(
              "en-IN",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            )
          : date.toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
              }
            ),

        fullDate:
          date.toLocaleDateString(
            "en-IN",
            {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          ),

        fullTime:
          date.toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }
          ),
      };
    }
  );

  const values = chartData.map(
    (d) => d.weight
  );

  const padding =
    weightUnit === "lb" ? 2 : 1;

  const min = Math.floor(
    Math.min(...values) - padding
  );

  const max = Math.ceil(
    Math.max(...values) + padding
  );

  function CustomTooltip({
    active,
    payload,
  }) {
    if (
      !active ||
      !payload?.length
    ) {
      return null;
    }

    const data =
      payload[0].payload;

    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
        <p className="text-2xl font-bold text-emerald-400">
          {data.weight} {weightUnit}
        </p>

        <p className="mt-2 text-sm text-slate-300">
          📅 {data.fullDate}
        </p>

        <p className="text-sm text-slate-400">
          🕒 {data.fullTime}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">
            Weight Trend
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Weight ({weightUnit})
          </p>
        </div>

        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-400">
          {history.length} Entries
        </span>
      </div>

      <ResponsiveContainer
        width="100%"
        height={330}
      >
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 25,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient
              id="weightGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#10b981"
                stopOpacity={0.35}
              />

              <stop
                offset="95%"
                stopColor="#10b981"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#243244"
            strokeDasharray="5 5"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 13,
              fill: "#94a3b8",
            }}
            dy={10}
          />

          <YAxis
            domain={[min, max]}
            stroke="#94a3b8"
            width={75}
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 14,
              fill: "#94a3b8",
            }}
            dx={-8}
          />

          <Tooltip
            content={
              <CustomTooltip />
            }
          />

          <Area
            type="monotone"
            dataKey="weight"
            stroke="none"
            fill="url(#weightGradient)"
          />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={4}
            animationDuration={900}
            dot={{
              r: 5,
              fill: "#ffffff",
              stroke: "#10b981",
              strokeWidth: 3,
            }}
            activeDot={{
              r: 8,
              fill: "#ffffff",
              stroke: "#10b981",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}