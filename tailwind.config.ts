import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
                'page-bg': 'var(--color-page-bg)',

                surface: 'var(--color-surface)',
                'surface-code': 'var(--color-surface-code)',

                'border-default': 'var(--color-border-default)',
                'border-medium': 'var(--color-border-medium)',
                'border-subtle': 'var(--color-border-subtle)',

                'text-primary': 'var(--color-text-primary)',
                'text-secondary': 'var(--color-text-secondary)',
                'text-muted': 'var(--color-text-muted)',

                link: 'var(--color-link)',
                'link-hover': 'var(--color-link-hover)',
                'link-active': 'var(--color-link-active)',

                'button-primary-bg': 'var(--color-button-primary-bg)',
                'button-primary-bg-hover': 'var(--color-button-primary-bg-hover)',
                'button-primary-text': 'var(--color-button-primary-text)',
                'button-primary-text-hover': 'var(--color-button-primary-text-hover)',

                'button-secondary-bg': 'var(--color-button-secondary-bg)',
                'button-secondary-bg-hover': 'var(--color-button-secondary-bg-hover)',
                'button-secondary-text': 'var(--color-button-secondary-text)',
                'button-secondary-text-hover': 'var(--color-button-secondary-text-hover)',

                'button-outline-bg': 'var(--color-button-outline-bg)',
                'button-outline-bg-hover': 'var(--color-button-outline-bg-hover)',
                'button-outline-border': 'var(--color-button-outline-border)',
                'button-outline-border-hover': 'var(--color-button-outline-border-hover)',
                'button-outline-text': 'var(--color-button-outline-text)',
                'button-outline-text-hover': 'var(--color-button-outline-text-hover)',

                'focus-ring': 'var(--color-focus-ring)',

                active: 'var(--color-active)',

                'info-bg': 'var(--color-info-bg)',
                'info-border': 'var(--color-info-border)',
                'warning-bg': 'var(--color-warning-bg)',
                'warning-border': 'var(--color-warning-border)',
                'warning-text': 'var(--color-warning-text)',
                'warning-heading': 'var(--color-warning-heading)',
                'warning-highlight': 'var(--color-warning-highlight)',
                'success-text': 'var(--color-success-text)',
                'error-text': 'var(--color-error-text)',

                'tag-bg': 'var(--color-tag-bg)',
                'tag-text': 'var(--color-tag-text)',
            },
            zIndex: {
                header: '50',
                'mobile-menu': '60',
                'header-bar': '100',
                'cookie-banner': '110',
                'go-to-top': '120',
                'skip-navigation-link': '200',
            },
        },
    },
    plugins: [typography],
} satisfies Config;
