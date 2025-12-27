/* cSpell:disable */
import type { Locale } from '@type/locale';

export interface Translations {
    nav: {
        home: string;
        about: string;
        blog: string;
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
    };
    notFound: {
        title: string;
        description: string;
        goHome: string;
    };
}

export const translations: Record<Locale, Translations> = {
    en: {
        nav: {
            home: 'Home',
            about: 'About',
            blog: 'Blog',
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
            description: 'A web-based pixel art game engine and editor for kids to learn programming.',
            navigation: 'Navigation',
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
        },
        notFound: {
            title: '404',
            description: "Oops! The page you're looking for doesn't exist.",
            goHome: 'Go Home',
        },
    },
    cs: {
        nav: {
            home: 'Domů',
            about: 'O projektu',
            blog: 'Blog',
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
            description: 'Webová pixel art herní engine a editor pro děti, aby se učily programovat.',
            navigation: 'Navigace',
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
        },
        notFound: {
            title: '404',
            description: 'Ups! Stránka, kterou hledáte, neexistuje.',
            goHome: 'Domů',
        },
    },
};

export const getTranslation = (locale: Locale): Translations => {
    return translations[locale] || translations.en;
};
