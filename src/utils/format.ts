import type { ExamType } from "@/types";
import { translate, type Language } from "@/utils/i18n";

/** Locale tag used for date/number formatting. Keeps Western-Arabic digits for readability. */
function localeTag(lang: Language): string {
  return lang === "ar" ? "ar-SA-u-nu-latn" : "en-GB";
}

export function formatDate(iso: string, lang: Language = "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(localeTag(lang), { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string, lang: Language = "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(localeTag(lang), {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(iso: string, lang: Language = "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString(localeTag(lang), { hour: "2-digit", minute: "2-digit" });
}

export function relativeTime(iso: string, lang: Language = "en"): string {
  const now = new Date("2026-10-07T18:00:00");
  const d = new Date(iso);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return translate(lang, "common.justNow");
  if (diffMins < 60) return translate(lang, "common.minutesAgo", { count: diffMins });
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return translate(lang, "common.hoursAgo", { count: diffHours });
  const diffDays = Math.round(diffHours / 24);
  return translate(lang, "common.daysAgo", { count: diffDays });
}

export function examBadgeClasses(examType: ExamType): string {
  return examType === "qudurat"
    ? "bg-primary/10 text-primary border-primary/20"
    : "bg-accent/10 text-accent-foreground border-accent/30";
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
