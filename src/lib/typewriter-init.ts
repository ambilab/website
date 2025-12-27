/**
 * Typewriter animation initialization script
 * Runs on page load to animate text content when locale is switched
 */

import { COMPONENT_CONFIG } from '@config/components';
import { animateTextSwap, extractTextNodes, type TextElement } from '@lib/typewriter';

const initTypewriter = () => {
    // Check if we should trigger the typewriter effect
    const shouldAnimate = sessionStorage.getItem('typewriter-trigger') === 'true';

    if (!shouldAnimate) {
        return;
    }

    // Clear the flag
    sessionStorage.removeItem('typewriter-trigger');

    // Find the main content container
    const contentContainer = document.querySelector('.mdx-content');

    if (!contentContainer) {
        return;
    }

    // Extract all text nodes from the content
    const textNodes = extractTextNodes(contentContainer as HTMLElement);

    // Create text elements array with current text as "new" text
    const textElements: TextElement[] = textNodes.map((element) => ({
        element,
        newText: element.textContent || '',
    }));

    // Clear the text first
    textElements.forEach(({ element }) => {
        element.textContent = '';
    });

    // Small delay before starting animation
    setTimeout(() => {
        animateTextSwap(textElements, {
            duration: COMPONENT_CONFIG.typewriter.duration,
            stagger: COMPONENT_CONFIG.typewriter.stagger,
            ease: COMPONENT_CONFIG.typewriter.ease,
        });
    }, 100);
};

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriter);
} else {
    initTypewriter();
}
