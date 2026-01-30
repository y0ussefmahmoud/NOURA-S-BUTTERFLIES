import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '../contexts/LanguageContext';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  language: 'en' | 'ar';
}

interface SEOVariables {
  productName?: string;
  category?: string;
  [key: string]: string | undefined;
}

export const useSEO = (page: string, variables: SEOVariables = {}): SEOData => {
  const { t } = useTranslation('seo');
  const { language } = useLanguageContext();

  // Get the base SEO data for the page
  const title = t(`${page}.title`, { ...variables });
  const description = t(`${page}.description`, { ...variables });
  const keywords = t(`${page}.keywords`, { ...variables });

  return {
    title,
    description,
    keywords,
    language,
  };
};
