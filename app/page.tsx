"use client";

import { useState, useCallback } from "react";
import { ModelSelector } from "@/components/ModelSelector";
import { ChatPanel, PanelState } from "@/components/ChatPanel";

function createIdlePanel(modelId: string): PanelState {
  return { modelId, status: "idle", content: "" };
}

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "MAGPiE",
    "DeepSeek-V4-pro",
    "MiniMax-M2.7",
  ]);
  const [prompt, setPrompt] = useState("");
  const [panels, setPanels] = useState<PanelState[]>([]);
  const [running, setRunning] = useState(false);

  const updatePanel = useCallback(
    (modelId: string, patch: Partial<PanelState>) => {
      setPanels((prev) =>
        prev.map((p) => (p.modelId === modelId ? { ...p, ...patch } : p))
      );
    },
    []
  );

  async function streamModel(modelId: string, userPrompt: string) {
    const startTime = Date.now();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        updatePanel(modelId, { status: "error", error: err.error });
        return;
      }

      const firstByteMs = Date.now() - startTime;
      updatePanel(modelId, { status: "streaming", responseTimeMs: firstByteMs });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let content = "";
      let thinkingContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);

            if (parsed.usage) {
              updatePanel(modelId, { tokenUsage: parsed.usage });
            }

            const delta = parsed.choices?.[0]?.delta;
            if (!delta) continue;

            if (delta.reasoning_content) {
              thinkingContent += delta.reasoning_content;
              updatePanel(modelId, { thinkingContent });
            }

            if (delta.content) {
              content += delta.content;
              updatePanel(modelId, { content });
            }
          } catch {
            // Non-JSON lines — skip
          }
        }
      }

      updatePanel(modelId, {
        status: "done",
        responseTimeMs: Date.now() - startTime,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      updatePanel(modelId, { status: "error", error: message });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || selectedIds.length === 0 || running) return;

    const currentPrompt = prompt.trim();
    setRunning(true);
    setPanels(selectedIds.map(createIdlePanel));

    await Promise.all(selectedIds.map((id) => streamModel(id, currentPrompt)));

    setRunning(false);
  }

  const gridCols =
    selectedIds.length === 1
      ? "grid-cols-1"
      : selectedIds.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <div>
          <h1 className="font-semibold text-gray-900 leading-tight">
            SCX Model Comparison
          </h1>
          <p className="text-xs text-gray-400">Compare AI models side by side</p>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
        {/* Model selector */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Choose models to compare
          </h2>
          <ModelSelector
            selectedIds={selectedIds}
            onChange={setSelectedIds}
            maxSelections={3}
          />
        </section>

        {/* Prompt input */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask something… e.g. Explain quantum entanglement simply"
            disabled={running}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              disabled:opacity-50 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={running || selectedIds.length === 0 || !prompt.trim()}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold
              hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
              transition-colors shadow-sm"
          >
            {running ? "Running…" : "Compare →"}
          </button>
        </form>

        {/* Response panels */}
        {panels.length > 0 && (
          <div className={`grid ${gridCols} gap-4`}>
            {panels.map((panel) => (
              <ChatPanel key={panel.modelId} state={panel} />
            ))}
          </div>
        )}

        {panels.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">
            Select models above and ask a question to start comparing.
          </div>
        )}
      </div>
    </main>
  );
}
