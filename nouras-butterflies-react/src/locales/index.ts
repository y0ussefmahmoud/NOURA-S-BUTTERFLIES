// Import all translation files for i18next configuration
import enCommon from './en/common.json';
import enNavigation from './en/navigation.json';
import enHome from './en/home.json';
import enProduct from './en/product.json';
import enCart from './en/cart.json';
import enAccount from './en/account.json';
import enContent from './en/content.json';
import enAdmin from './en/admin.json';
import enForms from './en/forms.json';
import enSeo from './en/seo.json';

import arCommon from './ar/common.json';
import arNavigation from './ar/navigation.json';
import arHome from './ar/home.json';
import arProduct from './ar/product.json';
import arCart from './ar/cart.json';
import arAccount from './ar/account.json';
import arContent from './ar/content.json';
import arAdmin from './ar/admin.json';
import arForms from './ar/forms.json';
import arSeo from './ar/seo.json';

const safeResource = <T>(resource: T, label: string): T => {
  try {
    return resource;
  } catch (error) {
    console.error(`[i18n] Failed to load ${label}:`, error);
    return {} as T;
  }
};

const getTranslationKeys = (value: unknown, prefix = ''): string[] => {
  if (!value || typeof value !== 'object') {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return getTranslationKeys(nested, nextPrefix);
    }
    return [nextPrefix];
  });
};

const validateLocaleKeys = (namespace: string, enResource: unknown, arResource: unknown) => {
  const enKeys = getTranslationKeys(enResource).sort();
  const arKeys = getTranslationKeys(arResource).sort();

  const missingInArabic = enKeys.filter((key) => !arKeys.includes(key));
  const extraInArabic = arKeys.filter((key) => !enKeys.includes(key));

  if (missingInArabic.length > 0) {
    console.warn(`[i18n] Missing Arabic keys in ${namespace}:`, missingInArabic);
  }

  if (extraInArabic.length > 0) {
    console.warn(`[i18n] Extra Arabic keys in ${namespace}:`, extraInArabic);
  }

  console.log(`[i18n] ${namespace} key counts:`, {
    en: enKeys.length,
    ar: arKeys.length,
  });
};

export const resources = {
  en: {
    common: safeResource(enCommon, 'en/common'),
    navigation: safeResource(enNavigation, 'en/navigation'),
    home: safeResource(enHome, 'en/home'),
    product: safeResource(enProduct, 'en/product'),
    cart: safeResource(enCart, 'en/cart'),
    account: safeResource(enAccount, 'en/account'),
    content: safeResource(enContent, 'en/content'),
    admin: safeResource(enAdmin, 'en/admin'),
    forms: safeResource(enForms, 'en/forms'),
    seo: safeResource(enSeo, 'en/seo'),
  },
  ar: {
    common: safeResource(arCommon, 'ar/common'),
    navigation: safeResource(arNavigation, 'ar/navigation'),
    home: safeResource(arHome, 'ar/home'),
    product: safeResource(arProduct, 'ar/product'),
    cart: safeResource(arCart, 'ar/cart'),
    account: safeResource(arAccount, 'ar/account'),
    content: safeResource(arContent, 'ar/content'),
    admin: safeResource(arAdmin, 'ar/admin'),
    forms: safeResource(arForms, 'ar/forms'),
    seo: safeResource(arSeo, 'ar/seo'),
  },
};

if (import.meta.env.DEV) {
  validateLocaleKeys('common', resources.en.common, resources.ar.common);
  validateLocaleKeys('navigation', resources.en.navigation, resources.ar.navigation);
  validateLocaleKeys('home', resources.en.home, resources.ar.home);
  validateLocaleKeys('product', resources.en.product, resources.ar.product);
  validateLocaleKeys('cart', resources.en.cart, resources.ar.cart);
  validateLocaleKeys('account', resources.en.account, resources.ar.account);
  validateLocaleKeys('content', resources.en.content, resources.ar.content);
  validateLocaleKeys('admin', resources.en.admin, resources.ar.admin);
  validateLocaleKeys('forms', resources.en.forms, resources.ar.forms);
  validateLocaleKeys('seo', resources.en.seo, resources.ar.seo);
}
