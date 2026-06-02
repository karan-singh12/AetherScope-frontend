"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../../services/auth.service";
import useToast from "../../hooks/useToast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await login(email, password);
      addToast("success", "Login successful! Redirecting...");
      router.push("/");
    } catch (err) {
      let message = "Unable to login";
      if (err instanceof Error) {
        if (
          err.message.includes("401") ||
          err.message.includes("Invalid credentials")
        ) {
          message = "Invalid email or password";
        } else if (err.message.includes("404")) {
          message = "Backend server not running";
        } else {
          message = err.message;
        }
      }
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-600">
            Sign in to your LLM Observability account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg space-y-6"
        >
          <div>
            <label className="block mb-2">
              <span className="text-sm font-semibold text-slate-700">
                Email Address
              </span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              <span className="text-sm font-semibold text-slate-700">
                Password
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 font-semibold text-white transition hover:shadow-lg hover:from-slate-800 hover:to-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-sky-600 hover:text-sky-700"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
