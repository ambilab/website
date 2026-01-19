/**
 * Commitlint configuration for conventional commits.
 *
 * @see https://commitlint.js.org
 */

export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // New feature.
                'fix', // Bug fix.
                'docs', // Documentation changes.
                'style', // Code style changes (formatting, etc.).
                'refactor', // Code refactoring.
                'perf', // Performance improvements.
                'test', // Adding or updating tests.
                'build', // Build system or dependencies.
                'ci', // CI/CD changes.
                'chore', // Other changes (maintenance, etc.).
                'revert', // Revert the previous commit.
            ],
        ],

        'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'header-max-length': [2, 'always', 100],
    },
};
