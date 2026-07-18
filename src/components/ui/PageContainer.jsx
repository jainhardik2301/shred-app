export default function PageContainer({
  children,
}) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      {children}
    </div>
  );
}