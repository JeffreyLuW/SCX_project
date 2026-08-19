"use client";

import { useEffect, useRef } from "react";
import { getModelById } from "@/lib/models";
import { ModelInfoBadges } from "@/components/ModelBadge";

export interface PanelState {
  modelId: string;
  status: "idle" | "streaming" | "done" | "error";
  content: string;
  chunks?: Array<{ text: string; id: number }>;
  thinkingContent?: string;
  responseTimeMs?: number;
  tokenUsage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  error?: string;
  statusCode?: number;
}

interface ChatPanelProps {
  state: PanelState;
}

export function ChatPanel({ state }: ChatPanelProps) {
  const model = getModelById(state.modelId);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (state.status === "streaming" && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [state.content, state.status]);

  return (
    <div className="flex flex-col rounded-2xl border border-[#E8E4DC] bg-white shadow-sm overflow-hidden h-full min-h-[300px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E8E4DC] bg-[#F5F3F0]/85 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-stone-900">
            {model?.name ?? state.modelId}
          </span>
          <StatusDot status={state.status} />
        </div>
        {model && (
          <ModelInfoBadges
            capabilities={model.capabilities}
            provider={model.provider}
            contextWindow={model.contextWindow}
          />
        )}
      </div>

      {(state.status === "done" || state.status === "streaming") &&
        (state.responseTimeMs !== undefined || state.tokenUsage) && (
          <div className="px-4 py-2 border-b border-[#E8E4DC] bg-amber-50/40 flex items-center gap-3 text-xs">
            {state.responseTimeMs !== undefined && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="font-medium text-amber-700">
                  {state.responseTimeMs} ms
                </span>
              </span>
            )}
            {state.tokenUsage && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                <span className="text-stone-600">
                  {state.tokenUsage.completion_tokens} out
                  <span className="text-stone-400">
                    {" / "}
                    {state.tokenUsage.total_tokens} total
                  </span>
                </span>
              </span>
            )}
          </div>
        )}

      {/* Content area */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-4 py-4 text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-mono"
      >
        {state.status === "idle" && (
          <span className="text-stone-400 italic">
            Waiting for your question…
          </span>
        )}
        {state.status === "error" && (
          <div className="space-y-2">
            {state.statusCode !== undefined && (
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                HTTP {state.statusCode}
              </span>
            )}
            <div className="text-rose-600 text-sm break-words">
              {state.error ?? "An error occurred."}
            </div>
          </div>
        )}
        {state.status === "streaming" &&
          !state.content &&
          !state.thinkingContent && (
            <div className="space-y-2">
              <div className="h-3 bg-stone-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-stone-200 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-stone-200 rounded animate-pulse w-2/3" />
            </div>
          )}
        {state.thinkingContent && (
          <details
            open={state.status === "streaming"}
            className="mb-3 text-xs"
          >
            <summary className="cursor-pointer select-none font-medium text-amber-600 mb-1">
              💭 Thinking
            </summary>
            <div className="pl-3 border-l border-amber-200 italic text-stone-400 whitespace-pre-wrap">
              {state.thinkingContent}
            </div>
          </details>
        )}
        {state.chunks && state.chunks.length > 0
          ? state.chunks.map((c) => (
              <span
                key={c.id}
                className="animate-[fadein_150ms_ease-out]"
              >
                {c.text}
              </span>
            ))
          : state.content}
        {state.status === "streaming" && state.content && (
          <span className="inline-block w-0.5 h-4 ml-0.5 bg-amber-500 align-middle animate-[breathe_1s_ease-in-out_infinite]" />
        )}
      </div>

    </div>
  );
}

function StatusDot({ status }: { status: PanelState["status"] }) {
  const styles = {
    idle: "bg-gray-300",
    streaming: "bg-amber-400 animate-pulse",
    done: "bg-green-400",
    error: "bg-red-400",
  };
  return (
    <span
      className={`inline-block w-2.5 h-2.5 rounded-full ${styles[status]}`}
      title={status}
    />
  );
}
