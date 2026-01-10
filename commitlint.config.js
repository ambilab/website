/**
 * Commitlint configuration for conventional commits
 * @see https://commitlint.js.org
 */

export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Enforce conventional commit types
        'type-enum': [
            2,
            'always',
            [
                'feat', // New feature
                'fix', // Bug fix
                'docs', // Documentation changes
                'style', // Code style changes (formatting, etc.)
                'refactor', // Code refactoring
                'perf', // Performance improvements
                'test', // Adding or updating tests
                'build', // Build system or dependencies
                'ci', // CI/CD changes
                'chore', // Other changes (maintenance, etc.)
                'revert', // Revert the previous commit
            ],
        ],

        // Subject case: lowercase
        'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],

        // Subject must not be empty
        'subject-empty': [2, 'never'],

        // Subject must not end with a full stop
        'subject-full-stop': [2, 'never', '.'],

        // Type must be lowercase
        'type-case': [2, 'always', 'lower-case'],

        // Type must not be empty
        'type-empty': [2, 'never'],

        // Header max length
        'header-max-length': [2, 'always', 100],
    },
};
