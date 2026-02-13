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
Syncs Claude Code settings and skills from claude-config/ to .claude/.
Configuration is read from the package.json "syncRules" field.

Rule Targets:
${targetList}

Cursor Config (always synced when cursor target is enabled):
  - cursor-config/hooks.json -> .cursor/hooks.json
  - cursor-config/hooks/*    -> .cursor/hooks/
  - cursor-config/skills/*   -> .cursor/skills/

Claude Code Config (always synced when claude target is enabled):
  - claude-config/settings.json -> .claude/settings.json
  - claude-config/skills/*      -> .claude/skills/

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
    const combinedRules = combineRules(rules);
    const claudeConfig = generateClaudeConfig();
    const fullContent = `${combinedRules}\n\n---\n\n${claudeConfig}`;
    writeRuleFile(join(ROOT_DIR, 'CLAUDE.md'), fullContent, 'CLAUDE.md');

    // Also sync claude-config (settings, skills, etc.).
    syncClaudeConfig();
}

function generateClaudeConfig() {
    return `# Claude Code Configuration

This section configures Claude Code CLI hooks for automated quality checks.

## Hooks

The following hooks are automatically loaded when using Claude Code CLI in this project.
Configure these in \`.claude/settings.json\` or \`~/.claude/settings.json\`.

### Auto-format After Edits

Automatically runs formatters after file edits:

\`\`\`json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "cd \\"$CLAUDE_PROJECT_DIR\\" && pnpm format"
          }
        ]
      }
    ]
  }
}
\`\`\`

This hook runs \`pnpm format\` after any \`Edit\` or \`Write\` tool use, ensuring code is always formatted according to project standards (Biome for TS/JS/JSON, Prettier for Astro/Svelte/Markdown).

### Notes

- **No stop hook equivalent**: Unlike Cursor, Claude Code cannot automatically inject follow-up messages to continue conversation loops after quality checks
- **Manual verification**: After making changes, manually run \`/preflight\` skill or \`pnpm preflight\` to verify all quality checks pass
- **Skills**: Custom workflows are available as skills in \`.claude/skills/\` (format, preflight, pr, review)

## Configuration Files

| Location | Purpose | Version Control |
|---|---|---|
| \`CLAUDE.md\` | Project rules and context | Committed (generated) |
| \`.claude/settings.json\` | Project-specific settings | Gitignored (generated) |
| \`.claude/settings.local.json\` | Local overrides | Gitignored |
| \`.claude/skills/\` | Custom slash commands | Gitignored (generated) |
| \`claude-config/\` | Source of truth for Claude Code config | Committed |
| \`~/.claude/\` | User-global configuration | User home directory |

## See Also

- [Claude Code Hooks Documentation](https://code.claude.com/docs/en/hooks-guide)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [Claude Code Settings Documentation](https://code.claude.com/docs/en/settings)`;
}

/**
 * Syncs claude-config/ to .claude/ (settings.json, skills/).
 */
function syncClaudeConfig() {
    const claudeConfigDir = join(ROOT_DIR, 'claude-config');
    const claudeDir = join(ROOT_DIR, '.claude');

    // Check if claude-config directory exists.
    if (!existsSync(claudeConfigDir)) {
        console.log('   (No claude-config/ directory found, skipping settings/skills sync)');
        return;
    }

    console.log('   Syncing claude-config/...');

    // Create .claude directory if it doesn't exist.
    mkdirSync(claudeDir, { recursive: true });

    // Sync settings.json.
    const settingsJsonSrc = join(claudeConfigDir, 'settings.json');
    if (existsSync(settingsJsonSrc)) {
        const settingsJsonDest = join(claudeDir, 'settings.json');

        copyFileSync(settingsJsonSrc, settingsJsonDest);
        console.log('   - .claude/settings.json');
    }

    // Sync skills/ directory (recursively - each skill has its own directory).
    const skillsSrcDir = join(claudeConfigDir, 'skills');

    if (existsSync(skillsSrcDir)) {
        const skillsDestDir = join(claudeDir, 'skills');

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

                console.log(`   - .claude/skills/${skillDir}/${file}`);
            }
        }
    }
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
