const SA_LOCAL_PHONE_REGEX = /^(\d{3})(\d{3})(\d{4})$/;
const SA_INTL_PHONE_REGEX = /^(\d{3})(\d{2})(\d{3})(\d{4})$/;
const AMEX_CARD_REGEX = /^(\d{4})(\d{6})(\d{5})$/;

const formatWithPattern = (value: string, pattern: RegExp, template: string): string | null => {
  const match = value.match(pattern);
  if (!match) return null;
  return template.replace(/\$(\d)/g, (_, index) => match[Number(index)] || '');
};

export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.startsWith('05')) {
    const formatted = formatWithPattern(cleaned, SA_LOCAL_PHONE_REGEX, '$1 $2 $3');
    if (formatted) return formatted;
  }

  if (cleaned.startsWith('966')) {
    const formatted = formatWithPattern(cleaned, SA_INTL_PHONE_REGEX, '+$1 $2 $3 $4');
    if (formatted) return formatted;
  }

  if (cleaned.startsWith('5') && cleaned.length === 9) {
    const normalized = `05${cleaned}`;
    const formatted = formatWithPattern(normalized, SA_LOCAL_PHONE_REGEX, '$1 $2 $3');
    if (formatted) return formatted;
  }

  return value;
};

export const formatPostalCode = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 5);
  return cleaned;
};

export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, '');

  if (cleaned.startsWith('3')) {
    const formatted = formatWithPattern(cleaned, AMEX_CARD_REGEX, '$1 $2 $3');
    if (formatted) return formatted;
    return cleaned.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(' ')
    );
  }

  return cleaned
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim()
    .slice(0, 19);
};

export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length >= 3) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};
