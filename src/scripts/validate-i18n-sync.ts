#!/usr/bin/env node
/**
 * Synchronization validation script for i18n configuration.
 *
 * This script validates that locale configuration remains synchronized across:
 * - src/i18n/config.ts (source of truth)
 * - src/middleware.ts (Astro middleware)
 * - functions/_middleware.ts (Cloudflare Pages middleware)
 *
 * Run with: npx tsx src/scripts/validate-i18n-sync.ts
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ValidationResult {
  passed: boolean;
  errors: string[];
}

function extractValidLocales(content: string): string[] {
  // Extract locales array from config.ts: export const locales = ['en', 'cs'] as const;
  const localesMatch = content.match(/export const locales = \[(.*?)\]/s);
  if (!localesMatch) {
    throw new Error('Could not find locales array in config.ts');
  }
  const localesStr = localesMatch[1];
  return localesStr
    .split(',')
    .map((l) => l.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

function extractDefaultLocale(content: string): string {
  // Extract defaultLocale: export const defaultLocale: Locale = 'en';
  const match = content.match(/export const defaultLocale[^=]*=\s*['"]([^'"]+)['"]/);
  if (!match) {
    throw new Error('Could not find defaultLocale in config.ts');
  }
  return match[1];
}

function extractDomainLocaleMap(content: string): Record<string, string> {
  // Extract domainLocaleMap object
  const mapMatch = content.match(/export const domainLocaleMap[^=]*=\s*\{([^}]+)\}/s);
  if (!mapMatch) {
    throw new Error('Could not find domainLocaleMap in config.ts');
  }
  const mapContent = mapMatch[1];
  const map: Record<string, string> = {};
  const entries = mapContent.match(/(['"][^'"]+['"]):\s*['"]([^'"]+)['"]/g) || [];
  for (const entry of entries) {
    const match = entry.match(/(['"])([^'"]+)\1:\s*['"]([^'"]+)['"]/);
    if (match) {
      map[match[2]] = match[3];
    }
  }
  return map;
}

function extractValidLocalesFromMiddleware(content: string): string[] {
  // Extract validLocales array: const validLocales = ['en', 'cs'] as const;
  const match = content.match(/const validLocales = \[(.*?)\]/s);
  if (!match) {
    throw new Error('Could not find validLocales array in middleware');
  }
  const localesStr = match[1];
  return localesStr
    .split(',')
    .map((l) => l.trim().replace(/['"]/g, ''))
    .filter(Boolean);
}

function extractDefaultLocaleFromMiddleware(content: string): string {
  // Extract: const defaultLocale = 'en';
  const match = content.match(/const defaultLocale\s*=\s*['"]([^'"]+)['"]/);
  if (!match) {
    throw new Error('Could not find defaultLocale in middleware');
  }
  return match[1];
}

function extractDomainLocaleMapFromMiddleware(content: string): Record<string, string> {
  // Extract domainLocaleMap object
  const mapMatch = content.match(/const domainLocaleMap[^:]*:\s*Record[^=]*=\s*\{([^}]+)\}/s);
  if (!mapMatch) {
    throw new Error('Could not find domainLocaleMap in middleware');
  }
  const mapContent = mapMatch[1];
  const map: Record<string, string> = {};
  const entries = mapContent.match(/(['"][^'"]+['"]):\s*['"]([^'"]+)['"]/g) || [];
  for (const entry of entries) {
    const match = entry.match(/(['"])([^'"]+)\1:\s*['"]([^'"]+)['"]/);
    if (match) {
      map[match[2]] = match[3];
    }
  }
  return map;
}

function validateSynchronization(): ValidationResult {
  const errors: string[] = [];
  const projectRoot = join(__dirname, '../..');

  try {
    // Read source of truth
    const configPath = join(projectRoot, 'src/i18n/config.ts');
    const configContent = readFileSync(configPath, 'utf-8');
    const sourceLocales = extractValidLocales(configContent);
    const sourceDefaultLocale = extractDefaultLocale(configContent);
    const sourceDomainMap = extractDomainLocaleMap(configContent);

    // Validate Astro middleware imports
    const astroMiddlewarePath = join(projectRoot, 'src/middleware.ts');
    const astroMiddlewareContent = readFileSync(astroMiddlewarePath, 'utf-8');

    // Check for required imports
    if (!astroMiddlewareContent.includes('from \'@i18n/config\'') && !astroMiddlewareContent.includes('from "@i18n/config"')) {
      errors.push('src/middleware.ts does not import from @i18n/config');
    }
    if (!astroMiddlewareContent.includes('from \'@i18n/utils\'') && !astroMiddlewareContent.includes('from "@i18n/utils"')) {
      errors.push('src/middleware.ts does not import from @i18n/utils');
    }

    // Check for hardcoded locale arrays (shouldn't exist)
    if (astroMiddlewareContent.match(/const\s+(validLocales|locales)\s*=/)) {
      errors.push('src/middleware.ts contains hardcoded locale definitions');
    }

    // Read Cloudflare Pages middleware
    const cfMiddlewarePath = join(projectRoot, 'functions/_middleware.ts');
    const cfMiddlewareContent = readFileSync(cfMiddlewarePath, 'utf-8');
    const cfLocales = extractValidLocalesFromMiddleware(cfMiddlewareContent);
    const cfDefaultLocale = extractDefaultLocaleFromMiddleware(cfMiddlewareContent);
    const cfDomainMap = extractDomainLocaleMapFromMiddleware(cfMiddlewareContent);

    // Validate locales array
    const sourceLocalesSorted = [...sourceLocales].sort().join(',');
    const cfLocalesSorted = [...cfLocales].sort().join(',');
    if (sourceLocalesSorted !== cfLocalesSorted) {
      errors.push(
        `Locales mismatch: config.ts has [${sourceLocales.join(', ')}], but _middleware.ts has [${cfLocales.join(', ')}]`
      );
    }

    // Validate defaultLocale
    if (sourceDefaultLocale !== cfDefaultLocale) {
      errors.push(
        `Default locale mismatch: config.ts has '${sourceDefaultLocale}', but _middleware.ts has '${cfDefaultLocale}'`
      );
    }

    // Validate domainLocaleMap
    const sourceDomains = Object.keys(sourceDomainMap).sort();
    const cfDomains = Object.keys(cfDomainMap).sort();
    const sourceDomainsStr = sourceDomains.join(',');
    const cfDomainsStr = cfDomains.join(',');

    if (sourceDomainsStr !== cfDomainsStr) {
      errors.push(
        `Domain keys mismatch: config.ts has [${sourceDomains.join(', ')}], but _middleware.ts has [${cfDomains.join(', ')}]`
      );
    }

    // Validate domain values
    for (const domain of sourceDomains) {
      if (sourceDomainMap[domain] !== cfDomainMap[domain]) {
        errors.push(
          `Domain '${domain}' locale mismatch: config.ts maps to '${sourceDomainMap[domain]}', but _middleware.ts maps to '${cfDomainMap[domain]}'`
        );
      }
    }

    // Check for extra domains in CF middleware
    for (const domain of cfDomains) {
      if (!sourceDomainMap[domain]) {
        errors.push(`Domain '${domain}' exists in _middleware.ts but not in config.ts`);
      }
    }
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

// Run validation
const result = validateSynchronization();

if (result.passed) {
  console.log('✅ i18n configuration is synchronized across all files');
  process.exit(0);
} else {
  console.error('❌ i18n configuration synchronization errors found:');
  result.errors.forEach((error) => console.error(`  - ${error}`));
  console.error('\nPlease update the affected files to maintain synchronization.');
  process.exit(1);
}

