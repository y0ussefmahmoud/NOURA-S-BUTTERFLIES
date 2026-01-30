import { Helmet } from 'react-helmet-async';
import { useLanguageContext } from '../contexts/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  language?: 'en' | 'ar';
  alternateUrls?: {
    en?: string;
    ar?: string;
  };
}

export const SEO = ({
  title = "Noura's Butterflies - Natural & Organic Beauty Products",
  description = 'Discover premium natural and organic beauty products. Cruelty-free, vegan-friendly cosmetics for radiant skin.',
  keywords = 'natural beauty, organic cosmetics, vegan beauty, cruelty-free, skincare, makeup',
  image = '/images/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
  language,
  alternateUrls,
}: SEOProps) => {
  const { language: currentLanguage } = useLanguageContext();
  const finalLanguage = language || currentLanguage;
  
  const siteName = finalLanguage === 'ar' ? 'نورا الفراشات' : "Noura's Butterflies";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  // Generate alternate URLs based on current URL if not provided
  const generateAlternateUrl = (lang: 'en' | 'ar') => {
    if (alternateUrls?.[lang]) {
      return alternateUrls[lang];
    }
    
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    
    // Simple path transformation - can be enhanced based on routing structure
    if (lang === 'ar' && !currentPath.startsWith('/ar')) {
      return `${baseUrl}/ar${currentPath}`;
    } else if (lang === 'en' && currentPath.startsWith('/ar')) {
      return `${baseUrl}${currentPath.replace('/ar', '')}`;
    }
    
    return url;
  };

  const enUrl = generateAlternateUrl('en');
  const arUrl = generateAlternateUrl('ar');

  // Locale-specific Open Graph tags
  const ogLocale = finalLanguage === 'ar' ? 'ar_SA' : 'en_US';
  const ogAlternateLocale = finalLanguage === 'ar' ? 'en_US' : 'ar_SA';

  return (
    <Helmet>
      {/* HTML Language and Direction */}
      <html lang={finalLanguage === 'ar' ? 'ar' : 'en'} dir={finalLanguage === 'ar' ? 'rtl' : 'ltr'} />
      
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || siteName} />

      {/* Hreflang Tags for SEO */}
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ar" href={arUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogAlternateLocale} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && <meta property="article:author" content={author} />}

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
