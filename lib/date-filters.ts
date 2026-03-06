import { TZDate } from "@date-fns/tz";
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  differenceInHours,
} from "date-fns";

export const PY_TZ = "America/Asuncion";

export interface DateFilter {
  from: string;
  to: string;
  longTerm?: boolean;
}

export type DatePreset = "today" | "yesterday" | "week" | "month" | "custom";

function toUtcIso(tzDate: Date): string {
  return new Date(tzDate.getTime()).toISOString();
}

export function getDateFilter(
  preset: DatePreset,
  customFrom?: string,
  customTo?: string,
): DateFilter {
  const now = new TZDate(new Date(), PY_TZ);

  if (preset === "custom" && customFrom && customTo) {
    const fromDate = new TZDate(new Date(customFrom), PY_TZ);
    const toDate = new TZDate(new Date(customTo), PY_TZ);
    // Verificar que las fechas sean válidas antes de continuar
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return {
        from: toUtcIso(now),
        to: toUtcIso(now),
        longTerm: false,
      };
    }
    return {
      from: toUtcIso(fromDate),
      to: toUtcIso(toDate),
      longTerm: isLongTermRange(fromDate.toISOString(), toDate.toISOString()),
    };
  } else if (preset === "custom") {
    return {
      from: toUtcIso(now),
      to: toUtcIso(now),
      longTerm: false,
    };
  }

  switch (preset) {
    case "today": {
      const from = startOfDay(now);
      const to = endOfDay(now);
      return { from: toUtcIso(from), to: toUtcIso(to) };
    }
    case "yesterday": {
      const yesterday = subDays(now, 1);
      const from = startOfDay(yesterday);
      const to = endOfDay(yesterday);
      return { from: toUtcIso(from), to: toUtcIso(to) };
    }
    case "week": {
      const from = startOfDay(subDays(now, 6));
      const to = endOfDay(now);
      return {
        from: toUtcIso(from),
        to: toUtcIso(to),
        longTerm: true,
      };
    }
    case "month": {
      const from = startOfMonth(now);
      const to = endOfDay(now);
      return {
        from: toUtcIso(from),
        to: toUtcIso(to),
        longTerm: true,
      };
    }
  }
}

export function isLongTermRange(from: string, to: string): boolean {
  return differenceInHours(new Date(to), new Date(from)) > 24;
}

export const PRESET_LABELS: Record<DatePreset, string> = {
  today: "Hoy",
  yesterday: "Ayer",
  week: "Últimos 7 días",
  month: "Este mes",
  custom: "Personalizado",
};
