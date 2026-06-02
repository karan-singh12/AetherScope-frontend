"use client";

import api from "../../../services/api";
import { useEffect, useState } from "react";
import { Message } from "../../../types";
import Link from "next/link";

export default function ConversationPage(props: any) {
  const { params } = props;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/conversations/${params.id}`);
        setMessages(res.data.data?.messages ?? []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load conversation details");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Conversation Details</h2>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            Review the historical prompt and model completion logs for this session.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/chat?id=${params.id}`}
            className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition shadow-xs"
          >
            Resume conversation
          </Link>
          <Link
            href="/conversations"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition shadow-xs"
          >
            Back to list
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="mt-3 text-slate-500 text-sm">Retrieving message history...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 text-center text-rose-700 text-sm">
          <p className="font-semibold">{error}</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/60 bg-slate-50/40 p-5 shadow-xs">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                No messages are available for this conversation.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl p-5 border shadow-xs transition duration-200 ${
                    message.role === "assistant"
                      ? "bg-slate-900 text-slate-100 border-slate-800"
                      : "bg-white text-slate-900 border-slate-200/80"
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2 mb-3 border-slate-100/10">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        message.role === "assistant" ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {message.role}
                    </span>
                    <span
                      className={`text-[10px] font-medium ${
                        message.role === "assistant" ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleString()}
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
      )}
    </div>
  );
}
