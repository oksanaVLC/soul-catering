import es from './es.json';
import en from './en.json';
import fr from './fr.json';
import ru from './ru.json';

export const languages = ['es', 'en', 'fr', 'ru'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'es';

/**
 * Languages that ALREADY have published pages. The rest appear in the selector as pending
 * (no link) so as not to point to pages that do not exist (404).
 * en/fr/ru: FIRST DRAFT translations (TODO revisar), see the "_todo" key of each JSON.
 */
export const publishedLanguages: readonly Lang[] = ['es', 'en', 'fr', 'ru'];

export function isPublished(lang: Lang): boolean {
  return publishedLanguages.includes(lang);
}

export type Key = keyof typeof es;

// Missing keys in en/fr/ru fall back to Spanish.
const ui: Record<Lang, Partial<Record<string, string>>> = { es, en, fr, ru };

export function isLang(value: string | undefined): value is Lang {
  return languages.includes(value as Lang);
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return isLang(first) ? first : defaultLang;
}

/** Translation function. Dynamic keys (`svc.${id}.title`) are allowed: an unknown key returns itself. */
export type T = (key: Key | (string & {}), vars?: Record<string, string | number>) => string;

export function useTranslations(lang: Lang): T {
  return function t(key, vars = {}) {
    const text = ui[lang]?.[key] ?? (es as Record<string, string>)[key] ?? key;
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

/** Static paths of the translated pages (/en, /fr, /ru): used by src/pages/[lang]/. */
export function localizedPaths() {
  return publishedLanguages.filter((lang) => lang !== defaultLang).map((lang) => ({ params: { lang } }));
}
