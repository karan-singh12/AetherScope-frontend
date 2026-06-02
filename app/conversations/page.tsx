"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Conversation } from "../../types";
import api from "../../services/api";

export default function ConversationsPage() {
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/conversations", { params: { q: query } });
      setConvs(res.data.data ?? []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [query]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Conversations</h2>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            Search, resume, or view details of previous inference runs.
          </p>
        </div>
        <button
          onClick={async () => {
            try {
              const res = await api.post("/api/conversations");
              setConvs((current) => [res.data.data, ...current]);
            } catch (err: any) {
              setError("Failed to create new conversation");
            }
          }}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 transition"
        >
          New session
        </button>
      </div>

      {/* Filter and description grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-xs">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Search conversations
          </label>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title or session ID..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-5 shadow-xs flex items-center">
          <p className="text-xs text-slate-500 leading-normal font-medium">
            Start a fresh conversation or pick an existing workspace session to replay logs, review inputs, or send new prompts.
          </p>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-3">
        {loading && convs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            <p className="mt-3 text-slate-500 text-sm">Loading sessions...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 text-center text-rose-700 text-sm">
            <p className="font-semibold">{error}</p>
          </div>
        ) : convs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 py-16 text-center text-slate-500">
            <p className="font-semibold text-slate-600">No active conversations</p>
            <p className="text-sm mt-1">Start a new session or check your search parameters.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {convs.map((c) => (
              <Link
                key={c.id}
                href={`/conversations/${c.id}`}
                className="group rounded-2xl border border-slate-200/70 bg-white p-5 shadow-xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition duration-200 block"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-slate-950 text-base md:text-lg flex items-center gap-2">
                      {c.title}
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-slate-400 transition"></span>
                    </h3>
                    <p className="text-xs text-slate-500 font-mono font-medium">
                      ID: {c.id} • Session: {c.sessionId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      {new Date(c.updatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <div className="h-7 w-7 rounded-lg border border-slate-200/50 flex items-center justify-center text-slate-400 group-hover:text-slate-800 group-hover:bg-slate-50 transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
