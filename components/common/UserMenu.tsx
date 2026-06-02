"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/auth.context";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/login"
          className="rounded-xl px-4 py-2 border border-slate-200 text-slate-800 hover:bg-slate-50 transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-xl px-4 py-2 bg-sky-600 text-white hover:bg-sky-500 transition"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sky-900 hover:bg-sky-200 transition"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
          {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
        </div>
        <span className="text-sm font-medium max-w-[100px] truncate">
          {user.name || user.email || "User"}
        </span>
        <svg
          className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-lg border border-slate-200 overflow-hidden z-50 animate-fadeIn">
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account</p>
            {user.name && (
              <p className="text-sm font-bold text-slate-900 truncate">
                {user.name}
              </p>
            )}
            <p className="text-xs text-slate-500 truncate">
              {user.email || "User"}
            </p>
          </div>
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="block w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition border-b border-slate-100 font-medium"
          >
            Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-650 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
