"use client";

import { useState } from "react";
import { Search } from "lucide-react";
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
  customFrom = "",
  customTo = "",
}: DateFilterBarProps) {
  const [localFrom, setLocalFrom] = useState(customFrom);
  const [localTo, setLocalTo] = useState(customTo);

  const canApply = !!localFrom && !!localTo;

  const applyCustomFilter = () => {
    if (canApply) {
      onChange("custom", localFrom, localTo);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {presets.map((preset) => (
        <Button
          key={preset}
          variant={selected === preset ? "default" : "outline"}
          size="sm"
          disabled={loading}
          onClick={() => {
            if (preset !== "custom") {
              onChange(preset);
            } else if (selected !== "custom") {
              onChange("custom", "", "");
            }
          }}
        >
          {PRESET_LABELS[preset]}
        </Button>
      ))}
      {selected === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="datetime-local"
            className="h-8 text-xs"
            value={localFrom}
            onChange={(e) => setLocalFrom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyCustomFilter()}
            disabled={loading}
          />
          <span className="text-sm text-muted-foreground">a</span>
          <Input
            type="datetime-local"
            className="h-8 text-xs"
            value={localTo}
            onChange={(e) => setLocalTo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyCustomFilter()}
            disabled={loading}
          />
          <Button
            size="sm"
            disabled={loading || !canApply}
            onClick={applyCustomFilter}
          >
            <Search className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
      )}
    </div>
  );
}
