"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useChat } from "../../hooks/useChat";
import useToast from "../../hooks/useToast";

function ChatContent() {
  const { currentConversation, messages, send, startNew, loadConversation, isLoading } =
    useChat();
  const searchParams = useSearchParams();
  const convId = searchParams.get("id");
  const toast = useToast((state) => state.addToast);
  const [prompt, setPrompt] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (convId) {
      loadConversation(convId);
    } else {
      useChat.setState({ currentConversation: null, messages: [] });
    }
  }, [convId, loadConversation]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 min-h-[500px] justify-between space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Live Chat Console</h2>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            Interact with your model endpoints and capture telemetry logs in real time.
          </p>
        </div>
        <button
          onClick={async () => {
            try {
              await startNew();
            } catch (error) {
              const message =
                error instanceof Error ? error.message : "Unexpected error";
              toast("error", `Could not start a new session: ${message}`);
            }
          }}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-900/10 hover:bg-slate-800 transition"
        >
          New conversation
        </button>
      </div>

      {/* Main Console Frame */}
      <div className="flex-1 rounded-3xl border border-slate-200/60 bg-slate-50/50 p-4 shadow-inner flex flex-col justify-between">
        {/* Session details tag */}
        <div className="mb-3 flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 px-1">
          <span className="flex items-center gap-1.5 font-mono">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulseSlow"></span>
            Session ID: {currentConversation ? currentConversation.slice(0, 15) + "..." : "none (will auto-create)"}
          </span>
          <span className="bg-slate-200/60 rounded-md px-2 py-0.5">{messages.length} messages</span>
        </div>

        {/* Messages viewport */}
        <div
          ref={listRef}
          className="flex-1 max-h-[380px] overflow-auto space-y-4 pr-1 pb-2 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-white p-8">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="font-bold text-slate-700 text-sm">Awaiting prompt</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Type your instructions below. A new session will be initialized automatically.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl p-4 border transition duration-200 ${
                  message.role === "assistant"
                    ? "bg-slate-900 text-slate-100 border-slate-800 shadow-xs"
                    : "bg-white text-slate-900 border-slate-200/80 shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between border-b pb-1.5 mb-2 border-slate-100/10">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      message.role === "assistant" ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {message.role}
                  </span>
                  <span
                    className={`text-[9px] font-medium ${
                      message.role === "assistant" ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-line leading-relaxed">
                  {message.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input controls */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter" && !e.shiftKey && prompt.trim() && !isLoading) {
                e.preventDefault();
                try {
                  await send(prompt);
                  setPrompt("");
                } catch (error) {
                  const message = error instanceof Error ? error.message : "Unexpected error";
                  toast("error", `Could not send prompt: ${message}`);
                }
              }
            }}
            placeholder="Ask anything..."
            className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
          />
          <button
            disabled={isLoading || !prompt.trim()}
            onClick={async () => {
              if (!prompt.trim()) return;
              try {
                await send(prompt);
                setPrompt("");
              } catch (error) {
                const message =
                  error instanceof Error ? error.message : "Unexpected error";
                toast("error", `Could not send prompt: ${message}`);
              }
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Inference...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col flex-1 items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
        <p className="mt-3 text-slate-500 text-sm">Loading chat console...</p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
