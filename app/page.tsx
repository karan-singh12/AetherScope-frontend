import Link from "next/link";

const cards = [
  {
    title: "Live Chat Console",
    description:
      "Start a new sandbox session, stream prompts to model providers, and trace logs automatically.",
    href: "/chat",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: "Run History",
    description:
      "Browse previous conversation logs, inspect prompt structures, and review completed chat threads.",
    href: "/conversations",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: "Analytics metrics",
    description:
      "Graph request volume, p95 latency, provider token distribution, and service error rates.",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Anomaly detection",
    description:
      "Spot token spikes, backend failures, and latency regressions dynamically from query logs.",
    href: "/anomalies",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="space-y-12 py-4 animate-fadeIn">
      <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white tracking-wider uppercase select-none">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
            Observability Suite
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl leading-[1.15]">
            Track prompts, costs, and model metrics in real time.
          </h1>
          <p className="max-w-xl text-slate-600 leading-relaxed font-medium text-sm md:text-base">
            Lightweight, high-performance tracing for LLM applications. Analyze model behavior, trace latencies, monitor tokens, and capture anomalies.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
            >
              Open chat console
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-850 shadow-xs transition hover:bg-slate-50"
            >
              Analyze metrics
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-slate-200/70 bg-slate-50/40 p-5 shadow-2xs hover:shadow-md hover:border-slate-350 hover:bg-white transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="h-9 w-9 rounded-xl bg-white border border-slate-200/50 flex items-center justify-center text-slate-500 group-hover:text-slate-800 group-hover:bg-slate-50 transition shadow-2xs">
                  {card.icon}
                </div>
                <h2 className="mt-4 text-base font-bold text-slate-950 tracking-tight group-hover:text-slate-950">
                  {card.title}
                </h2>
                <p className="mt-2 text-xs text-slate-500 leading-normal font-medium">{card.description}</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-slate-700 transition uppercase tracking-wider">
                <span>Configure</span>
                <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
