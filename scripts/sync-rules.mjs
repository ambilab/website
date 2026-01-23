/**
 * Usage:
 *   pnpm sync-rules
 *   pnpm sync-rules --help
 */

import {
    chmodSync,
    copyFileSync,
    existsSync,
    lstatSync,
    mkdirSync,
    readdirSync,
    readFileSync,
    writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');

const TARGETS = {
    cursor: {
        description: '.cursor/rules/*.mdc',
        generate: generateCursor,
    },
    webstorm: {
        description: '.aiassistant/rules/*.md',
        generate: generateWebStorm,
    },
    zed: {
        description: '.rules',
        generate: generateZed,
    },
    claude: {
        description: 'CLAUDE.md',
        generate: generateClaude,
    },
};

function showHelp() {
    const targetList = Object.entries(TARGETS)
        .map(([name, { description }]) => `  - ${name}: ${description}`)
        .join('\n');

    console.log(`
Usage: pnpm sync-rules [--help]

Syncs AI assistant rules from ai-rules/*.mdc to tool-specific locations.
Syncs Cursor hooks and skills from cursor-config/ to .cursor/.
Configuration is read from the package.json "syncRules" field.

Rule Targets:
${targetList}

Cursor Config (always synced when cursor target is enabled):
  - cursor-config/hooks.json -> .cursor/hooks.json
  - cursor-config/hooks/*    -> .cursor/hooks/
  - cursor-config/skills/*   -> .cursor/skills/

Configuration example in package.json:
  "syncRules": {
    "source": "ai-rules",
    "targets": {
      "cursor": true,
      "webstorm": true,
      "zed": true,
      "claude": true
    }
  }
`);
    process.exit(0);
}

function loadConfig() {
    const packageJsonPath = join(ROOT_DIR, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    if (!packageJson.syncRules) {
        throw new Error('Missing "syncRules" configuration in package.json');
    }

    const { source, targets } = packageJson.syncRules;

    if (!source || typeof source !== 'string') {
        throw new Error('Missing or invalid "syncRules.source" in package.json');
    }

    if (!targets || typeof targets !== 'object') {
        throw new Error('Missing or invalid "syncRules.targets" in package.json');
    }

    const enabledTargets = Object.entries(targets)
        .filter(([, enabled]) => enabled)
        .map(([name]) => {
            if (!TARGETS[name]) {
                throw new Error(`Unknown target "${name}" in syncRules.targets`);
            }
            return name;
        });

    if (enabledTargets.length === 0) {
        throw new Error('No targets enabled in syncRules.targets');
    }

    return { source, targets: enabledTargets };
}

function readSourceRules(sourceDir) {
    const rulesDir = join(ROOT_DIR, sourceDir);

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const files = readdirSync(rulesDir);

    const mdcFiles = files.filter((file) => file.endsWith('.mdc'));

    if (mdcFiles.length === 0) {
        throw new Error(`No .mdc files found in ${sourceDir}/`);
    }

    return mdcFiles.map((file) => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const content = readFileSync(join(rulesDir, file), 'utf-8');

        const name = file.replace('.mdc', '');
        const contentClean = content.replace(/^\uFEFF?/, '').replace(/^\s*---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

        return { name, filename: file, content, contentClean };
    });
}

function writeRuleFile(filePath, content, displayPath) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    writeFileSync(filePath, content, 'utf-8');

    console.log(`   - ${displayPath}`);
}

function combineRules(rules) {
    const header = `# Project Rules

> Auto-generated from ai-rules/*.mdc files.
> To update, edit the source files and run: \`pnpm sync-rules\`

---

`;
    const combined = rules.map((rule) => rule.contentClean.trim()).join('\n\n---\n\n');
    return header + combined;
}

function generateCursor(rules) {
    const dir = join(ROOT_DIR, '.cursor', 'rules');
    mkdirSync(dir, { recursive: true });

    for (const rule of rules) {
        writeRuleFile(join(dir, rule.filename), rule.content, `.cursor/rules/${rule.filename}`);
    }

    // Also sync cursor-config (hooks and skills).
    syncCursorConfig();
}

/**
 * Syncs cursor-config/ to .cursor/ (hooks.json, hooks/, skills/).
 */
function syncCursorConfig() {
    const cursorConfigDir = join(ROOT_DIR, 'cursor-config');
    const cursorDir = join(ROOT_DIR, '.cursor');

    // Check if cursor-config directory exists.
    if (!existsSync(cursorConfigDir)) {
        console.log('   (No cursor-config/ directory found, skipping hooks/skills sync)');
        return;
    }

    console.log('   Syncing cursor-config/...');

    // Sync hooks.json.
    const hooksJsonSrc = join(cursorConfigDir, 'hooks.json');
    if (existsSync(hooksJsonSrc)) {
        const hooksJsonDest = join(cursorDir, 'hooks.json');

        copyFileSync(hooksJsonSrc, hooksJsonDest);
        console.log('   - .cursor/hooks.json');
    }

    // Sync hooks/ directory.
    const hooksSrcDir = join(cursorConfigDir, 'hooks');
    if (existsSync(hooksSrcDir)) {
        const hooksDestDir = join(cursorDir, 'hooks');

        mkdirSync(hooksDestDir, { recursive: true });

        const hookFiles = readdirSync(hooksSrcDir);
        for (const file of hookFiles) {
            const srcPath = join(hooksSrcDir, file);

            // Skip directories, only copy files.
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            if (!lstatSync(srcPath).isFile()) {
                continue;
            }

            const destPath = join(hooksDestDir, file);

            copyFileSync(srcPath, destPath);

            // Make shell scripts executable.
            if (file.endsWith('.sh')) {
                // eslint-disable-next-line security/detect-non-literal-fs-filename
                chmodSync(destPath, 0o755);
            }

            console.log(`   - .cursor/hooks/${file}`);
        }
    }

    // Sync skills/ directory (recursively - each skill has its own directory).
    const skillsSrcDir = join(cursorConfigDir, 'skills');

    if (existsSync(skillsSrcDir)) {
        const skillsDestDir = join(cursorDir, 'skills');

        mkdirSync(skillsDestDir, { recursive: true });

        const skillDirs = readdirSync(skillsSrcDir);

        for (const skillDir of skillDirs) {
            const srcSkillPath = join(skillsSrcDir, skillDir);

            // Skip non-directory entries (files directly in skills/).
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            if (!lstatSync(srcSkillPath).isDirectory()) {
                continue;
            }

            const destSkillPath = join(skillsDestDir, skillDir);

            // Create skill directory.
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            mkdirSync(destSkillPath, { recursive: true });

            // Copy all files in the skill directory.
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            const skillFiles = readdirSync(srcSkillPath);
            for (const file of skillFiles) {
                const srcFilePath = join(srcSkillPath, file);

                // Skip directories, only copy files.
                // eslint-disable-next-line security/detect-non-literal-fs-filename
                if (!lstatSync(srcFilePath).isFile()) {
                    continue;
                }

                const destFilePath = join(destSkillPath, file);

                copyFileSync(srcFilePath, destFilePath);

                console.log(`   - .cursor/skills/${skillDir}/${file}`);
            }
        }
    }
}

function generateWebStorm(rules) {
    const dir = join(ROOT_DIR, '.aiassistant', 'rules');
    mkdirSync(dir, { recursive: true });

    for (const rule of rules) {
        writeRuleFile(join(dir, `${rule.name}.md`), rule.contentClean.trim(), `.aiassistant/rules/${rule.name}.md`);
    }
}

function generateZed(rules) {
    writeRuleFile(join(ROOT_DIR, '.rules'), combineRules(rules), '.rules');
}

function generateClaude(rules) {
    writeRuleFile(join(ROOT_DIR, 'CLAUDE.md'), combineRules(rules), 'CLAUDE.md');
}

function main() {
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        showHelp();
    }

    console.log('Syncing AI assistant rules...\n');

    const config = loadConfig();

    console.log(`Source: ${config.source}/`);
    console.log(`Targets: ${config.targets.join(', ')}\n`);

    console.log(`1. Reading source rules from ${config.source}/*.mdc`);
    const rules = readSourceRules(config.source);
    console.log(`   Found ${rules.length} files: ${rules.map((r) => r.name).join(', ')}\n`);

    let step = 2;

    for (const targetName of config.targets) {
        const target = TARGETS[targetName];
        console.log(`${step}. Generating ${target.description}`);
        target.generate(rules);
        step++;
    }

    console.log('\nDone! Rules synced successfully.');
    console.log('\nGenerated:');

    for (const targetName of config.targets) {
        console.log(`  - ${TARGETS[targetName].description}`);
    }

    console.log(`\nSource of truth: ${config.source}/*.mdc`);
}

main();
