#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const LOCALES_DIR = path.join(__dirname, '../src/locales');
const NAMESPACES = ['common', 'navigation', 'home', 'product', 'cart', 'account', 'content', 'admin', 'forms', 'seo'];
const LANGUAGES = ['en', 'ar'];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function getTranslationKeys(value, prefix = '') {
  if (!value || typeof value !== 'object') {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, nested]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return getTranslationKeys(nested, nextPrefix);
    }
    return [nextPrefix];
  });
}

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function validateNamespace(namespace) {
  const results = {
    namespace,
    enKeys: [],
    arKeys: [],
    missingInArabic: [],
    missingInEnglish: [],
    extraInArabic: [],
    extraInEnglish: [],
    emptyValues: [],
    jsonErrors: [],
  };

  // Validate JSON files
  const enPath = path.join(LOCALES_DIR, 'en', `${namespace}.json`);
  const arPath = path.join(LOCALES_DIR, 'ar', `${namespace}.json`);

  const enValidation = validateJSON(enPath);
  const arValidation = validateJSON(arPath);

  if (!enValidation.valid) {
    results.jsonErrors.push(`English ${namespace}.json: ${enValidation.error}`);
  }

  if (!arValidation.valid) {
    results.jsonErrors.push(`Arabic ${namespace}.json: ${arValidation.error}`);
  }

  if (results.jsonErrors.length > 0) {
    return results;
  }

  // Load and parse translations
  const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const arTranslations = JSON.parse(fs.readFileSync(arPath, 'utf8'));

  // Get all keys
  results.enKeys = getTranslationKeys(enTranslations).sort();
  results.arKeys = getTranslationKeys(arTranslations).sort();

  // Find missing keys
  results.missingInArabic = results.enKeys.filter(key => !results.arKeys.includes(key));
  results.missingInEnglish = results.arKeys.filter(key => !results.enKeys.includes(key));

  // Find empty values
  const checkEmptyValues = (obj, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (value === null || value === undefined || value === '') {
        results.emptyValues.push(fullKey);
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        checkEmptyValues(value, fullKey);
      }
    });
  };

  checkEmptyValues(enTranslations, `en.${namespace}`);
  checkEmptyValues(arTranslations, `ar.${namespace}`);

  return results;
}

function validateAllNamespaces() {
  log('\n🔍 Validating Translations', colors.cyan);
  log('================================', colors.cyan);

  let totalErrors = 0;
  let totalWarnings = 0;
  const allResults = [];

  NAMESPACES.forEach(namespace => {
    const results = validateNamespace(namespace);
    allResults.push(results);

    // Log namespace header
    log(`\n📁 ${namespace.toUpperCase()}`, colors.blue);
    log('-'.repeat(50), colors.blue);

    // Log JSON errors
    if (results.jsonErrors.length > 0) {
      results.jsonErrors.forEach(error => {
        log(`❌ ${error}`, colors.red);
        totalErrors++;
      });
      return;
    }

    // Log key counts
    log(`📊 English keys: ${results.enKeys.length}`, colors.green);
    log(`📊 Arabic keys: ${results.arKeys.length}`, colors.green);

    // Log missing keys
    if (results.missingInArabic.length > 0) {
      log(`\n❌ Missing in Arabic (${results.missingInArabic.length}):`, colors.red);
      results.missingInArabic.forEach(key => {
        log(`   - ${key}`, colors.red);
      });
      totalErrors += results.missingInArabic.length;
    }

    if (results.missingInEnglish.length > 0) {
      log(`\n❌ Missing in English (${results.missingInEnglish.length}):`, colors.red);
      results.missingInEnglish.forEach(key => {
        log(`   - ${key}`, colors.red);
      });
      totalErrors += results.missingInEnglish.length;
    }

    // Log empty values
    if (results.emptyValues.length > 0) {
      log(`\n⚠️  Empty values (${results.emptyValues.length}):`, colors.yellow);
      results.emptyValues.forEach(key => {
        log(`   - ${key}`, colors.yellow);
      });
      totalWarnings += results.emptyValues.length;
    }

    // Log success if no issues
    if (results.missingInArabic.length === 0 && 
        results.missingInEnglish.length === 0 && 
        results.emptyValues.length === 0) {
      log('✅ All translations are complete!', colors.green);
    }
  });

  // Summary
  log('\n📋 SUMMARY', colors.magenta);
  log('=============', colors.magenta);
  
  if (totalErrors === 0 && totalWarnings === 0) {
    log('🎉 All translations are valid and complete!', colors.green);
  } else {
    if (totalErrors > 0) {
      log(`❌ Total Errors: ${totalErrors}`, colors.red);
    }
    if (totalWarnings > 0) {
      log(`⚠️  Total Warnings: ${totalWarnings}`, colors.yellow);
    }
  }

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalErrors,
      totalWarnings,
      namespaces: NAMESPACES.length,
    },
    results: allResults,
  };

  const reportPath = path.join(__dirname, '../translation-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`\n📄 Detailed report saved to: ${reportPath}`, colors.cyan);

  return totalErrors === 0;
}

// Check if script is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = validateAllNamespaces();
  process.exit(success ? 0 : 1);
}

export { validateAllNamespaces, validateNamespace };
