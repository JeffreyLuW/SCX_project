import { ModelCapability } from "@/lib/models";

const BADGE_STYLES: Record<ModelCapability, string> = {
  reasoning: "bg-amber-100 text-amber-800 border-amber-300",
  vision: "bg-orange-50 text-orange-700 border-orange-200",
  tools: "bg-emerald-50 text-emerald-700 border-emerald-100",
  coding: "bg-amber-50 text-amber-700 border-amber-200",
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
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
        {provider}
      </span>
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-500 border border-stone-200">
        {ctxLabel}
      </span>
      {capabilities.map((cap) => (
        <CapabilityBadge key={cap} capability={cap} />
      ))}
    </div>
  );
}
