import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en } from "./translations.en";
import { ar } from "./translations.ar";

export type Language = "ar" | "en";

export const LANGUAGE_STORAGE_KEY = "sabbaq-language";
export const DEFAULT_LANGUAGE: Language = "ar";

/** Recursive dictionary of translation strings. Leaves are plain strings (may contain {{placeholders}}). */
export interface TranslationDict {
  [key: string]: string | TranslationDict;
}

const resources: Record<Language, TranslationDict> = { en, ar };

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === "en" || stored === "ar" ? stored : DEFAULT_LANGUAGE;
}

function getByPath(dict: TranslationDict, path: string): string | undefined {
  const parts = path.split(".");
  let node: string | TranslationDict | undefined = dict;
  for (const part of parts) {
    if (typeof node !== "object" || node === null) return undefined;
    node = node[part];
  }
  return typeof node === "string" ? node : undefined;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match
  );
}

/**
 * Pure translate function usable outside React (e.g. zustand stores, toast
 * messages fired from non-component code). Falls back to English, then to the
 * raw key, so a missing translation never renders blank text.
 */
export function translate(
  lang: Language,
  key: string,
  vars?: Record<string, string | number>
): string {
  const primary = getByPath(resources[lang], key);
  if (primary !== undefined) return interpolate(primary, vars);
  const fallback = getByPath(resources.en, key);
  if (fallback !== undefined) return interpolate(fallback, vars);
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn(`[i18n] Missing translation key: "${key}"`);
  }
  return key;
}

/** Reads the persisted language preference without mounting the provider (for use in stores). */
export function getStoredLanguage(): Language {
  return readStoredLanguage();
}

interface LanguageContextValue {
  lang: Language;
  dir: "ltr" | "rtl";
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyDocumentAttributes(lang: Language) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => readStoredLanguage());

  useEffect(() => {
    applyDocumentAttributes(lang);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/** Primary hook for components: `const { t, lang, dir, setLang } = useTranslation();` */
export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
}
