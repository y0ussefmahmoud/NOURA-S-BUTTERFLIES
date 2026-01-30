import { useLanguageContext } from '../contexts/LanguageContext';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatRelativeDate,
  formatDateTime,
  formatPercentage,
  formatCompactNumber,
  formatPhoneNumber,
  formatWeight,
  formatDimensions,
} from '../utils/translation';

export const useFormatting = () => {
  const { language } = useLanguageContext();

  return {
    formatCurrency: (amount: number, currency?: string) => 
      formatCurrency(amount, language, currency),
    formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => 
      formatDate(date, language, options),
    formatNumber: (num: number) => formatNumber(num, language),
    formatRelativeDate: (date: Date | string) => formatRelativeDate(date, language),
    formatDateTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) => 
      formatDateTime(date, language, options),
    formatPercentage: (value: number, options?: Intl.NumberFormatOptions) => 
      formatPercentage(value, language, options),
    formatCompactNumber: (num: number) => formatCompactNumber(num, language),
    formatPhoneNumber: (phone: string) => formatPhoneNumber(phone, language),
    formatWeight: (weight: number, unit: 'kg' | 'g' | 'lb' | 'oz') => 
      formatWeight(weight, unit, language),
    formatDimensions: (length: number, width: number, height: number, unit: 'cm' | 'in') => 
      formatDimensions(length, width, height, unit, language),
  };
};
