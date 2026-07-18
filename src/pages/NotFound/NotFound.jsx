import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-white">

      <h1 className="text-8xl font-bold text-emerald-500">
        404
      </h1>

      <h2 className="mt-6 text-3xl font-bold">
        Page Not Found
      </h2>

      <p className="mt-3 text-center text-slate-400">
        The page you're looking for doesn't exist.
      </p>

      <Link
        to="/dashboard"
        className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-600"
      >
        Go to Dashboard
      </Link>

    </div>
  );
}