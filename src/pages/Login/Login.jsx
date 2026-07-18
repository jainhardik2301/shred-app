import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../contexts/AuthContext";

import {
  useApp,
} from "../../contexts/AppContext";

export default function Login() {
  const {
    login,
    isAuthenticated,
  } = useAuth();

  const {
    appData,
    cloudReady,
  } = useApp();

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (
      !isAuthenticated ||
      !cloudReady
    ) {
      return;
    }

    const onboardingCompleted =
      appData?.profile
        ?.onboardingCompleted === true;

    navigate(
      onboardingCompleted
        ? "/dashboard"
        : "/onboarding",
      {
        replace: true,
      }
    );
  }, [
    isAuthenticated,
    cloudReady,
    appData?.profile
      ?.onboardingCompleted,
    navigate,
  ]);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        email.trim(),
        password
      );

      // Do not navigate here.
      // AppContext first loads the user's
      // Supabase data, then the effect
      // above chooses the correct page.
    } catch (error) {
      if (
        error?.message ===
        "Invalid login credentials"
      ) {
        setError(
          "Incorrect email or password."
        );
      } else {
        setError(
          error?.message ||
            "Unable to sign in."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (
    isAuthenticated &&
    !cloudReady
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />

          <p className="mt-4 text-slate-400">
            Loading your SHRED data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

        <div className="text-center">
          <h1 className="text-4xl font-black tracking-wide text-emerald-400">
            SHRED
          </h1>

          <p className="mt-2 text-slate-400">
            Track • Transform • Triumph
          </p>
        </div>

        <h2 className="mt-8 text-2xl font-bold">
          Sign In
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Welcome back to SHRED.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Email
            </label>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Password
            </label>

            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none transition focus:border-emerald-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-right">
  <Link
    to="/forgot-password"
    className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
  >
    Forgot password?
  </Link>
</div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Create account
          </Link>
        </p>

      </div>
    </div>
  );
}