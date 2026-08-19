"use client";

import { MODELS, ModelMeta } from "@/lib/models";
import { ModelInfoBadges } from "@/components/ModelBadge";

interface ModelSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  maxSelections?: number;
}

export function ModelSelector({
  selectedIds,
  onChange,
  maxSelections = 3,
}: ModelSelectorProps) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else if (selectedIds.length < maxSelections) {
      onChange([...selectedIds, id]);
    }
  }

  return (
    <div className="w-full">
      <p className="text-sm text-stone-500 mb-3">
        Select up to {maxSelections} models to compare (
        {selectedIds.length}/{maxSelections} selected)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {MODELS.map((model: ModelMeta) => {
          const selected = selectedIds.includes(model.id);
          const atMax = !selected && selectedIds.length >= maxSelections;
          const unavailable = !model.available;
          const disabled = atMax || unavailable;
          return (
            <button
              key={model.id}
              onClick={() => toggle(model.id)}
              disabled={disabled}
              className={`
                text-left px-4 py-3 rounded-2xl border-2 transition-all duration-150 relative
                ${
                  unavailable
                    ? "border-[#E8E4DC] bg-stone-50 opacity-50 cursor-not-allowed"
                    : selected
                    ? "border-amber-600 bg-amber-50 shadow-[inset_0_0_8px_rgba(217,119,6,0.1)]"
                    : atMax
                    ? "border-[#E8E4DC] bg-stone-50 opacity-40 cursor-not-allowed"
                    : "border-[#E8E4DC] bg-white shadow-sm hover:shadow-[0_0_0_2px_#F59E0B,0_4px_20px_rgba(245,158,11,0.15)] hover:-translate-y-0.5"
                }
              `}
            >
              {unavailable && (
                <span className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  Not on your tier
                </span>
              )}
              <div className="font-semibold text-stone-900 text-sm">
                {model.name}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                {model.description}
              </div>
              <ModelInfoBadges
                capabilities={model.capabilities}
                provider={model.provider}
                contextWindow={model.contextWindow}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
