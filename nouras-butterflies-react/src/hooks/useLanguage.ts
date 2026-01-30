import { useLanguageContext } from '../contexts/LanguageContext';

export const useLanguage = () => {
  try {
    const context = useLanguageContext();
    return context;
  } catch (error) {
    console.error('[useLanguage] Error in hook:', error);
    // Return fallback values
    return {
      language: 'en' as const,
      toggleLanguage: () => console.warn('[useLanguage] toggleLanguage not available'),
      changeLanguage: (lang: 'en' | 'ar') =>
        console.warn('[useLanguage] changeLanguage not available:', lang),
      isRTL: false,
      isReady: false,
      hasError: true,
    };
  }
};
