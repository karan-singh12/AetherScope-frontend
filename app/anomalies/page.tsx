"use client";

import React, { useEffect, useState } from "react";
import api from "../../services/api";

interface Anomaly {
  id: string;
  logId: string;
  type: "latency" | "token_usage" | "error";
  severity: "critical" | "high" | "medium";
  message: string;
  timestamp: string;
  details: string;
  latency: number;
  tokens: number;
  model: string;
  provider: string;
}

interface Summary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  healthScore: number;
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    healthScore: 100,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchAnomalies = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/dashboard/anomalies");
      const { anomalies, summary } = res.data.data;
      setAnomalies(anomalies || []);
      setSummary(
        summary || {
          total: 0,
          critical: 0,
          high: 0,
          medium: 0,
          healthScore: 100,
        }
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load anomalies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-500/20";
      case "high":
        return "bg-amber-50 text-amber-700 border-amber-200/60 ring-amber-500/20";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200/60 ring-yellow-500/20";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/60 ring-slate-500/20";
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 stroke-emerald-500";
    if (score >= 60) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  const getHealthBg = (score: number) => {
    if (score >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  const filteredAnomalies = anomalies.filter((a) => {
    const typeMatch = filterType === "all" || a.type === filterType;
    const severityMatch =
      filterSeverity === "all" || a.severity === filterSeverity;
    return typeMatch && severityMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Anomaly Detection</h2>
          <p className="mt-1 text-sm text-slate-600">
            Monitor system warnings, API outages, and performance regressions.
          </p>
        </div>
        <button
          onClick={fetchAnomalies}
          className="flex items-center gap-2 rounded-xl px-4 py-2 border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 shadow-sm transition"
        >
          <svg
            className={`w-4 h-4 ${loading ? "animate-spin text-slate-500" : "text-slate-600"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18v3"
            />
          </svg>
          Refresh Data
        </button>
      </div>

      {loading && anomalies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Analyzing logs for anomalies...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 text-center text-rose-700">
          <p className="font-semibold">Error retrieving anomalies</p>
          <p className="mt-1 text-sm text-rose-600/90">{error}</p>
        </div>
      ) : (
        <>
          {/* Dashboard Summary Panels */}
          <div className="grid gap-6 md:grid-cols-12">
            {/* System Health Score */}
            <div className="md:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center">
              <h3 className="text-sm uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">
                System Health
              </h3>
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background path */}
                  <path
                    className="stroke-slate-100"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Dynamic value path */}
                  <path
                    className={`transition-all duration-1000 ${getHealthColor(summary.healthScore)}`}
                    strokeDasharray={`${summary.healthScore}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-bold text-slate-800">
                    {summary.healthScore}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 block">
                    Score
                  </span>
                </div>
              </div>
              <div
                className={`mt-4 rounded-xl border px-3 py-1 text-xs font-semibold ${getHealthBg(summary.healthScore)}`}
              >
                {summary.healthScore >= 85
                  ? "Healthy Status"
                  : summary.healthScore >= 60
                  ? "Degraded Health"
                  : "Critical Status"}
              </div>
            </div>

            {/* Severity Cards */}
            <div className="md:col-span-8 grid gap-4 grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="flex items-center gap-1.5 text-rose-600 font-semibold text-xs uppercase tracking-wider">
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse"></span>
                    Critical
                  </span>
                  <p className="mt-6 text-4xl font-bold text-slate-900">
                    {summary.critical}
                  </p>
                </div>
                <p className="text-xs text-slate-500">Requires immediate attention</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="flex items-center gap-1.5 text-amber-600 font-semibold text-xs uppercase tracking-wider">
                    <span className="h-2 w-2 rounded-full bg-amber-600"></span>
                    High Warning
                  </span>
                  <p className="mt-6 text-4xl font-bold text-slate-900">
                    {summary.high}
                  </p>
                </div>
                <p className="text-xs text-slate-500">Performance regressions</p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="flex items-center gap-1.5 text-yellow-600 font-semibold text-xs uppercase tracking-wider">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    Medium
                  </span>
                  <p className="mt-6 text-4xl font-bold text-slate-900">
                    {summary.medium}
                  </p>
                </div>
                <p className="text-xs text-slate-500">Spikes in token usage</p>
              </div>
            </div>
          </div>

          {/* Filtering Controls */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="text-slate-500 font-medium">Type:</span>
              <button
                onClick={() => setFilterType("all")}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  filterType === "all"
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setFilterType("error")}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  filterType === "error"
                    ? "bg-rose-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Errors
              </button>
              <button
                onClick={() => setFilterType("latency")}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  filterType === "latency"
                    ? "bg-amber-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Latency
              </button>
              <button
                onClick={() => setFilterType("token_usage")}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  filterType === "token_usage"
                    ? "bg-yellow-500 text-slate-900"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Token Usage
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 font-medium">Severity:</span>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 bg-white hover:bg-slate-50 outline-none cursor-pointer"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="high">High Only</option>
                <option value="medium">Medium Only</option>
              </select>
            </div>
          </div>

          {/* Anomalies List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">
              Anomalies Log ({filteredAnomalies.length})
            </h3>
            {filteredAnomalies.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
                <p className="font-semibold text-slate-600">No anomalies detected</p>
                <p className="text-sm mt-1">Everything looks healthy for your current filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAnomalies.map((a) => (
                  <div
                    key={a.id}
                    className={`rounded-3xl border border-slate-200 bg-white hover:shadow-md transition duration-200 overflow-hidden`}
                  >
                    <div className="p-5 flex items-center justify-between gap-4 flex-wrap md:flex-nowrap">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div
                          className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                            a.type === "error"
                              ? "bg-rose-50 text-rose-600 border-rose-100"
                              : a.type === "latency"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-yellow-50 text-yellow-600 border-yellow-100"
                          }`}
                        >
                          {a.type === "error" ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          ) : a.type === "latency" ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800 text-sm md:text-base">
                              {a.message}
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs font-bold uppercase tracking-wider select-none ${getSeverityStyles(
                                a.severity
                              )}`}
                            >
                              {a.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(a.timestamp).toLocaleString()} • {a.model} ({a.provider})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-auto shrink-0">
                        <button
                          onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                          className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-3.5 py-1.5 text-xs font-semibold shadow-sm transition"
                        >
                          {expandedId === a.id ? "Hide Details" : "Show Details"}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Panel */}
                    {expandedId === a.id && (
                      <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4 text-sm animate-fadeIn">
                        <div>
                          <h4 className="font-bold text-slate-700">Diagnosis Details</h4>
                          <p className="mt-1 text-slate-600">{a.details}</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-4">
                          <div className="rounded-xl border border-slate-200/60 bg-white p-3 shadow-xs">
                            <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Latency</span>
                            <span className="text-base font-semibold text-slate-700 block mt-1">{a.latency} ms</span>
                          </div>
                          <div className="rounded-xl border border-slate-200/60 bg-white p-3 shadow-xs">
                            <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Tokens Used</span>
                            <span className="text-base font-semibold text-slate-700 block mt-1">{a.tokens} tokens</span>
                          </div>
                          <div className="rounded-xl border border-slate-200/60 bg-white p-3 shadow-xs">
                            <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Model ID</span>
                            <span className="text-base font-semibold text-slate-700 block mt-1">{a.model}</span>
                          </div>
                          <div className="rounded-xl border border-slate-200/60 bg-white p-3 shadow-xs">
                            <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">Provider</span>
                            <span className="text-base font-semibold text-slate-700 block mt-1 capitalize">{a.provider}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
