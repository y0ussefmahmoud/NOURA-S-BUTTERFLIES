import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from '../locales';

const requiredNamespaces = [
  'common',
  'navigation',
  'home',
  'product',
  'cart',
  'account',
  'content',
  'admin',
  'forms',
  'seo',
];

const detectionConfig = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage'],
  lookupLocalStorage: 'language',
};

const initI18n = async () => {
  console.log('[i18n] Initializing i18n...');
  console.log('[i18n] Detection config:', detectionConfig);

  i18n.on('initialized', (options: unknown) => {
    console.log('[i18n] Initialized at', new Date().toISOString(), options);
  });

  try {
    // Check if resources are available
    console.log('[i18n] Checking resources availability...');
    console.log('[i18n] Resources object:', resources);
    console.log('[i18n] English namespaces:', Object.keys(resources.en || {}));
    console.log('[i18n] Arabic namespaces:', Object.keys(resources.ar || {}));

    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: ['en', 'ar'],
        nonExplicitSupportedLngs: true,
        defaultNS: 'common',
        ns: requiredNamespaces,
        saveMissing: true,
        missingKeyHandler: (lngs, namespace, key) => {
          console.warn('[i18n] Missing key:', { lngs, namespace, key });
        },
        debug: import.meta.env.DEV,
        returnEmptyString: false,
        returnNull: false,
        appendNamespaceToCIMode: true,
        parseMissingKeyHandler: (key) => {
          return `[missing:${key}]`;
        },
        detection: detectionConfig,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });

    console.log('[i18n] i18n initialized successfully');
    console.log('[i18n] Language:', i18n.language);
    console.log('[i18n] Available languages:', i18n.languages);
    console.log('[i18n] Loaded namespaces:', i18n.options?.ns);

    const missingNamespaces = requiredNamespaces.filter(
      (namespace) => !i18n.hasResourceBundle(i18n.language, namespace)
    );

    if (missingNamespaces.length > 0) {
      console.warn('[i18n] Missing namespaces:', missingNamespaces);
    }
  } catch (error) {
    console.error('[i18n] Initialization failed:', error);
    console.error('[i18n] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type',
    });

    // Try to initialize with minimal config as fallback
    console.log('[i18n] Attempting fallback initialization...');
    try {
      await i18n.use(initReactI18next).init({
        resources: {
          en: { common: { loading: 'Loading...', error: 'Error' } },
          ar: { common: { loading: 'جاري التحميل...', error: 'خطأ' } },
        },
        fallbackLng: 'en',
        supportedLngs: ['en', 'ar'],
        defaultNS: 'common',
        debug: import.meta.env.DEV,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
      console.log('[i18n] Fallback initialization successful');
    } catch (fallbackError) {
      console.error('[i18n] Fallback initialization also failed:', fallbackError);
      throw error; // Throw the original error
    }
  }
};

export const isI18nReady = initI18n().then(() => {
  console.log('[i18n] Initialization completion confirmed');
});

export default i18n;
