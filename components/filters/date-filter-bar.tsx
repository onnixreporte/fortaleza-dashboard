"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type DatePreset, PRESET_LABELS } from "@/lib/date-filters";

interface DateFilterBarProps {
  selected: DatePreset;
  onChange: (preset: DatePreset, customFrom?: string, customTo?: string) => void;
  loading?: boolean;
  customFrom?: string;
  customTo?: string;
}

const presets: DatePreset[] = ["today", "yesterday", "week", "month", "custom"];

export function DateFilterBar({
  selected,
  onChange,
  loading,
  customFrom,
  customTo,
}: DateFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((preset) => (
        <Button
          key={preset}
          variant={selected === preset ? "default" : "outline"}
          size="sm"
          disabled={loading}
          onClick={() => onChange(preset, customFrom, customTo)}
        >
          {PRESET_LABELS[preset]}
        </Button>
      ))}
      {selected === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="datetime-local"
            className="h-8 text-xs"
            value={customFrom || ""}
            onChange={(e) => onChange("custom", e.target.value, customTo)}
            disabled={loading}
          />
          <span className="text-sm text-muted-foreground">a</span>
          <Input
            type="datetime-local"
            className="h-8 text-xs"
            value={customTo || ""}
            onChange={(e) => onChange("custom", customFrom, e.target.value)}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
}
