import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  toggleLanguage: () => void;
  changeLanguage: (newLanguage: 'en' | 'ar') => void;
  isRTL: boolean;
  isReady: boolean;
  hasError: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const normalizeLanguage = (value?: string | null): 'en' | 'ar' => {
  if (!value) {
    return 'en';
  }
  const base = value.toLowerCase().split('-')[0];
  return base === 'ar' ? 'ar' : 'en';
};

const LANGUAGE_STORAGE_KEY = 'language';
const OLD_LANGUAGE_STORAGE_KEY = 'noura-language';

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    try {
      // Load saved language from localStorage
      let savedLanguageRaw = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      // Check for old key and migrate to new key
      if (!savedLanguageRaw) {
        const oldLanguageRaw = localStorage.getItem(OLD_LANGUAGE_STORAGE_KEY);
        if (oldLanguageRaw) {
          savedLanguageRaw = oldLanguageRaw;
          // Save to new key
          localStorage.setItem(LANGUAGE_STORAGE_KEY, oldLanguageRaw);
          // Remove old key to avoid confusion
          localStorage.removeItem(OLD_LANGUAGE_STORAGE_KEY);
          console.log('[Language] Migrated language preference from old key to new key');
        }
      }
      
      const browserLanguage = normalizeLanguage(typeof navigator !== 'undefined' ? navigator.language : null);
      const initialLanguage = savedLanguageRaw ? normalizeLanguage(savedLanguageRaw) : browserLanguage;
      
      setLanguage(initialLanguage);
      
      // Update i18n language
      if (i18n.language !== initialLanguage) {
        i18n.changeLanguage(initialLanguage).catch((error) => {
          console.error('[Language] Failed to change i18n language:', error);
        });
      }
      
      // Update document attributes
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.dir = initialLanguage === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = initialLanguage;
      }
      
      setIsReady(true);
    } catch (error) {
      console.error('[Language] Error initializing language:', error);
      setHasError(true);
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    try {
      // Save to localStorage
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      
      // Update i18n
      if (i18n.language !== language) {
        i18n.changeLanguage(language).catch((error) => {
          console.error('[Language] Failed to change i18n language:', error);
        });
      }
      
      // Update document attributes
      if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
      }
    } catch (error) {
      console.error('[Language] Error updating language:', error);
      setHasError(true);
    }
  }, [language, isReady, i18n]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  const changeLanguage = (newLanguage: 'en' | 'ar') => {
    if (newLanguage !== language) {
      setLanguage(newLanguage);
    }
  };

  const value: LanguageContextType = {
    language,
    toggleLanguage,
    changeLanguage,
    isRTL: language === 'ar',
    isReady,
    hasError,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguageContext = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
