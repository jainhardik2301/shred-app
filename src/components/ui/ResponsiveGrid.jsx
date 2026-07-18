export default function ResponsiveGrid({
  children,
  cols = 4,
}) {
  const grid = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <div
      className={`grid gap-6 ${grid[cols]}`}
    >
      {children}
    </div>
  );
}