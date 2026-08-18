export type ModelCapability = "reasoning" | "vision" | "tools" | "coding";

export interface ModelMeta {
  id: string;
  name: string;
  provider: string;
  contextWindow: number; // in tokens
  capabilities: ModelCapability[];
  description: string;
}

export const MODELS: ModelMeta[] = [
  {
    id: "MAGPiE",
    name: "MAGPiE",
    provider: "SCX.ai",
    contextWindow: 131000,
    capabilities: ["reasoning", "tools"],
    description: "SCX flagship model, 117B MoE architecture",
  },
  {
    id: "coder",
    name: "Coder",
    provider: "SCX.ai",
    contextWindow: 197000,
    capabilities: ["reasoning", "tools", "coding"],
    description: "Optimized for coding tasks",
  },
  {
    id: "MiniMax-M2.7",
    name: "MiniMax M2.7",
    provider: "MiniMax",
    contextWindow: 192000,
    capabilities: ["reasoning", "tools"],
    description: "Fast and agentic",
  },
  {
    id: "MiniMax-M2.5",
    name: "MiniMax M2.5",
    provider: "MiniMax",
    contextWindow: 197000,
    capabilities: ["reasoning", "tools", "coding"],
    description: "SOTA coding — SWE-Bench 80.2%",
  },
  {
    id: "DeepSeek-V4-pro",
    name: "DeepSeek V4 Pro",
    provider: "DeepSeek",
    contextWindow: 1000000,
    capabilities: ["reasoning", "tools"],
    description: "Most powerful DeepSeek model, 1.6T MoE",
  },
  {
    id: "DeepSeek-V4-flash",
    name: "DeepSeek V4 Flash",
    provider: "DeepSeek",
    contextWindow: 1000000,
    capabilities: ["reasoning", "tools"],
    description: "Fast tier DeepSeek model",
  },
  {
    id: "DeepSeek-V3.1",
    name: "DeepSeek V3.1",
    provider: "DeepSeek",
    contextWindow: 131000,
    capabilities: ["reasoning", "tools"],
    description: "671B MoE model",
  },
  {
    id: "Qwen3-32B",
    name: "Qwen3 32B",
    provider: "Alibaba",
    contextWindow: 33000,
    capabilities: ["reasoning", "tools"],
    description: "Lightweight Qwen model",
  },
  {
    id: "Qwen3.8-Max",
    name: "Qwen3.8 Max",
    provider: "Alibaba",
    contextWindow: 1000000,
    capabilities: ["reasoning", "tools", "vision"],
    description: "Alibaba flagship, supports vision",
  },
  {
    id: "GLM-5.2",
    name: "GLM 5.2",
    provider: "Z.ai",
    contextWindow: 1000000,
    capabilities: ["reasoning", "tools", "coding"],
    description: "Long-horizon agentic coding",
  },
  {
    id: "GLM-5.2-Fast",
    name: "GLM 5.2 Fast",
    provider: "Z.ai",
    contextWindow: 1000000,
    capabilities: ["reasoning", "tools", "coding"],
    description: "Fast version of GLM-5.2",
  },
  {
    id: "gpt-oss-120b",
    name: "GPT OSS 120B",
    provider: "OpenAI",
    contextWindow: 131000,
    capabilities: ["reasoning", "tools"],
    description: "Open-weight, near o4-mini reasoning",
  },
  {
    id: "gemma-4-31B-it",
    name: "Gemma 4 31B",
    provider: "Google",
    contextWindow: 131000,
    capabilities: ["reasoning", "tools", "vision"],
    description: "Multimodal, supports vision",
  },
  {
    id: "Llama-4-Maverick-17B-128E-Instruct",
    name: "Llama 4 Maverick",
    provider: "Meta",
    contextWindow: 131000,
    capabilities: ["tools", "vision"],
    description: "Multimodal, supports vision",
  },
  {
    id: "Meta-Llama-3.3-70B-Instruct",
    name: "Llama 3.3 70B",
    provider: "Meta",
    contextWindow: 131000,
    capabilities: ["tools"],
    description: "70B instruction-tuned model",
  },
];

export function getModelById(id: string): ModelMeta | undefined {
  return MODELS.find((m) => m.id === id);
}

export function formatContextWindow(tokens: number): string {
  if (tokens >= 1000000) return `${tokens / 1000000}M`;
  if (tokens >= 1000) return `${tokens / 1000}K`;
  return `${tokens}`;
}
