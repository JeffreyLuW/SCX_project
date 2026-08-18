import { ModelCapability } from "@/lib/models";

const BADGE_STYLES: Record<ModelCapability, string> = {
  reasoning: "bg-purple-100 text-purple-700 border-purple-200",
  vision: "bg-blue-100 text-blue-700 border-blue-200",
  tools: "bg-green-100 text-green-700 border-green-200",
  coding: "bg-orange-100 text-orange-700 border-orange-200",
};

const BADGE_LABELS: Record<ModelCapability, string> = {
  reasoning: "Reasoning",
  vision: "Vision",
  tools: "Tools",
  coding: "Coding",
};

interface ModelBadgeProps {
  capability: ModelCapability;
}

export function CapabilityBadge({ capability }: ModelBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${BADGE_STYLES[capability]}`}
    >
      {BADGE_LABELS[capability]}
    </span>
  );
}

interface ModelInfoBadgesProps {
  capabilities: ModelCapability[];
  provider: string;
  contextWindow: number;
}

export function ModelInfoBadges({
  capabilities,
  provider,
  contextWindow,
}: ModelInfoBadgesProps) {
  const ctxLabel =
    contextWindow >= 1000000
      ? `${contextWindow / 1000000}M ctx`
      : `${contextWindow / 1000}K ctx`;

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
        {provider}
      </span>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
        {ctxLabel}
      </span>
      {capabilities.map((cap) => (
        <CapabilityBadge key={cap} capability={cap} />
      ))}
    </div>
  );
}
