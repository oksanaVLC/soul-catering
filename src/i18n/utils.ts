import es from './es.json';

export const languages = ['es', 'en', 'fr', 'ru'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'es';

/**
 * Languages that ALREADY have published pages. The rest appear in the selector as pending
 * (no link) so as not to point to pages that do not exist (404).
 * PENDING DECISION: the final list of languages (es/en/fr/ru in CLAUDE.md or ES/EN/CA/FR).
 */
export const publishedLanguages: readonly Lang[] = ['es'];

export function isPublished(lang: Lang): boolean {
  return publishedLanguages.includes(lang);
}

type Key = keyof typeof es;

// en/fr/ru arrive in phase 6. Until then, everything falls back to Spanish.
const ui: Partial<Record<Lang, Partial<Record<Key, string>>>> = { es };

export function isLang(value: string | undefined): value is Lang {
  return languages.includes(value as Lang);
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return isLang(first) ? first : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: Key, vars: Record<string, string | number> = {}): string {
    const text = ui[lang]?.[key] ?? es[key];
    return text.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
  };
}

/** Internal path in the given language: '/extras' → '/en/extras'. */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

/** Same page in another language, from the current pathname. */
export function switchLangPath(pathname: string, lang: Lang): string {
  const parts = pathname.split('/');
  if (isLang(parts[1])) parts.splice(1, 1);
  const base = parts.join('/') || '/';
  return localizePath(base, lang);
}
