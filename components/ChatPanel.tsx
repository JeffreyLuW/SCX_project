"use client";

import { useEffect, useRef } from "react";
import { getModelById } from "@/lib/models";
import { ModelInfoBadges } from "@/components/ModelBadge";

export interface PanelState {
  modelId: string;
  status: "idle" | "streaming" | "done" | "error";
  content: string;
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
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full min-h-[300px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-800">
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

      {/* Content area */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-4 py-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono"
      >
        {state.status === "idle" && (
          <span className="text-gray-400 italic">
            Waiting for your question…
          </span>
        )}
        {state.status === "error" && (
          <div className="space-y-2">
            {state.statusCode !== undefined && (
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                HTTP {state.statusCode}
              </span>
            )}
            <div className="text-red-500 text-sm break-words">
              {state.error ?? "An error occurred."}
            </div>
          </div>
        )}
        {state.status === "streaming" &&
          !state.content &&
          !state.thinkingContent && (
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          )}
        {state.thinkingContent && (
          <details
            open={state.status === "streaming"}
            className="mb-3 text-xs"
          >
            <summary className="cursor-pointer select-none font-medium text-indigo-500 mb-1">
              💭 Thinking
            </summary>
            <div className="pl-3 border-l border-gray-200 italic text-gray-400 whitespace-pre-wrap">
              {state.thinkingContent}
            </div>
          </details>
        )}
        {state.content}
        {state.status === "streaming" && state.content && (
          <span className="inline-block w-1 h-4 ml-0.5 bg-indigo-400 animate-pulse align-middle" />
        )}
      </div>

      {/* Footer: metadata */}
      {(state.status === "done" || state.status === "streaming") &&
        (state.responseTimeMs !== undefined || state.tokenUsage) && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex gap-4 text-xs text-gray-400">
            {state.responseTimeMs !== undefined && (
              <span>⏱ {state.responseTimeMs} ms</span>
            )}
            {state.tokenUsage && (
              <span>
                🔢 {state.tokenUsage.completion_tokens} tokens out /{" "}
                {state.tokenUsage.total_tokens} total
              </span>
            )}
          </div>
        )}
    </div>
  );
}

function StatusDot({ status }: { status: PanelState["status"] }) {
  const styles = {
    idle: "bg-gray-300",
    streaming: "bg-yellow-400 animate-pulse",
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
