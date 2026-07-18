export default function Toast({
  message,
  type = "success",
}) {
  const colors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    warning: "bg-orange-500",
    info: "bg-sky-500",
  };

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl px-6 py-3 text-white shadow-xl ${colors[type]}`}
    >
      {message}
    </div>
  );
}