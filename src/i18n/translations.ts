/* cSpell:disable */
import type { Locale } from '@type/locale';

export interface Translations {
    a11y: {
        skipNavigationLink: string;
        openMenu: string;
        closeMenu: string;
        toggleTheme: string;
        switchToLightMode: string;
        switchToDarkMode: string;
        goToTop: string;
        switchLanguage: string;
        homeLinkLabel: string;
        demoEmbedTitle: string;
        opensInNewTab: string;
    };

    nav: {
        home: string;
        projects: string;
        news: string;
        rss: string;
    };

    buttons: {
        readMore: string;
        subscribe: string;
        tryDemo: string;
        goToTop: string;
    };

    footer: {
        copyright: string;
        allRightsReserved: string;
        description: string;
        navigation: string;
        footerNavAria: string;
        followAmbilab: string;
        socialLinksAria: string;
    };

    newsletter: {
        title: string;
        emailPlaceholder: string;
        subscribing: string;
        success: string;
        error: string;
        rateLimitError: string;
    };

    cookie: {
        message: string;
        dismissLabel: string;
        regionLabel: string;
        button: string;
    };

    news: {
        publishedOn: string;
        updatedOn: string;
        readingTime: string;
        minutesShort: string;
        tags: string;
        title: string;
        description: string;
        allPosts: string;
        noPosts: string;
    };

    notFound: {
        title: string;
        description: string;
        goHome: string;
    };

    serverError: {
        title: string;
        description: string;
        goHome: string;
    };

    serviceUnavailable: {
        title: string;
        description: string;
        goHome: string;
    };

    rss: {
        errorMessage: string;
    };
}

export const translations: Record<Locale, Translations> = {
    en: {
        a11y: {
            skipNavigationLink: 'Skip to the main content',
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
            toggleTheme: 'Toggle theme',
            switchToLightMode: 'Switch to light mode',
            switchToDarkMode: 'Switch to dark mode',
            goToTop: 'Go to top',
            switchLanguage: 'Switch language',
            homeLinkLabel: 'Ambilab Home',
            demoEmbedTitle: 'Demo embed',
            opensInNewTab: 'opens in new tab',
        },

        nav: {
            home: 'Home',
            projects: 'Projects',
            news: 'News',
            rss: 'RSS Feed',
        },

        buttons: {
            readMore: 'Read More',
            subscribe: 'Subscribe',
            tryDemo: 'Try Demo',
            goToTop: 'Go to Top',
        },

        footer: {
            copyright: 'Copyright',
            allRightsReserved: 'All rights reserved',
            description: 'What pink drop port tired new north highway ugly art finished happy.',
            navigation: 'Navigation',
            footerNavAria: 'Footer navigation',
            followAmbilab: 'Follow Us:',
            socialLinksAria: 'Social links',
        },

        newsletter: {
            title: 'Get the latest updates from Ambilab delivered to your inbox.',
            emailPlaceholder: 'Enter your email',
            subscribing: 'Subscribing...',
            success: 'Thanks for subscribing!',
            error: 'Something went wrong. Please try again.',
            rateLimitError: 'Too many attempts. Please try again later.',
        },

        cookie: {
            message: 'We use a cookie to remember your language preference.',
            dismissLabel: 'Dismiss the cookie banner',
            regionLabel: 'Cookie consent',
            button: 'Got it',
        },

        news: {
            publishedOn: 'Published on',
            updatedOn: 'Updated on',
            readingTime: 'Reading time',
            minutesShort: 'min',
            tags: 'Tags',
            title: 'News',
            description: 'Latest articles and updates from Ambilab',
            allPosts: 'All posts',
            noPosts: 'No posts available yet.',
        },

        notFound: {
            title: '404',
            description: "The page you're looking for could not be found.",
            goHome: 'Go Home',
        },

        serverError: {
            title: '500',
            description: 'An internal server error occurred. Please try again later.',
            goHome: 'Go Home',
        },

        serviceUnavailable: {
            title: '503',
            description: 'The service is temporarily unavailable. Please try again in a few moments.',
            goHome: 'Go Home',
        },

        rss: {
            errorMessage: 'Failed to generate RSS feed. Please try again later.',
        },
    },
    cs: {
        a11y: {
            skipNavigationLink: 'Přeskočit na hlavní obsah',
            openMenu: 'Otevřít menu',
            closeMenu: 'Zavřít menu',
            toggleTheme: 'Přepnout motiv',
            switchToLightMode: 'Přepnout na světlý režim',
            switchToDarkMode: 'Přepnout na tmavý režim',
            goToTop: 'Zpět nahoru',
            switchLanguage: 'Přepnout jazyk',
            homeLinkLabel: 'Ambilab domovská stránka',
            demoEmbedTitle: 'Demo náhled',
            opensInNewTab: 'otevře se v novém panelu',
        },

        nav: {
            home: 'Domů',
            projects: 'Projekty',
            news: 'Novinky',
            rss: 'RSS kanál',
        },

        buttons: {
            readMore: 'Číst více',
            subscribe: 'Odebírat',
            tryDemo: 'Vyzkoušet demo',
            goToTop: 'Zpět nahoru',
        },

        footer: {
            copyright: 'Copyright',
            allRightsReserved: 'Všechna práva vyhrazena',
            description: 'Webová pixel-art herní engine.',
            navigation: 'Navigace',
            footerNavAria: 'Navigace v patičce',
            followAmbilab: 'Sledujte nás:',
            socialLinksAria: 'Sociální sítě',
        },

        newsletter: {
            title: 'Získejte nejnovější aktualizace z Ambilab přímo do své e-mailové schránky.',
            emailPlaceholder: 'Zadejte svůj e-mail',
            subscribing: 'Odesílám...',
            success: 'Děkujeme za odběr!',
            error: 'Něco se pokazilo. Zkuste to prosím znovu.',
            rateLimitError: 'Příliš mnoho pokusů. Zkuste to prosím později.',
        },

        cookie: {
            message: 'Používáme cookie pro zapamatování vašeho jazykového nastavení.',
            dismissLabel: 'Zavřít banner s cookies',
            regionLabel: 'Souhlas s cookies',
            button: 'Rozumím',
        },

        news: {
            publishedOn: 'Publikováno',
            updatedOn: 'Aktualizováno',
            readingTime: 'Doba čtení',
            minutesShort: 'min',
            tags: 'Štítky',
            title: 'Novinky',
            description: 'Nejnovější články a aktuality z Ambilabu',
            allPosts: 'Všechny příspěvky',
            noPosts: 'Zatím nejsou k dispozici žádné příspěvky.',
        },

        notFound: {
            title: '404',
            description: 'Stránka, kterou hledáte, nebyla nalezena.',
            goHome: 'Zpět domů',
        },

        serverError: {
            title: '500',
            description: 'Došlo k interní chybě serveru. Zkuste to prosím později.',
            goHome: 'Zpět domů',
        },

        serviceUnavailable: {
            title: '503',
            description: 'Služba je dočasně nedostupná. Zkuste to prosím za chvíli.',
            goHome: 'Zpět domů',
        },

        rss: {
            errorMessage: 'Nepodařilo se vygenerovat RSS kanál. Zkuste to prosím později.',
        },
    },
};

export const getTranslation = (locale: Locale): Translations => {
    return translations[locale] || translations.en;
};
