export const formatCurrency = (
  amount: number,
  language: 'en' | 'ar',
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (
  date: Date | string,
  language: 'en' | 'ar',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(
    language === 'ar' ? 'ar-SA' : 'en-US',
    options || { year: 'numeric', month: 'long', day: 'numeric' }
  ).format(dateObj);
};

export const formatNumber = (num: number, language: 'en' | 'ar'): string => {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(num);
};

export const formatRelativeDate = (
  date: Date | string,
  language: 'en' | 'ar'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  const rtf = new Intl.RelativeTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
    numeric: 'auto',
  });

  if (diffInDays === 0) {
    return rtf.format(0, 'day');
  } else if (diffInDays === 1) {
    return rtf.format(-1, 'day');
  } else if (diffInDays < 7) {
    return rtf.format(-diffInDays, 'day');
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return rtf.format(-weeks, 'week');
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return rtf.format(-months, 'month');
  } else {
    const years = Math.floor(diffInDays / 365);
    return rtf.format(-years, 'year');
  }
};

export const formatDateTime = (
  date: Date | string,
  language: 'en' | 'ar',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Intl.DateTimeFormat(
    language === 'ar' ? 'ar-SA' : 'en-US',
    options || defaultOptions
  ).format(dateObj);
};

export const formatPercentage = (
  value: number,
  language: 'en' | 'ar',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    ...options,
  }).format(value / 100);
};

export const formatCompactNumber = (
  num: number,
  language: 'en' | 'ar'
): string => {
  const locale = language === 'ar' ? 'ar-SA' : 'en-US';
  
  if (num >= 1000000) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  } else if (num >= 1000) {
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(num);
  }
  
  return new Intl.NumberFormat(locale).format(num);
};

export const formatPhoneNumber = (
  phone: string,
  language: 'en' | 'ar'
): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Basic phone formatting - can be enhanced based on country codes
  if (cleaned.length === 10) {
    if (language === 'ar') {
      // Arabic format: 05X XXX XXXX
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    } else {
      // English format: (XXX) XXX-XXXX
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
  }
  
  return phone;
};

export const formatWeight = (
  weight: number,
  unit: 'kg' | 'g' | 'lb' | 'oz',
  language: 'en' | 'ar'
): string => {
  const locale = language === 'ar' ? 'ar-SA' : 'en-US';
  const unitNames = {
    en: { kg: 'kg', g: 'g', lb: 'lb', oz: 'oz' },
    ar: { kg: 'كجم', g: 'جم', lb: 'رطل', oz: 'أوقية' },
  };
  
  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(weight)} ${unitNames[language][unit]}`;
};

export const formatDimensions = (
  length: number,
  width: number,
  height: number,
  unit: 'cm' | 'in',
  language: 'en' | 'ar'
): string => {
  const locale = language === 'ar' ? 'ar-SA' : 'en-US';
  const unitNames = {
    en: { cm: 'cm', in: 'in' },
    ar: { cm: 'سم', in: 'بوصة' },
  };
  
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
  
  return `${formatter.format(length)} × ${formatter.format(width)} × ${formatter.format(height)} ${unitNames[language][unit]}`;
};
