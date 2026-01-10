# Deployment

The Ambilab website is deployed to Cloudflare Pages with SSR support via the Cloudflare adapter.

## Cloudflare Pages Setup

### Build Configuration

| Setting          | Value        |
| ---------------- | ------------ |
| Build command    | `pnpm build` |
| Output directory | `dist`       |
| Node.js version  | 20           |

### GitHub Secrets

Configure these secrets in your GitHub repository (Settings > Secrets and variables > Actions):

| Secret                  | Description                          |
| ----------------------- | ------------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | API token with Pages:Edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID from Cloudflare dashboard |

### Cloudflare Environment Variables

Set in the Pages dashboard (Settings > Environment Variables):

| Variable             | Description                   | Required |
| -------------------- | ----------------------------- | -------- |
| `BUTTONDOWN_API_KEY` | Newsletter API key            | Yes      |
| `NODE_VERSION`       | Node.js version (set to `20`) | Yes      |

## Deployment Process

### Automatic Deployments

Pushes to the `main` branch automatically trigger deployments via GitHub Actions or Cloudflare’s Git integration.

### Manual Deployment

```bash
# Build locally
pnpm build

# Preview build
pnpm preview

# Deploy using Wrangler (if configured)
npx wrangler pages deploy dist
```

## Security

### Security Headers

Security headers are configured in [`src/config/security.ts`](../src/config/security.ts) and applied via middleware.

**Applied Headers:**

| Header                    | Value                             |
| ------------------------- | --------------------------------- |
| `X-Content-Type-Options`  | `nosniff`                         |
| `X-Frame-Options`         | `DENY`                            |
| `X-XSS-Protection`        | `1; mode=block`                   |
| `Referrer-Policy`         | `strict-origin-when-cross-origin` |
| `Content-Security-Policy` | Dynamic with nonce support        |

### Content Security Policy

CSP is configured differently for production and development:

**Production:**

- Strict CSP with nonce-based script execution
- Limited external resource loading
- No inline styles without nonce

**Development:**

- Relaxed CSP for hot module replacement
- Allows `eval` for development tools
- Broader source allowlists

### CSP Implementation

```typescript
// src/config/security.ts
export function buildCSP(config: CSPConfig): string {
  const { nonce, isDev } = config;

  if (isDev) {
    // Development: relaxed for HMR
    return "default-src 'self' 'unsafe-inline' 'unsafe-eval'; ...";
  }

  // Production: strict with nonce
  return `default-src 'self'; script-src 'nonce-${nonce}' 'strict-dynamic'; ...`;
}
```

### Validating Security Headers

Run the validation script to ensure headers are correctly configured:

```bash
pnpm tsx src/scripts/validate-security-headers.ts
```

This validates that:

1. Both `src/middleware.ts` and `functions/_middleware.ts` use the shared security config
2. CSP is properly generated for both environments
3. All required headers are present

## API Endpoints

### Newsletter Subscription

**Endpoint**: `POST /api/newsletter`

Proxies requests to Buttondown API for newsletter subscriptions.

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response (Success):**

```json
{
  "success": true
}
```

**Response (Error):**

```json
{
  "error": "Invalid email address"
}
```

**Environment Variable Required:** `BUTTONDOWN_API_KEY`

## Edge Functions

Cloudflare Pages Functions are located in the `functions/` directory and run at the edge.

### Middleware

`functions/_middleware.ts` handles:

- Security headers injection
- Locale detection
- Request logging (if enabled)

## Domain Configuration

### Production Domains

| Domain      | Locale | Description  |
| ----------- | ------ | ------------ |
| ambilab.com | en     | English site |
| ambilab.cz  | cs     | Czech site   |

### DNS Configuration

Configure CNAME records pointing to your Cloudflare Pages deployment:

```text
ambilab.com     CNAME   your-project.pages.dev
ambilab.cz      CNAME   your-project.pages.dev
www.ambilab.com CNAME   your-project.pages.dev
www.ambilab.cz  CNAME   your-project.pages.dev
```

## Caching

### Edge Caching

Cloudflare automatically caches static assets at the edge. Configure cache behavior in `wrangler.jsonc` or via
`_headers` file.

### Cache Headers

Static assets receive appropriate cache headers:

- **Immutable assets** (hashed): `Cache-Control: public, max-age=31536000, immutable`
- **HTML pages**: `Cache-Control: public, max-age=0, must-revalidate`
- **API routes**: `Cache-Control: no-store`

## Monitoring

### Build Logs

Monitor build status in:

- Cloudflare Pages dashboard
- GitHub Actions (if using CI/CD)

### Runtime Errors

Check Cloudflare Pages logs for runtime errors:

1. Go to Cloudflare Dashboard
2. Select your Pages project
3. Navigate to “Functions” > “Logs”

## Troubleshooting

### Common Issues

**Build fails with “out of memory”:**

- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`

**CSP blocks resources:**

- Check the browser console for CSP violations
- Update `src/config/security.ts` with required sources
- Re-run the validation script

**Newsletter API returns 500:**

- Verify `BUTTONDOWN_API_KEY` is set in Cloudflare
- Check API key validity in Buttondown dashboard

**Fonts not loading:**

- Verify font domain is in CSP `font-src`
- Check CORS headers on the font server

## Related Documentation

- [Content Management](content.md) - Publishing content
- [Internationalization](i18n.md) - Domain-based locale detection
- [Components](components.md) – Newsletter form component
