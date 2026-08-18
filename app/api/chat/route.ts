import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const apiKey = process.env.SCX_API_KEY;
  let model: string | undefined;
  let messages: unknown;

  try {
    const body = await req.json();
    model = body.model;
    messages = body.messages;
  } catch (err) {
    console.error("[chat] failed to parse JSON body", err);
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  console.log("[chat] dispatching", {
    model,
    hasKey: !!apiKey,
  });

  if (!apiKey) {
    console.error("[chat] SCX_API_KEY not set in env");
    return NextResponse.json(
      { error: "SCX_API_KEY is not configured" },
      { status: 500 }
    );
  }

  if (!model || !messages || !Array.isArray(messages)) {
    console.error("[chat] missing required fields", {
      model,
      hasMessages: !!messages,
    });
    return NextResponse.json(
      { error: "Missing required fields: model, messages" },
      { status: 400 }
    );
  }

  const startTime = Date.now();

  try {
    console.log("[chat] calling SCX", {
      url: "https://api.scx.ai/v1/chat/completions",
      model,
    });

    const response = await fetch("https://api.scx.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        stream_options: { include_usage: true },
      }),
    });

    console.log("[chat] SCX responded", {
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[chat] SCX upstream error", {
        status: response.status,
        body: errorText,
        model,
      });
      return NextResponse.json(
        { error: `SCX API error: ${response.status} — ${errorText}` },
        { status: response.status }
      );
    }

    // Pass the SSE stream straight through to the client,
    // injecting x-response-start-ms so the client can measure latency.
    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "x-response-start-ms": String(Date.now() - startTime),
    });

    return new Response(response.body, { headers });
  } catch (err) {
    console.error("[chat] route threw", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
