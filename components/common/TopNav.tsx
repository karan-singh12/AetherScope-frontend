"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UserMenu from "./UserMenu";
import { useAuth } from "../../context/auth.context";
import useToast from "../../hooks/useToast";

const PROTECTED_ROUTES = [
  { href: "/chat", label: "Chat console" },
  { href: "/conversations", label: "Conversations" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/anomalies", label: "Anomalies" },
];

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const addToast = useToast((state) => state.addToast);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== "/" && pathname?.startsWith(path));
    return isActive
      ? "rounded-xl px-4 py-2 border border-slate-950 bg-slate-950 text-white shadow-xs font-semibold transition"
      : "rounded-xl px-4 py-2 border border-slate-200/60 bg-white text-slate-700 hover:bg-slate-50 shadow-xs font-semibold transition";
  };

  const handleProtectedNav = (href: string) => {
    if (!user) {
      addToast("error", "Please login to access this page.");
      router.push("/login");
      return;
    }
    router.push(href);
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/50">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl overflow-hidden shadow-lg shadow-slate-950/20 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="AetherScope Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-slate-950 hover:text-slate-800 transition"
          >
            AetherScope
          </Link>
          <p className="text-xs text-slate-500 font-medium">
            AI Observability &amp; Inference Analytics
          </p>
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-2 text-sm">
        {PROTECTED_ROUTES.map(({ href, label }) => (
          <button
            key={href}
            onClick={() => handleProtectedNav(href)}
            className={getLinkClass(href)}
          >
            {label}
          </button>
        ))}
        <div className="h-6 w-px bg-slate-200 mx-1"></div>
        <UserMenu />
      </nav>
    </header>
  );
}
