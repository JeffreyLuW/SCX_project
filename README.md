# SCX Model Comparison App

A full-stack web application that lets users compare responses from multiple AI models side by side in real time.

Built with Next.js 14, TypeScript, and Tailwind CSS, powered by the [SCX.ai](https://scx.ai) API.

## Demo

> Select up to 3 models → type a question → see all responses stream in simultaneously

## Features

- **Side-by-side comparison** — run the same prompt across multiple models at once
- **Real-time streaming** — responses appear token by token as they are generated
- **Model info badges** — each panel shows the model's provider, context window, and capabilities (Reasoning / Vision / Tools / Coding)
- **Response metadata** — displays response time (ms) and token usage per model
- **Reasoning display** — for models that expose chain-of-thought, the thinking process appears in a collapsible section
- **15 models supported** — including DeepSeek, GLM, Qwen, MiniMax, Llama, Gemma, and GPT OSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes (Edge Runtime) |
| Language | TypeScript |
| API | SCX.ai (OpenAI-compatible) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- An SCX.ai API key

### Installation

```bash
git clone https://github.com/your-username/scx-model-comparison.git
cd scx-model-comparison
npm install
```

### Environment Variables

Create a `.env.local` file in the project root: