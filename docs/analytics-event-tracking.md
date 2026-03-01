# Plausible Event Tracking Opportunities

This document outlines potential user interactions that could be tracked with Plausible Analytics custom events.

## Current Interactive Elements

### High Priority (Core Conversions)

#### 1. Newsletter Subscription

**Component:** `src/components/svelte/NewsletterForm.svelte`  
**Event:** Newsletter subscription (success/failure)  
**Why:** Core conversion metric for audience building

```typescript
// In handleSubmit, after successful subscription:
if (response.ok) {
  status = 'success';
  message = t.newsletter.success;
  email = '';

  // Track successful subscription
  window.plausible?.('Newsletter Signup', {
    props: { locale: locale },
  });
}
```

**Metrics to track:**

- Successful subscriptions
- Failed attempts (validation or API errors)
- Locale split (en vs cs)

#### 2. Cookie Banner Dismissal

**Component:** `src/components/svelte/CookieBanner.svelte`  
**Event:** Cookie notice dismissed  
**Why:** User engagement metric, shows banner effectiveness

```typescript
const handleDismiss = () => {
  try {
    localStorage.setItem(COMPONENT_CONFIG.cookieBanner.dismissedKey, 'true');

    // Track dismissal (ironic but useful!)
    window.plausible?.('Cookie Banner Dismissed', {
      props: { locale: locale },
    });
  } catch {
    // Silent fail
  }
  isVisible = false;
};
```

**Why this is useful despite the irony:**

- Shows how many users actually see/interact with the banner
- Helps measure if the banner is too intrusive
- No personal data collected (it's just a count)

### Medium Priority (User Engagement)

#### 3. Language Switch

**Component:** `src/components/svelte/LocaleSwitcher.svelte`  
**Event:** Language switched  
**Why:** Understanding bilingual user behavior

```typescript
const handleLocaleSwitch = async (): Promise<void> => {
  if (isAnimating) return;

  isAnimating = true;

  try {
    document.cookie = setLocaleCookie(otherLocale);

    // Track language switch
    window.plausible?.('Language Switched', {
      props: {
        from: currentLocale,
        to: otherLocale,
        hasTranslation: !!translationPath,
      },
    });

    const targetPath = translationPath || window.location.pathname;
    await navigate(targetPath);
  } catch (error) {
    logger.error('Failed to switch locale', error);
  } finally {
    isAnimating = false;
  }
};
```

**Metrics:**

- How often users switch languages
- Whether they stay on switched language
- Pages without translations (when `hasTranslation` is false)

#### 4. Demo Interactions

**Component:** `src/components/svelte/DemoEmbed.svelte`  
**Event:** Demo loaded/interacted with  
**Why:** Core product engagement metric

```typescript
// Add to DemoEmbed component
onMount(() => {
  // Track when demo is loaded
  window.plausible?.('Demo Loaded', {
    props: {
      demo: src,
      title: title,
    },
  });
});
```

**Current demos:**

- Pong game (`https://blit-tech-demos.ambilab.com/pong`)

**Metrics:**

- Which demos are most popular
- Demo load success rate
- Engagement per locale

### Lower Priority (Secondary Interactions)

#### 5. Mobile Menu Toggle

**Component:** `src/components/svelte/MobileMenu.svelte`  
**Event:** Mobile menu opened  
**Why:** Mobile UX insights

```typescript
function toggleMenu(): void {
  isOpen = !isOpen;

  if (isOpen) {
    window.plausible?.('Mobile Menu Opened');
  }
}
```

**Metrics:**

- Mobile menu usage frequency
- Can inform desktop vs mobile design priorities

#### 6. Go to Top Button

**Component:** `src/components/svelte/GoToTop.svelte`  
**Event:** Scroll to top clicked  
**Why:** Understanding long-form content engagement

```typescript
const handleClick = () => {
  scrollToTop(true);

  // Track scroll-to-top usage
  window.plausible?.('Scroll To Top', {
    props: {
      scrollDepth: Math.round((window.scrollY / document.body.scrollHeight) * 100),
    },
  });
};
```

**Metrics:**

- How far users scroll before using button
- Content length vs engagement patterns

#### 7. Social Link Clicks

**Component:** `src/components/astro/SocialLinks.astro`  
**Event:** Social media link clicked  
**Why:** Understanding which social platforms drive engagement

Plausible has built-in [Outbound Link Click Tracking](https://plausible.io/docs/outbound-link-click-tracking), but you
can add custom props:

```astro
<a
  href={link.url}
  target="_blank"
  rel="noopener noreferrer"
  class="..."
  aria-label={link.name}
  title={link.name}
  onclick={() => {
    window.plausible?.('Social Link Click', {
      props: { platform: link.name },
    });
  }}
>
  <Icon name={link.icon} class="h-5 w-5" />
</a>
```

**Platforms tracked:**

- X (Twitter)
- Threads
- Instagram
- LinkedIn
- Mastodon
- Bluesky
- GitHub

#### 8. Internal CTA Buttons

**Usage:** Throughout MDX content  
**Event:** CTA button clicked  
**Why:** Measuring content effectiveness

Example in `src/content/blog/en/hello-world.mdx`:

```mdx
<Button
  variant="primary"
  size="lg"
  href="/about"
  onclick={() => {
    window.plausible?.('CTA Click', {
      props: {
        from: 'hello-world-blog',
        to: '/about',
        label: 'Learn More About Ambilab',
      },
    });
  }}
>
  Learn More About Ambilab
</Button>
```

### Not Recommended

#### Page View Tracking

Already handled automatically by Plausible's main script.

#### Hover Events

Too noisy, minimal actionable insights.

#### Scroll Depth Tracking

Plausible doesn't have built-in scroll tracking. Would require custom implementation with debouncing. Consider only if
content engagement is a key metric.

## Implementation Strategy

### Phase 1: Core Conversions (Do First)

1. Newsletter signup tracking (both success and errors)
2. Demo interactions
3. Cookie banner dismissal

### Phase 2: User Preferences (Do Next)

1. Language switching
2. Social link clicks

### Phase 3: Secondary Engagement (Optional)

1. Mobile menu usage
2. Scroll to top button
3. CTA button clicks with context

## Technical Implementation

### 1. Create Event Tracking Utility

Create `src/utils/analytics.ts`:

```typescript
/**
 * Analytics Event Tracking Utilities
 *
 * Wrapper functions for Plausible Analytics custom events.
 * Provides type-safe event tracking with graceful degradation.
 */

export interface PlausibleEventProps {
  [key: string]: string | number | boolean;
}

/**
 * Track a custom event with Plausible Analytics.
 * Gracefully handles missing Plausible script.
 *
 * @param eventName - Name of the event to track
 * @param props - Optional custom properties for the event
 */
export function trackEvent(eventName: string, props?: PlausibleEventProps): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Check if Plausible is available
  if (typeof window.plausible === 'function') {
    window.plausible(eventName, { props });
  }
}

// Specific tracking functions for type safety

export function trackNewsletterSignup(locale: string): void {
  trackEvent('Newsletter Signup', { locale });
}

export function trackNewsletterError(locale: string, error: string): void {
  trackEvent('Newsletter Error', { locale, error });
}

export function trackCookieBannerDismissed(locale: string): void {
  trackEvent('Cookie Banner Dismissed', { locale });
}

export function trackLanguageSwitch(from: string, to: string, hasTranslation: boolean): void {
  trackEvent('Language Switched', { from, to, hasTranslation: hasTranslation ? 'yes' : 'no' });
}

export function trackDemoLoaded(demo: string, title: string): void {
  trackEvent('Demo Loaded', { demo, title });
}

export function trackSocialLinkClick(platform: string): void {
  trackEvent('Social Link Click', { platform });
}

export function trackMobileMenuOpened(): void {
  trackEvent('Mobile Menu Opened');
}

export function trackScrollToTop(scrollDepth: number): void {
  trackEvent('Scroll To Top', { scrollDepth });
}

export function trackCTAClick(from: string, to: string, label: string): void {
  trackEvent('CTA Click', { from, to, label });
}
```

### 2. Add TypeScript Declarations

Update `src/env.d.ts`:

```typescript
/// <reference types="astro/client" />

interface Window {
  plausible?: (
    eventName: string,
    options?: {
      props?: Record<string, string | number | boolean>;
      callback?: () => void;
    },
  ) => void;
}
```

### 3. Update Components

Import and use the tracking utilities in your Svelte components:

```typescript
import { trackNewsletterSignup } from '@utils/analytics';

// In your component:
if (response.ok) {
  trackNewsletterSignup(locale);
  // ... rest of success handling
}
```

## Analytics Dashboard Setup

After implementing event tracking, set up goals in your Plausible dashboard:

1. Go to Site Settings > Goals
2. Add custom event goals:
   - `Newsletter Signup` (conversion goal)
   - `Demo Loaded` (engagement goal)
   - `Cookie Banner Dismissed`
   - `Language Switched`
   - etc.

3. Create funnels (if needed):
   - Landing page → Demo Loaded → Newsletter Signup
   - Blog post → CTA Click → About page

## Privacy Considerations

All events tracked:

- Use no personal data
- Are aggregated in Plausible
- Respect `localStorage.plausible_ignore` opt-out
- Are GDPR/CCPA compliant
- Do not use cookies

The irony of tracking cookie banner dismissal is intentional and harmless - it's just a count of how many users interact
with the UI element, with no personal data.

## Testing Events

To test events in development:

```javascript
// Open browser console on your site
window.plausible('Test Event', { props: { source: 'manual-test' } });
```

Then check your Plausible dashboard's real-time view to see if the event appears.

## Monitoring

Regular checks:

- Review event counts weekly
- Look for unexpected drops or spikes
- A/B test changes based on event data
- Set up email reports for key conversion events

## Next Steps

1. Create `src/utils/analytics.ts` with tracking utilities
2. Update `src/env.d.ts` with Plausible window types
3. Implement Phase 1 events (newsletter, demos, cookie banner)
4. Set up goals in Plausible dashboard
5. Test events in staging environment
6. Monitor for a week, then implement Phase 2

## References

- [Plausible Custom Events](https://plausible.io/docs/custom-event-goals)
- [Plausible Custom Properties](https://plausible.io/docs/custom-props/introduction)
- [Plausible Funnels](https://plausible.io/docs/funnel-analysis)
