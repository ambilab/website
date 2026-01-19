/* cSpell:disable */
import type { Locale } from '@type/locale';

export interface Translations {
    a11y: {
        skipNavigationLink: string;
    };

    nav: {
        home: string;
        about: string;
        blog: string;
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
        followAmbilab: string;
    };

    newsletter: {
        title: string;
        description: string;
        emailPlaceholder: string;
        subscribing: string;
        success: string;
        error: string;
    };

    cookie: {
        message: string;
        button: string;
    };

    blog: {
        publishedOn: string;
        updatedOn: string;
        readingTime: string;
        minutesShort: string;
        tags: string;
        author: string;
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
        },

        nav: {
            home: 'Home',
            about: 'About',
            blog: 'Blog',
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
            description: 'A bilingual (English/Czech) marketing website and blog for Ambilab.',
            navigation: 'Navigation',
            followAmbilab: 'Follow Ambilab',
        },

        newsletter: {
            title: 'Subscribe to Our Newsletter',
            description: 'Get the latest updates from Ambilab delivered to your inbox.',
            emailPlaceholder: 'Enter your email',
            subscribing: 'Subscribing...',
            success: 'Thanks for subscribing!',
            error: 'Something went wrong. Please try again.',
        },

        cookie: {
            message: 'We use a cookie to remember your language preference.',
            button: 'Got it',
        },

        blog: {
            publishedOn: 'Published on',
            updatedOn: 'Updated on',
            readingTime: 'Reading time',
            minutesShort: 'min',
            tags: 'Tags',
            author: 'Author',
            title: 'Blog',
            description: 'Latest articles and updates from Ambilab',
            allPosts: 'All posts',
            noPosts: 'No posts available yet.',
        },

        notFound: {
            title: '404',
            description: "Oops! The page you're looking for doesn't exist.",
            goHome: 'Go Home',
        },

        serverError: {
            title: '500',
            description: 'Something went wrong on our end. Please try again later.',
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
        },

        nav: {
            home: 'Domů',
            about: 'O projektu',
            blog: 'Blog',
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
            followAmbilab: 'Sledujte Ambilab',
        },

        newsletter: {
            title: 'Odebírejte náš newsletter',
            description: 'Získejte nejnovější aktualizace z Ambilab přímo do své e-mailové schránky.',
            emailPlaceholder: 'Zadejte svůj e-mail',
            subscribing: 'Odesílám...',
            success: 'Děkujeme za odběr!',
            error: 'Něco se pokazilo. Zkuste to prosím znovu.',
        },

        cookie: {
            message: 'Používáme cookie pro zapamatování vašeho jazykového nastavení.',
            button: 'Rozumím',
        },

        blog: {
            publishedOn: 'Publikováno',
            updatedOn: 'Aktualizováno',
            readingTime: 'Doba čtení',
            minutesShort: 'min',
            tags: 'Štítky',
            author: 'Autor',
            title: 'Blog',
            description: 'Nejnovější články a aktuality z Ambilabu',
            allPosts: 'Všechny příspěvky',
            noPosts: 'Zatím nejsou k dispozici žádné příspěvky.',
        },

        notFound: {
            title: '404',
            description: 'Ups! Stránka, kterou hledáte, neexistuje.',
            goHome: 'Domů',
        },

        serverError: {
            title: '500',
            description: 'Na naší straně se něco pokazilo. Zkuste to prosím později.',
            goHome: 'Domů',
        },

        serviceUnavailable: {
            title: '503',
            description: 'Služba je dočasně nedostupná. Zkuste to prosím za chvíli.',
            goHome: 'Domů',
        },

        rss: {
            errorMessage: 'Nepodařilo se vygenerovat RSS kanál. Zkuste to prosím později.',
        },
    },
};

export const getTranslation = (locale: Locale): Translations => {
    return translations[locale] || translations.en;
};
