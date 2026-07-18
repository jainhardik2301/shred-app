export default function Grid({
  children,
  cols = 4,
  gap = 6,
}) {
  return (
    <div
      className={`grid grid-cols-${cols} gap-${gap}`}
    >
      {children}
    </div>
  );
}