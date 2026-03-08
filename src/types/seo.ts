/** A single item in a BreadcrumbList structured data trail. */
export interface IBreadcrumbItem {
    /** Display name for this breadcrumb level. */
    name: string;

    /** Full URL for this breadcrumb level. */
    url: string;
}

export interface ISEOMetadata {
    title: string;
    description: string;
    permalink: string;
    ogImage?: string;
    translationPath?: string;
    articlePublishedTime?: Date;
    articleModifiedTime?: Date;
    articleAuthor?: string;
    articleSection?: string;
    articleTags?: string[];

    /** Breadcrumb trail for BreadcrumbList JSON-LD. Omit for the home page. */
    breadcrumbs?: IBreadcrumbItem[];
}
