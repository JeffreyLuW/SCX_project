"use client";

import { useState, useCallback, useEffect } from "react";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { ModelSelector } from "@/components/ModelSelector";
import { ChatPanel, PanelState } from "@/components/ChatPanel";
import { getModelById } from "@/lib/models";

function createIdlePanel(modelId: string): PanelState {
  return { modelId, status: "idle", content: "" };
}

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [panels, setPanels] = useState<PanelState[]>([]);
  const [running, setRunning] = useState(false);
  const [image, setImage] = useState<{ dataUrl: string; fileName: string } | null>(null);

  const visionSelected = selectedIds.some(
    (id) => getModelById(id)?.capabilities.includes("vision") ?? false
  );

  useEffect(() => {
    if (!visionSelected && image) {
      setImage(null);
    }
  }, [visionSelected, image]);

  const updatePanel = useCallback(
    (modelId: string, patch: Partial<PanelState>) => {
      setPanels((prev) =>
        prev.map((p) => (p.modelId === modelId ? { ...p, ...patch } : p))
      );
    },
    []
  );

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage({ dataUrl: reader.result as string, fileName: file.name });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function streamModel(
    modelId: string,
    userPrompt: string,
    imageDataUrl: string | null
  ) {
    const hasVision = getModelById(modelId)?.capabilities.includes("vision") ?? false;
    const userMessage = imageDataUrl && hasVision
      ? {
          role: "user" as const,
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        }
      : { role: "user" as const, content: userPrompt };

    const startTime = Date.now();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelId,
          messages: [userMessage],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        updatePanel(modelId, {
          status: "error",
          error: err.error,
          statusCode: res.status,
        });
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

    await Promise.all(
      selectedIds.map((id) => streamModel(id, currentPrompt, image?.dataUrl ?? null))
    );

    setRunning(false);
  }

  const gridCols =
    selectedIds.length === 1
      ? "grid-cols-1"
      : selectedIds.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  // Show nothing while Clerk is loading
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </main>
    );
  }

  // Not signed in — show a gate
  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
          S
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">SCX Model Comparison</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to start comparing AI models</p>
        </div>
        <SignInButton mode="modal">
          <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            Sign in
          </button>
        </SignInButton>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900 leading-tight">
            SCX Model Comparison
          </h1>
          <p className="text-xs text-gray-400">Compare AI models side by side</p>
        </div>
        {/* User avatar + sign-out */}
        <UserButton afterSignOutUrl="/" />
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
        <div className="space-y-3">
          {image && (
            <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.dataUrl}
                alt={image.fileName}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="text-xs text-gray-600 truncate flex-1">
                {image.fileName}
              </span>
              <button
                type="button"
                onClick={() => setImage(null)}
                className="text-gray-400 hover:text-red-500 text-lg leading-none px-1"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}

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
            <label
              className={`flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                visionSelected
                  ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
                  : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
              }`}
              title={
                visionSelected
                  ? "Attach image"
                  : "Select a vision model to attach images"
              }
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={!visionSelected}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </label>
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
        </div>

        {/* Response panels */}
        {panels.length > 0 && (
          <div
            className={`flex md:grid snap-x snap-mandatory overflow-x-auto md:overflow-visible md:snap-none gap-4 ${gridCols}`}
          >
            {panels.map((panel) => (
              <div
                key={panel.modelId}
                className={`snap-start shrink-0 ${
                  panels.length === 1 ? "w-full" : "w-[85%]"
                } md:w-auto`}
              >
                <ChatPanel state={panel} />
              </div>
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
