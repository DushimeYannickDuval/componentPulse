# ComponentPulse Frontend (Next.js 14)

Modern Next.js storefront for the ComponentPulse API.

- Output: `standalone` (see `next.config.mjs`)
- Docker: Multi-stage build producing a compact runtime image
- API base: `NEXT_PUBLIC_API_URL` (must end with `/api`)

## Requirements

- Node.js 20.x and npm, or
- Docker (recommended for parity with production)

## Environment Variable

- `NEXT_PUBLIC_API_URL` — backend API base URL
  - Local: `http://127.0.0.1:8000/api`
  - Railway: `https://<your-backend>.up.railway.app/api`

## Run locally (without Docker)

```bash
npm ci
export NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
npm run dev  # http://localhost:3000
```

Build and start locally:

```bash
npm run build
npm start
```

## Run with Docker

Build (bakes API URL into the static build), then run:

```bash
# Build
docker build \
  -t componentpulse-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app/api \
  -f Dockerfile .

# Run (also pass at runtime for SSR/API routes)
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app/api \
  componentpulse-frontend:latest
```

## Deployment to Railway

Create a service in Railway pointing to this folder. Dockerfile will be auto-detected.

- Set environment variables:
  - `NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app/api`
- The container listens on `PORT` provided by Railway.

## Notes

- Ensure your backend CORS/CSRF settings allow your frontend domain.
- Verify that all API calls use `NEXT_PUBLIC_API_URL` (see `lib/api.ts`).

## Troubleshooting

- CORS errors: check backend `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.
- 404s from API: ensure `NEXT_PUBLIC_API_URL` ends with `/api` and that the backend endpoints are deployed.
