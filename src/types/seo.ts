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
}
