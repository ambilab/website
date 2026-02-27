# Plausible Analytics Implementation Summary

## Changes Made

### 1. Environment Configuration

**File: `.env.example`**

- Added `PUBLIC_PLAUSIBLE_SCRIPT_COM` for ambilab.com tracking
- Added `PUBLIC_PLAUSIBLE_SCRIPT_CZ` for ambilab.cz tracking
- Documented where to get these values

**File: `src/config/env.ts`**

- Added Zod validation for Plausible environment variables
- Both variables are optional (graceful degradation if not set)
- Validated as URLs using `z.string().url().optional()`

### 2. BaseHead Component Updates

**File: `src/components/astro/BaseHead.astro`**

Added domain detection logic:

```typescript
const plausibleScriptCom = import.meta.env.PUBLIC_PLAUSIBLE_SCRIPT_COM;
const plausibleScriptCz = import.meta.env.PUBLIC_PLAUSIBLE_SCRIPT_CZ;
const isComDomain = currentDomain.includes('ambilab.com');
const isCzDomain = currentDomain.includes('ambilab.cz');
const plausibleScript = isComDomain ? plausibleScriptCom : isCzDomain ? plausibleScriptCz : undefined;
```

Added conditional preconnect hints:

```astro
{
  import.meta.env.PROD && plausibleScript && (
    <>
      <link rel="preconnect" href="https://plausible.io" />
      <link rel="dns-prefetch" href="https://plausible.io" />
    </>
  )
}
```

Replaced old generic script with domain-specific scripts. See `src/components/astro/BaseHead.astro` for the full
implementation.

### 3. Security Configuration

**File: `src/config/security.ts`**

- Added documentation comments explaining Plausible integration
- No code changes needed (CSP already allows plausible.io)

### 4. Documentation

**File: `docs/analytics.md`** (NEW)

- Comprehensive documentation on Plausible setup
- Multi-domain configuration guide
- Testing and troubleshooting instructions
- Privacy and security notes
- Future enhancement ideas

## Key Improvements

### Over Previous Implementation

1. **Domain-Specific Tracking**: Each domain (ambilab.com, ambilab.cz) now has its own tracking code
2. **Environment-Based**: Tracking scripts configured via environment variables
3. **Graceful Degradation**: Works without environment variables (no errors)
4. **Production-Only**: Analytics only load in production builds
5. **Better Performance**: Uses preconnect/dns-prefetch for optimal loading
6. **CSP Compliant**: Uses nonces for inline scripts
7. **Type-Safe**: Environment variables validated with Zod

### Over NPM Package Approach

The implementation uses inline scripts instead of the `@plausible-analytics/tracker` NPM package because:

1. **Smaller Bundle**: No additional JavaScript in the main bundle
2. **Simpler Setup**: No build-time dependencies to manage
3. **Official Method**: Uses Plausible's recommended script approach
4. **Domain-Specific**: Each domain gets its own unique tracking code (pa-XXX.js)
5. **No SSR Issues**: Works perfectly with Astro's SSR without client-side hydration concerns

The NPM package would be useful for:

- SPAs that need programmatic control over tracking
- Complex custom event tracking needs
- Applications already using npm package managers for analytics

For this use case (simple pageview tracking on two domains), the inline script approach is optimal.

## Setup Instructions

### For Development

1. (Optional) Create `.env` file:

   ```bash
   cp .env.example .env
   ```

2. (Optional) Add your Plausible script URLs:
   ```bash
   PUBLIC_PLAUSIBLE_SCRIPT_COM=https://plausible.io/js/pa-u2x-XoDGkzNwPVZ5pu_nu.js
   PUBLIC_PLAUSIBLE_SCRIPT_CZ=https://plausible.io/js/pa-pUopz58ph_aSS6ahxp2qF.js
   ```

Note: Analytics won't load in development mode even with these set.

### For Production (Cloudflare Pages)

1. Go to Cloudflare Pages Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add for Production environment:
   - Variable name: `PUBLIC_PLAUSIBLE_SCRIPT_COM`
   - Value: `https://plausible.io/js/pa-u2x-XoDGkzNwPVZ5pu_nu.js`
5. Add another variable:
   - Variable name: `PUBLIC_PLAUSIBLE_SCRIPT_CZ`
   - Value: `https://plausible.io/js/pa-pUopz58ph_aSS6ahxp2qF.js`
6. Save and redeploy

## Testing

### Verify Installation

1. Deploy to production
2. Visit https://ambilab.com
3. Open DevTools > Network tab
4. Look for:
   - `pa-u2x-XoDGkzNwPVZ5pu_nu.js` loading
   - POST requests to `plausible.io/api/event`
5. Repeat for https://ambilab.cz (should see `pa-pUopz58ph_aSS6ahxp2qF.js`)

### Check Dashboard

1. Go to https://plausible.io/ambilab.com
2. Should see real-time visitors
3. Check https://plausible.io/ambilab.cz separately

## Technical Details

### Domain Detection

The code detects which domain the site is running on:

```typescript
const currentDomain = Astro.url.hostname;
const isComDomain = currentDomain.includes('ambilab.com');
const isCzDomain = currentDomain.includes('ambilab.cz');
```

This works for:

- `ambilab.com`
- `www.ambilab.com`
- `staging.ambilab.com`
- `ambilab.cz`
- `www.ambilab.cz`
- `staging.ambilab.cz`

### Security

Scripts use CSP nonces for security. See the implementation in `src/components/astro/BaseHead.astro`.

The nonce is generated per-request in middleware and ensures only server-rendered scripts can execute.

### Performance

- `preconnect` hint: Establishes early connection to plausible.io
- `dns-prefetch` hint: Resolves DNS early for faster loading
- `async` attribute: Non-blocking script loading
- Conditional loading: Only loads when needed (production + valid config)

## Troubleshooting

### No Analytics Data

**Check:**

1. Environment variables are set in Cloudflare
2. Deployed to production (not preview)
3. Domain in Plausible matches your site domain
4. No adblockers interfering
5. Browser console for errors

### Wrong Domain Tracking

**Fix:**

1. Verify environment variable names match exactly
2. Check domain detection logic works for your URLs
3. Use different script URLs for each domain

### CSP Errors

**Verify:**

1. `src/config/security.ts` includes `https://plausible.io`
2. Scripts use `nonce={nonce}` attribute
3. No additional restrictions in Cloudflare

## Next Steps

Consider adding:

1. **Custom Events**: Track specific user actions

   ```javascript
   window.plausible('signup', { props: { plan: 'pro' } });
   ```

2. **Revenue Tracking**: Track purchases or conversions

   ```javascript
   window.plausible('purchase', {
     revenue: { amount: 29.99, currency: 'USD' },
   });
   ```

3. **Goals**: Set up conversion goals in Plausible dashboard

4. **UTM Tracking**: Plausible automatically tracks UTM parameters

## References

- [Plausible Documentation](https://plausible.io/docs)
- [Integration Guides](https://plausible.io/docs/integration-guides)
- [Privacy Compliance](https://plausible.io/privacy-focused-web-analytics)
