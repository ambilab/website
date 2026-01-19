# Deployment

Security notes only.

## Security headers and CSP

Security headers are configured in [`src/config/security.ts`](../src/config/security.ts) and applied via middleware. The
CSP is stricter in production and relaxed in development for HMR. Avoid widening production sources without review.

## Validate headers

```bash
pnpm tsx src/scripts/validate-security-headers.ts
```
