# Analytics Setup

This document describes the Plausible Analytics integration for the Ambilab website.

## Overview

The site uses [Plausible Analytics](https://plausible.io/) for privacy-friendly, lightweight analytics tracking.
Plausible is:

- Privacy-focused (no cookies, GDPR/CCPA compliant)
- Lightweight (less than 1kb script)
- Open source
- Self-hostable (though we use the cloud version)

## Multi-Domain Configuration

The website serves two domains with separate Plausible tracking:

- `ambilab.com` - English version with its own tracking code
- `ambilab.cz` - Czech version with its own tracking code

Each domain has a unique Plausible script URL provided by the Plausible dashboard.

## Implementation

### Environment Variables

Two public environment variables control the tracking scripts:

```bash
PUBLIC_PLAUSIBLE_SCRIPT_COM=https://plausible.io/js/pa-u2x-XoDGkzNwPVZ5pu_nu.js
PUBLIC_PLAUSIBLE_SCRIPT_CZ=https://plausible.io/js/pa-pUopz58ph_aSS6ahxp2qF.js
```

These are validated in `src/config/env.ts` using Zod schemas.

### Script Loading

The tracking script is loaded in `src/components/astro/BaseHead.astro`:

1. **Domain Detection**: Automatically detects whether the site is running on `ambilab.com` or `ambilab.cz`
2. **Script Selection**: Loads the appropriate Plausible script based on the domain
3. **Production Only**: Scripts only load in production builds (`import.meta.env.PROD`)
4. **Optional**: If environment variables are not set, analytics gracefully degrades without errors
5. **Performance**: Uses `preconnect` and `dns-prefetch` for optimal loading

### Security

Content Security Policy (CSP) is configured in `src/config/security.ts`:

- `script-src` allows `https://plausible.io` for loading the tracking script
- `connect-src` allows `https://plausible.io` for sending analytics events
- Inline scripts use CSP nonces for additional security

### Code Structure

```astro
---
// Detect domain and select appropriate script
const currentDomain = Astro.url.hostname;
const isComDomain = currentDomain.includes('ambilab.com');
const isCzDomain = currentDomain.includes('ambilab.cz');
const plausibleScript = isComDomain ? plausibleScriptCom : isCzDomain ? plausibleScriptCz : undefined;
---

{
  import.meta.env.PROD && plausibleScript && (
    <>
      <link rel="preconnect" href="https://plausible.io" />
      <link rel="dns-prefetch" href="https://plausible.io" />
      <script is:inline async src={plausibleScript} nonce={nonce} />
      <script is:inline nonce={nonce}>
        window.plausible=window.plausible||function(){(plausible.q = plausible.q || []).push(arguments)};
        plausible.init=plausible.init||function(i){(plausible.o = i || {})}; plausible.init();
      </script>
    </>
  )
}
```

## Features

### Automatic Pageview Tracking

Plausible automatically tracks pageviews on:

- Initial page loads
- Navigation in the single-page application (Astro's client-side routing)

### Custom Event Tracking

To track custom events, use the global `window.plausible` function:

```javascript
// Track a simple event
window.plausible('signup');

// Track an event with custom properties
window.plausible('download', { props: { file: 'whitepaper.pdf' } });

// Track revenue
window.plausible('purchase', {
  revenue: {
    amount: 29.99,
    currency: 'USD',
  },
});
```

### Privacy Features

Plausible respects user privacy:

- No cookies used
- No personal data collected
- Honors `localStorage.plausible_ignore = "true"` for opt-out
- Aggregated data only
- GDPR, CCPA, PECR compliant

## Setup Instructions

### Development

1. Copy `.env.example` to `.env`
2. Add the Plausible script URLs (optional for local development)
3. Analytics will be disabled in development mode unless explicitly enabled

### Production (Cloudflare Pages)

1. Go to Cloudflare Pages dashboard
2. Navigate to Settings > Environment Variables
3. Add two variables:
   - `PUBLIC_PLAUSIBLE_SCRIPT_COM`: Your ambilab.com tracking script URL
   - `PUBLIC_PLAUSIBLE_SCRIPT_CZ`: Your ambilab.cz tracking script URL
4. Deploy the site

### Getting Script URLs from Plausible

1. Log in to your Plausible dashboard
2. Add or select your domain
3. Go to Site Settings > General
4. Copy the script URL from the "JavaScript snippet" section
5. Each domain will have a unique script URL like:
   - `https://plausible.io/js/pa-XXXXXX.js`

## Testing

### Verify Installation

1. Deploy to production
2. Visit your site
3. Open browser DevTools > Network tab
4. Look for requests to `plausible.io/api/event`
5. Check your Plausible dashboard for real-time visitors

### Test Custom Events

```javascript
// Open browser console on your site
window.plausible('test-event', { props: { source: 'manual-test' } });
```

Check the Plausible dashboard to verify the event appears.

### Opt-Out Testing

```javascript
// Opt out
localStorage.setItem('plausible_ignore', 'true');

// Opt back in
localStorage.removeItem('plausible_ignore');
```

## Troubleshooting

### Analytics Not Working

1. Check environment variables are set correctly
2. Verify you're in production mode (not development)
3. Check browser console for CSP violations
4. Verify domain in script URL matches the domain in Plausible settings
5. Check Plausible dashboard for any domain configuration issues

### CSP Violations

If you see CSP errors in the console:

1. Verify `src/config/security.ts` includes `https://plausible.io` in:
   - `script-src`
   - `connect-src`
2. Check that inline scripts use the `nonce={nonce}` attribute

### Multiple Domains

If tracking the wrong domain:

1. Verify environment variables are set correctly for both domains
2. Check domain detection logic in `BaseHead.astro`
3. Use different script URLs for each domain (not the same generic script)

## Maintenance

### Updating Script URLs

If Plausible provides new script URLs:

1. Update environment variables in Cloudflare Pages
2. Update `.env.example` with placeholder examples
3. Redeploy the site

### Monitoring

Regular checks:

- Review Plausible dashboard weekly
- Monitor for unusual traffic patterns
- Verify both domains are tracking correctly
- Check for any CSP violations in production logs

## Future Enhancements

Possible improvements:

- Add revenue tracking for e-commerce features
- Implement custom event tracking for specific user actions
- Add UTM parameter tracking for marketing campaigns
- Set up automated reports via Plausible's email reports feature

## References

- [Plausible Documentation](https://plausible.io/docs)
- [Plausible Integration Guides](https://plausible.io/docs/integration-guides)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
