import { prefersReducedMotion } from '@utils/dom';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

export interface TypewriterOptions {
    duration?: number; // seconds per character block
    stagger?: number; // delay between elements
    ease?: string;
}

export interface TextElement {
    element: HTMLElement;
    newText: string;
}

export const animateTextSwap = (textElements: TextElement[], options: TypewriterOptions = {}): gsap.core.Timeline => {
    // SSR guard: return empty timeline if window is undefined
    if (typeof window === 'undefined') {
        return gsap.timeline();
    }

    const { duration = 0.5, stagger = 0.1, ease = 'none' } = options;

    // Respect prefers-reduced-motion
    if (prefersReducedMotion()) {
        textElements.forEach(({ element, newText }) => {
            element.textContent = newText;
        });
        return gsap.timeline();
    }

    const tl = gsap.timeline();

    textElements.forEach(({ element, newText }, i) => {
        tl.to(
            element,
            {
                duration,
                text: newText,
                ease,
            },
            i * stagger,
        );
    });

    return tl;
};

export const extractTextNodes = (container: HTMLElement, includeWhitespace: boolean = false): HTMLElement[] => {
    // SSR guard: return empty array if document is undefined or container is falsy
    if (typeof document === 'undefined' || !container) {
        return [];
    }

    const textNodes: HTMLElement[] = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
        acceptNode: (node) => {
            const element = node as HTMLElement;
            // Skip script, style, and elements with no text content
            // Always reject completely empty elements, regardless of includeWhitespace
            // Only reject whitespace-only elements when includeWhitespace is false
            if (
                element.tagName === 'SCRIPT' ||
                element.tagName === 'STYLE' ||
                !element.textContent ||
                (!includeWhitespace && !element.textContent?.trim())
            ) {
                return NodeFilter.FILTER_REJECT;
            }
            // Only accept leaf nodes (no children that are elements)
            const hasElementChildren = Array.from(element.childNodes).some(
                (child) => child.nodeType === Node.ELEMENT_NODE,
            );
            return hasElementChildren ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
        },
    });

    let node: Node | null = walker.nextNode();
    while (node) {
        textNodes.push(node as HTMLElement);
        node = walker.nextNode();
    }

    return textNodes;
};
