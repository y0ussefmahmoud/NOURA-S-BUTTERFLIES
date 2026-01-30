import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

export type Direction = 'ltr' | 'rtl';

export interface LocaleConfig {
  direction: Direction;
  language: string;
}

export const defaultLocale: LocaleConfig = {
  direction: 'ltr',
  language: 'en',
};

export const supportedLocales: Record<string, LocaleConfig> = {
  en: { direction: 'ltr', language: 'en' },
  ar: { direction: 'rtl', language: 'ar' },
  he: { direction: 'rtl', language: 'he' },
};

export function getDirection(locale: string = 'en'): Direction {
  return supportedLocales[locale]?.direction || defaultLocale.direction;
}

export function isRTL(locale: string = 'en'): boolean {
  return getDirection(locale) === 'rtl';
}

export function setDocumentDirection(locale: string = 'en'): void {
  const direction = getDirection(locale);
  document.documentElement.dir = direction;
  document.documentElement.lang = supportedLocales[locale]?.language || defaultLocale.language;
}

export function getTextAlign(
  direction: Direction
): 'text-left' | 'text-right' | 'text-start' | 'text-end' {
  return direction === 'rtl' ? 'text-right' : 'text-left';
}

export function getFlexDirection(direction: Direction): 'flex-row' | 'flex-row-reverse' {
  return direction === 'rtl' ? 'flex-row-reverse' : 'flex-row';
}

const missingTranslationKeys = new Set<string>();

export function validateTranslationKey(key: string, namespace?: string): boolean {
  if (!key) {
    return false;
  }

  const exists = i18n.exists(key, { ns: namespace });
  if (!exists) {
    missingTranslationKeys.add(`${namespace ?? 'default'}:${key}`);
  }
  return exists;
}

export function getTranslationWithFallback(
  key: string,
  fallback: string,
  namespace?: string
): string {
  if (validateTranslationKey(key, namespace)) {
    return i18n.t(key, { ns: namespace });
  }
  return fallback;
}

export function logMissingTranslations(): void {
  if (missingTranslationKeys.size === 0) {
    return;
  }

  console.warn('[i18n] Missing translation keys detected:', Array.from(missingTranslationKeys));
}

export function isNamespaceAvailable(namespace: string): boolean {
  return i18n.hasResourceBundle(i18n.language, namespace);
}

export function doesTranslationKeyExist(key: string, namespace?: string): boolean {
  return i18n.exists(key, { ns: namespace });
}

export const useTranslationDebug = (namespace?: string) => {
  const translation = useTranslation(namespace);

  if (import.meta.env.DEV) {
    const originalT = translation.t;
    const debugT = ((key: string, options?: Record<string, unknown>) => {
      const resolvedNamespace = options?.ns ?? namespace;
      validateTranslationKey(key, resolvedNamespace as string | undefined);
      return originalT(key, options);
    }) as typeof translation.t;

    return { ...translation, t: debugT };
  }

  return translation;
};
