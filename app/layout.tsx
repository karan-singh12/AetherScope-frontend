import "./globals.css";
import React from "react";
import TopNav from "../components/common/TopNav";
import ToastPortal from "../components/common/ToastPortal";
import { AuthProvider } from "../context/auth.context";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "AetherScope - AI Observability & Inference Analytics",
  description: "AI Observability & Inference Analytics Enterprise-grade LLM observability dashboard for tracking inference performance, model latency, token costs, and conversations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${font.className} min-h-screen bg-[#f8fafc] text-slate-800 antialiased flex flex-col`}>
        <AuthProvider>
          {/* Translucent background blur graphics */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-45">
            <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-blue-400/20 blur-[120px]" />
            <div className="absolute top-[20%] -right-[20%] w-[60%] h-[70%] rounded-full bg-indigo-400/20 blur-[130px]" />
            <div className="absolute -bottom-[20%] left-[10%] w-[50%] h-[60%] rounded-full bg-sky-400/15 blur-[110px]" />
          </div>

          <div className="flex-1 py-8 flex flex-col justify-center">
            <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1">
              <TopNav />
              <main className="flex-1 rounded-3xl bg-white/70 shadow-2xl shadow-slate-100/80 border border-slate-200/50 p-6 backdrop-blur-lg flex flex-col">
                {children}
              </main>
            </div>
            <ToastPortal />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
