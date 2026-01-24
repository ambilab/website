import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
                'page-bg': 'var(--color-page-bg)',
                'page-bg-dark': 'var(--color-page-bg-dark)',
                'page-bg-muted': 'var(--color-page-bg-muted)',
                'page-bg-muted-dark': 'var(--color-page-bg-muted-dark)',

                surface: 'var(--color-surface)',
                'surface-dark': 'var(--color-surface-dark)',
                'surface-hover': 'var(--color-surface-hover)',
                'surface-hover-dark': 'var(--color-surface-hover-dark)',
                'surface-code': 'var(--color-surface-code)',
                'surface-code-dark': 'var(--color-surface-code-dark)',

                'border-default': 'var(--color-border-default)',
                'border-default-dark': 'var(--color-border-default-dark)',
                'border-medium': 'var(--color-border-medium)',
                'border-medium-dark': 'var(--color-border-medium-dark)',
                'border-subtle': 'var(--color-border-subtle)',
                'border-subtle-dark': 'var(--color-border-subtle-dark)',

                'text-primary': 'var(--color-text-primary)',
                'text-primary-dark': 'var(--color-text-primary-dark)',
                'text-secondary': 'var(--color-text-secondary)',
                'text-secondary-dark': 'var(--color-text-secondary-dark)',
                'text-muted': 'var(--color-text-muted)',
                'text-muted-dark': 'var(--color-text-muted-dark)',

                link: 'var(--color-link)',
                'link-hover': 'var(--color-link-hover)',
                'link-dark': 'var(--color-link-dark)',
                'link-hover-dark': 'var(--color-link-hover-dark)',
                'link-active': 'var(--color-link-active)',
                'link-active-dark': 'var(--color-link-active-dark)',

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
            },
        },
    },
    plugins: [typography],
} satisfies Config;
