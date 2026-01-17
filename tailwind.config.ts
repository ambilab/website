import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
                // Page backgrounds
                'page-bg': 'var(--color-page-bg)',
                'page-bg-dark': 'var(--color-page-bg-dark)',
                'page-bg-muted': 'var(--color-page-bg-muted)',
                'page-bg-muted-dark': 'var(--color-page-bg-muted-dark)',

                // Surface colors
                surface: 'var(--color-surface)',
                'surface-dark': 'var(--color-surface-dark)',
                'surface-hover': 'var(--color-surface-hover)',
                'surface-hover-dark': 'var(--color-surface-hover-dark)',
                'surface-code': 'var(--color-surface-code)',
                'surface-code-dark': 'var(--color-surface-code-dark)',

                // Border colors
                'border-default': 'var(--color-border-default)',
                'border-default-dark': 'var(--color-border-default-dark)',
                'border-medium': 'var(--color-border-medium)',
                'border-medium-dark': 'var(--color-border-medium-dark)',
                'border-subtle': 'var(--color-border-subtle)',
                'border-subtle-dark': 'var(--color-border-subtle-dark)',

                // Text colors
                'text-primary': 'var(--color-text-primary)',
                'text-primary-dark': 'var(--color-text-primary-dark)',
                'text-secondary': 'var(--color-text-secondary)',
                'text-secondary-dark': 'var(--color-text-secondary-dark)',
                'text-muted': 'var(--color-text-muted)',
                'text-muted-dark': 'var(--color-text-muted-dark)',

                // Link colors
                link: 'var(--color-link)',
                'link-hover': 'var(--color-link-hover)',
                'link-dark': 'var(--color-link-dark)',
                'link-hover-dark': 'var(--color-link-hover-dark)',
                'link-active': 'var(--color-link-active)',
                'link-active-dark': 'var(--color-link-active-dark)',

                // Button colors
                'button-primary': 'var(--color-button-primary)',
                'button-primary-hover': 'var(--color-button-primary-hover)',
                'button-primary-text': 'var(--color-button-primary-text)',
                'button-primary-dark': 'var(--color-button-primary-dark)',
                'button-primary-hover-dark': 'var(--color-button-primary-hover-dark)',
                'button-primary-text-dark': 'var(--color-button-primary-text-dark)',

                // Accent colors
                'info-bg': 'var(--color-info-bg)',
                'info-bg-dark': 'var(--color-info-bg-dark)',
                'info-border': 'var(--color-info-border)',
                'warning-bg': 'var(--color-warning-bg)',
                'warning-bg-dark': 'var(--color-warning-bg-dark)',
                'warning-border': 'var(--color-warning-border)',
                'warning-border-dark': 'var(--color-warning-border-dark)',
                'warning-text': 'var(--color-warning-text)',
                'warning-text-dark': 'var(--color-warning-text-dark)',
                'warning-heading': 'var(--color-warning-heading)',
                'warning-heading-dark': 'var(--color-warning-heading-dark)',
                'warning-highlight': 'var(--color-warning-highlight)',
                'warning-highlight-dark': 'var(--color-warning-highlight-dark)',
                'success-text': 'var(--color-success-text)',
                'success-text-dark': 'var(--color-success-text-dark)',
                'error-text': 'var(--color-error-text)',
                'error-text-dark': 'var(--color-error-text-dark)',

                // Tag/Badge colors
                'tag-bg': 'var(--color-tag-bg)',
                'tag-bg-dark': 'var(--color-tag-bg-dark)',
                'tag-text': 'var(--color-tag-text)',
                'tag-text-dark': 'var(--color-tag-text-dark)',

                // Table colors
                'table-header-bg': 'var(--color-table-header-bg)',
                'table-header-bg-dark': 'var(--color-table-header-bg-dark)',
                'table-header-border': 'var(--color-table-header-border)',
                'table-header-border-dark': 'var(--color-table-header-border-dark)',
                'table-border': 'var(--color-table-border)',
                'table-border-dark': 'var(--color-table-border-dark)',

                // Miscellaneous colors
                anchor: 'var(--color-anchor)',
                'anchor-dark': 'var(--color-anchor-dark)',

                // Selection colors
                'selection-bg': 'var(--color-selection-bg)',
                'selection-text': 'var(--color-selection-text)',
                'selection-bg-dark': 'var(--color-selection-bg-dark)',
                'selection-text-dark': 'var(--color-selection-text-dark)',
            },
        },
    },
    plugins: [typography],
} satisfies Config;
