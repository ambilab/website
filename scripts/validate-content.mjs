/**
 * Content Validation Script
 *
 * Validates bilingual content synchronization:
 * - Checks that every English post has a Czech translation (and vice versa)
 * - Validates translationSlug references are valid (no orphans)
 * - Reports missing translations and broken links
 *
 * Usage:
 *   pnpm validate:content
 *   pnpm validate:content --fix (shows suggestions)
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const CONTENT_DIR = join(ROOT_DIR, 'src', 'content');

const COLLECTIONS = ['news', 'pages'];
const _LOCALES = ['en', 'cs'];

/**
 * Extracts frontmatter from an MDX file.
 */
function extractFrontmatter(filePath) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

    if (!match) {
        return null;
    }

    const frontmatter = {};
    const lines = match[1].split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();

            // Remove quotes
            if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
                value = value.slice(1, -1);
            }

            frontmatter[key] = value;
        }
    }

    return frontmatter;
}

/**
 * Gets all content files for a collection and locale.
 */
function getContentFiles(collection, locale) {
    const dir = join(CONTENT_DIR, collection, locale);

    try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const stat = statSync(dir);
        if (!stat.isDirectory()) return [];
    } catch {
        return [];
    }

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const files = readdirSync(dir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

    return files.map((filename) => {
        const filePath = join(dir, filename);
        const slug = filename.replace(/\.mdx?$/, '');
        const frontmatter = extractFrontmatter(filePath);

        return {
            filename,
            filePath,
            slug,
            frontmatter,
            collection,
            locale,
        };
    });
}

/**
 * Validates content synchronization.
 */
function validateContent() {
    const issues = [];
    const warnings = [];

    for (const collection of COLLECTIONS) {
        console.log(`\nValidating ${collection} collection...`);

        const enFiles = getContentFiles(collection, 'en');
        const csFiles = getContentFiles(collection, 'cs');

        const enBySlug = new Map(enFiles.map((f) => [f.slug, f]));
        const csBySlug = new Map(csFiles.map((f) => [f.slug, f]));

        // Check English files for translation references
        for (const enFile of enFiles) {
            const translationSlug = enFile.frontmatter?.translationSlug;

            if (translationSlug) {
                // Check if translation exists
                const csFile = csBySlug.get(translationSlug);

                if (!csFile) {
                    issues.push({
                        type: 'broken_reference',
                        file: enFile.filePath,
                        message: `English file references non-existent Czech translation: "${translationSlug}"`,
                        suggestion: `Create src/content/${collection}/cs/${translationSlug}.mdx`,
                    });
                } else {
                    // Check if Czech file references back
                    const backRef = csFile.frontmatter?.translationSlug;

                    if (backRef && backRef !== enFile.slug) {
                        issues.push({
                            type: 'mismatched_reference',
                            file: csFile.filePath,
                            message: `Czech translation "${translationSlug}" references different English file: "${backRef}" (expected: "${enFile.slug}")`,
                        });
                    } else if (!backRef) {
                        warnings.push({
                            type: 'missing_back_reference',
                            file: csFile.filePath,
                            message: `Czech file "${translationSlug}" is missing translationSlug back to "${enFile.slug}"`,
                            suggestion: `Add "translationSlug: '${enFile.slug}'" to frontmatter`,
                        });
                    }
                }
            } else {
                warnings.push({
                    type: 'no_translation',
                    file: enFile.filePath,
                    message: `English file "${enFile.slug}" has no translationSlug defined`,
                });
            }
        }

        // Check Czech files for translation references
        for (const csFile of csFiles) {
            const translationSlug = csFile.frontmatter?.translationSlug;

            if (translationSlug) {
                const enFile = enBySlug.get(translationSlug);

                if (!enFile) {
                    issues.push({
                        type: 'broken_reference',
                        file: csFile.filePath,
                        message: `Czech file references non-existent English translation: "${translationSlug}"`,
                        suggestion: `Create src/content/${collection}/en/${translationSlug}.mdx`,
                    });
                }
            }
        }

        // Check for orphaned files (Czech files without any English reference)
        for (const csFile of csFiles) {
            const hasEnglishReference = enFiles.some((enFile) => enFile.frontmatter?.translationSlug === csFile.slug);

            if (!hasEnglishReference && !csFile.frontmatter?.translationSlug) {
                warnings.push({
                    type: 'orphaned_translation',
                    file: csFile.filePath,
                    message: `Czech file "${csFile.slug}" is not referenced by any English file`,
                });
            }
        }

        console.log(`  EN files: ${enFiles.length}`);
        console.log(`  CS files: ${csFiles.length}`);
    }

    return { issues, warnings };
}

/**
 * Main function.
 */
function main() {
    console.log('Content Validation');
    console.log('==================');

    const showFix = process.argv.includes('--fix');

    const { issues, warnings } = validateContent();

    console.log('\n');

    if (issues.length === 0 && warnings.length === 0) {
        console.log('All content is properly synchronized!');
        process.exit(0);
    }

    if (issues.length > 0) {
        console.log(`Found ${issues.length} issue(s):\n`);

        for (const issue of issues) {
            console.log(`  [ERROR] ${issue.message}`);
            console.log(`          File: ${issue.file}`);

            if (showFix && issue.suggestion) {
                console.log(`          Fix: ${issue.suggestion}`);
            }

            console.log('');
        }
    }

    if (warnings.length > 0) {
        console.log(`Found ${warnings.length} warning(s):\n`);

        for (const warning of warnings) {
            console.log(`  [WARN] ${warning.message}`);
            console.log(`         File: ${warning.file}`);

            if (showFix && warning.suggestion) {
                console.log(`         Fix: ${warning.suggestion}`);
            }

            console.log('');
        }
    }

    if (issues.length > 0) {
        console.log('\nContent validation failed. Please fix the issues above.');
        process.exit(1);
    }

    console.log('\nContent validation passed with warnings.');
    process.exit(0);
}

main();
