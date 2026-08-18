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
      <p className="text-sm text-gray-500 mb-3">
        Select up to {maxSelections} models to compare (
        {selectedIds.length}/{maxSelections} selected)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {MODELS.map((model: ModelMeta) => {
          const selected = selectedIds.includes(model.id);
          const disabled = !selected && selectedIds.length >= maxSelections;
          return (
            <button
              key={model.id}
              onClick={() => toggle(model.id)}
              disabled={disabled}
              className={`
                text-left px-4 py-3 rounded-xl border-2 transition-all
                ${
                  selected
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : disabled
                    ? "border-gray-200 bg-gray-50 opacity-40 cursor-not-allowed"
                    : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40"
                }
              `}
            >
              <div className="font-semibold text-gray-800 text-sm">
                {model.name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
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
