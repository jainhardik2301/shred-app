import LoadingSpinner from "./LoadingSpinner";

export default function PageLoader({
  text = "Loading...",
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner
        size="lg"
        text={text}
      />
    </div>
  );
}