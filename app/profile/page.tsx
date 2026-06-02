"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/auth.context";
import useToast from "../../hooks/useToast";

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await updateProfile(name, email);
      addToast("success", "Profile updated successfully!");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to update profile";
      addToast("error", message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 flex-1">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <p className="mt-3 text-slate-500 text-sm font-medium">Loading details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 w-full animate-fadeIn flex-1 flex flex-col justify-center">
      {/* Header */}
      <div className="pb-6 mb-8 border-b border-slate-200/60">
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-slate-600 mt-1.5 font-medium">
          Update your public name, login email address, and customize your details.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-slate-200 p-8 shadow-xl shadow-slate-100/50 space-y-6">
        <div>
          <label className="block mb-2">
            <span className="text-sm font-semibold text-slate-700">Full Name</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Karan Singh"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-sm"
            required
          />
        </div>

        <div>
          <label className="block mb-2">
            <span className="text-sm font-semibold text-slate-700">Email Address</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 font-medium text-sm"
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-3 font-semibold text-white transition hover:shadow-lg hover:from-slate-800 hover:to-slate-700 disabled:cursor-not-allowed disabled:opacity-50 text-sm"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                Saving...
              </span>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
