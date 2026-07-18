import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useAuth,
} from "../../contexts/AuthContext";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await resetPassword(
        email.trim()
      );

      setSuccess(
        "If an account exists for this email, we've sent password reset instructions."
      );
    } catch (error) {
      setError(
        error?.message ||
          "Unable to send reset email."
      );
    } finally {
      setLoading(false);
    }
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
          Reset your password
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Enter your email address and
          we'll send you a password reset
          link.
        </p>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
            {success}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link
            to="/login"
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Back to Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}