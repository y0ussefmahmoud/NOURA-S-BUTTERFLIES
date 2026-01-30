/**
 * Color Contrast Ratio Calculator
 * Implements WCAG 2.1 contrast ratio calculations
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.0 definition
 */
export const getLuminance = (rgb: RGB): number => {
  const { r, g, b } = rgb;

  // Normalize sRGB values to linear RGB
  const normalize = (c: number): number => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const rLinear = normalize(r);
  const gLinear = normalize(g);
  const bLinear = normalize(b);

  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

/**
 * Calculate contrast ratio between two colors
 * Returns ratio in the format "X:1"
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  // Ensure lighter color is numerator
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  // Calculate contrast ratio
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export const meetsWCAG_AA = (ratio: number, isLargeText: boolean = false): boolean => {
  const threshold = isLargeText ? 3.0 : 4.5;
  return ratio >= threshold;
};

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export const meetsWCAG_AAA = (ratio: number, isLargeText: boolean = false): boolean => {
  const threshold = isLargeText ? 4.5 : 7.0;
  return ratio >= threshold;
};

/**
 * Get WCAG compliance level for a contrast ratio
 */
export const getWCAGCompliance = (
  ratio: number,
  isLargeText: boolean = false
): {
  AA: boolean;
  AAA: boolean;
  level: 'fail' | 'AA' | 'AAA';
} => {
  const AA = meetsWCAG_AA(ratio, isLargeText);
  const AAA = meetsWCAG_AAA(ratio, isLargeText);

  let level: 'fail' | 'AA' | 'AAA' = 'fail';
  if (AAA) level = 'AAA';
  else if (AA) level = 'AA';

  return { AA, AAA, level };
};

/**
 * Analyze color combinations in a theme object
 */
export const analyzeThemeContrast = (
  theme: any
): {
  combinations: Array<{
    foreground: string;
    background: string;
    ratio: number;
    compliance: ReturnType<typeof getWCAGCompliance>;
    usage: string;
  }>;
  issues: string[];
} => {
  const combinations: Array<{
    foreground: string;
    background: string;
    ratio: number;
    compliance: ReturnType<typeof getWCAGCompliance>;
    usage: string;
  }> = [];

  const issues: string[] = [];

  // Primary text on background
  const primaryOnLight = getContrastRatio(theme.colors.text.dark, theme.colors.background.light);
  combinations.push({
    foreground: theme.colors.text.dark,
    background: theme.colors.background.light,
    ratio: primaryOnLight,
    compliance: getWCAGCompliance(primaryOnLight),
    usage: 'Primary text on light background',
  });

  const primaryOnDark = getContrastRatio(theme.colors.text.light, theme.colors.background.dark);
  combinations.push({
    foreground: theme.colors.text.light,
    background: theme.colors.background.dark,
    ratio: primaryOnDark,
    compliance: getWCAGCompliance(primaryOnDark),
    usage: 'Primary text on dark background',
  });

  // Soft text on background
  const softOnLight = getContrastRatio(theme.colors.text.soft, theme.colors.background.light);
  combinations.push({
    foreground: theme.colors.text.soft,
    background: theme.colors.background.light,
    ratio: softOnLight,
    compliance: getWCAGCompliance(softOnLight),
    usage: 'Soft text on light background',
  });

  // Primary button text
  const primaryButtonOnPrimary = getContrastRatio(theme.colors.text.dark, theme.colors.primary);
  combinations.push({
    foreground: theme.colors.text.dark,
    background: theme.colors.primary,
    ratio: primaryButtonOnPrimary,
    compliance: getWCAGCompliance(primaryButtonOnPrimary),
    usage: 'Button text on primary background',
  });

  // Gold accent on backgrounds
  const goldOnLight = getContrastRatio(theme.colors.gold, theme.colors.background.light);
  combinations.push({
    foreground: theme.colors.gold,
    background: theme.colors.background.light,
    ratio: goldOnLight,
    compliance: getWCAGCompliance(goldOnLight),
    usage: 'Gold accent on light background',
  });

  const goldOnDark = getContrastRatio(theme.colors.gold, theme.colors.background.dark);
  combinations.push({
    foreground: theme.colors.gold,
    background: theme.colors.background.dark,
    ratio: goldOnDark,
    compliance: getWCAGCompliance(goldOnDark),
    usage: 'Gold accent on dark background',
  });

  // Check for issues
  combinations.forEach((combo) => {
    if (!combo.compliance.AA) {
      issues.push(
        `${combo.usage}: Ratio ${combo.ratio.toFixed(2)}:1 (fails WCAG AA - needs ${4.5}:1)`
      );
    }
  });

  return { combinations, issues };
};

/**
 * Generate a contrast report for the theme
 */
export const generateContrastReport = (theme: any): string => {
  const analysis = analyzeThemeContrast(theme);

  let report = '# Color Contrast Accessibility Report\n\n';
  report += '## WCAG 2.1 Compliance Summary\n\n';

  if (analysis.issues.length === 0) {
    report += '✅ All color combinations meet WCAG AA standards\n\n';
  } else {
    report += `❌ ${analysis.issues.length} color combination(s) fail WCAG AA standards\n\n`;
  }

  report += '## Detailed Analysis\n\n';
  report += '| Usage | Foreground | Background | Ratio | WCAG AA | WCAG AAA |\n';
  report += '|-------|-----------|------------|-------|---------|----------|\n';

  analysis.combinations.forEach((combo) => {
    const aaIcon = combo.compliance.AA ? '✅' : '❌';
    const aaaIcon = combo.compliance.AAA ? '✅' : '❌';
    report += `| ${combo.usage} | ${combo.foreground} | ${combo.background} | ${combo.ratio.toFixed(2)}:1 | ${aaIcon} | ${aaaIcon} |\n`;
  });

  if (analysis.issues.length > 0) {
    report += '\n## Issues to Fix\n\n';
    analysis.issues.forEach((issue) => {
      report += `- ${issue}\n`;
    });
  }

  return report;
};
