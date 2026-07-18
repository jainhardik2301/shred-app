export default function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  color = "#10b981",
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress =
    circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">

      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={stroke}
          fill="none"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute text-2xl font-bold">
        {value}%
      </div>

    </div>
  );
}