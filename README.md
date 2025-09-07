# ComponentPulse Monorepo

This repository contains:

- electronics-backend/ — Django 4 REST API (Gunicorn + WhiteNoise, Postgres-ready)
- electronics-frontend/ — Next.js 14 app (standalone build)

This guide covers local development, Docker usage, and deployment to Railway for both services.

---

## Prerequisites

- Docker (optional but recommended for parity with production)
- Node.js 20.x and npm (for frontend local dev)
- Python 3.11 and pip (for backend local dev, if not using Docker)
- Git

---

## Environment Variables

- Backend example file: `electronics-backend/.env.example`
  - Copy to `.env` and adjust values for local development.

- Frontend expects `NEXT_PUBLIC_API_URL` pointing to the backend API base, e.g.:
  - Local: `http://127.0.0.1:8000/api`
  - Railway: `https://<your-backend>.up.railway.app/api`

---

## Backend (Django)

Path: `electronics-backend/`

### Quick start (local, without Docker)

1) Create and populate `.env`:

```env
# electronics-backend/.env
SECRET_KEY=dev-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Option A: Use SQLite (default, no changes required)
# Option B: Local Postgres without SSL (recommended for parity). Do NOT set DATABASE_URL locally.
DB_ENGINE=django.db.backends.postgresql
DB_NAME=cpulse
DB_USER=cpulse
DB_PASSWORD=cpulse
DB_HOST=127.0.0.1
DB_PORT=5432

# CORS/CSRF (adjust if running the frontend locally on a different port)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000
```

2) (Optional) Start a local Postgres:

```bash
docker run -d --name pg-cpulse \
  -e POSTGRES_USER=cpulse \
  -e POSTGRES_PASSWORD=cpulse \
  -e POSTGRES_DB=cpulse \
  -p 5432:5432 postgres:16
```

3) Install and run:

```bash
cd electronics-backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver 0.0.0.0:8000
```

API root (sanity check): http://127.0.0.1:8000/

> Note: In production (Railway), the app uses `DATABASE_URL` and requires SSL. For local Postgres without SSL, use the `DB_*` variables (do not set `DATABASE_URL`).

### Run the backend with Docker

```bash
# Build
docker build -t componentpulse-backend:latest -f electronics-backend/Dockerfile electronics-backend

# Run using your .env (copy .env.example to .env and edit first)
docker run --rm -p 8000:8000 --env-file electronics-backend/.env componentpulse-backend:latest
```

What the container does on start:

- Waits for `DATABASE_URL` (if set) to be reachable
- `python manage.py migrate --noinput`
- `python manage.py collectstatic --noinput`
- Starts `gunicorn` on `$PORT` (default 8000)

---

## Frontend (Next.js 14)

Path: `electronics-frontend/`

### Quick start (local, without Docker)

```bash
cd electronics-frontend
npm ci
# Set the backend API URL for local dev
export NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
npm run dev  # http://localhost:3000
```

To build and start locally:

```bash
npm run build
npm start
```

### Run the frontend with Docker

```bash
# Build, baking the backend API URL into the build
docker build \
  -t componentpulse-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app/api \
  -f electronics-frontend/Dockerfile electronics-frontend

# Run (you can also pass NEXT_PUBLIC_API_URL at runtime for SSR/API routes)
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app/api \
  componentpulse-frontend:latest
```

> For local development, you can set `--build-arg NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api`.

---

## Deployment on Railway

This repo is designed for two Railway services: one for the backend and one for the frontend.

### Backend service (Django)

- Root directory: `electronics-backend/`
- Deployment method: Dockerfile (auto-detected by Railway)
- Attach a Postgres database resource to this service (Railway will set `DATABASE_URL`).
- Required environment variables:
  - `SECRET_KEY` (generate a strong value)
  - `DEBUG=False`
  - `ALLOWED_HOSTS=<your-backend>.up.railway.app`
  - `CORS_ALLOWED_ORIGINS=https://<your-frontend>.up.railway.app`
  - `CSRF_TRUSTED_ORIGINS=https://<your-frontend>.up.railway.app`
  - Optional: `DJANGO_LOG_LEVEL=INFO`
  - Optional: Google/Email settings as needed
- On deploy/start, the container will run migrations and collect static automatically.

### Frontend service (Next.js)

- Root directory: `electronics-frontend/`
- Deployment method: Dockerfile (auto-detected)
- Environment variables:
  - `NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app/api`
- Railway will provide `PORT`; the container listens on it.

### Domains

- After first deploy, Railway assigns unique subdomains.
- Replace `<your-backend>` and `<your-frontend>` above with the actual subdomains or your custom domains.

---

## CORS/CSRF Notes

- The backend (`electronics-backend/electronics_backend/settings.py`) allows configuring:
  - `ALLOWED_HOSTS` (default includes `.railway.app`)
  - `CORS_ALLOWED_ORIGINS` (defaults to localhost)
  - `CORS_ALLOWED_ORIGIN_REGEXES` (defaults to allow `https://*.railway.app`)
  - `CSRF_TRUSTED_ORIGINS` (configure your frontend domain)

Make sure your production frontend URL is included in both CORS and CSRF trusted origins.

---

## Media & Static Files

- Static files are served by WhiteNoise in production, collected to `staticfiles/` at container start.
- Media files (user uploads) should not be stored on ephemeral containers:
  - Use a cloud storage service (e.g., S3 via `django-storages`) or a Railway Volume.

---

## Troubleshooting

- 403 / CSRF issues
  - Add your frontend domain to `CSRF_TRUSTED_ORIGINS` and `CORS_ALLOWED_ORIGINS`.
- CORS errors on the frontend
  - Verify `NEXT_PUBLIC_API_URL` is correct and points to the backend `/api` base.
  - Ensure the backend CORS settings include your frontend URL.
- Database connection errors on Railway
  - Ensure Postgres is attached and `DATABASE_URL` is present.
- Local Postgres connection errors
  - Avoid `DATABASE_URL` locally (it enforces SSL by default).
  - Use `DB_ENGINE=django.db.backends.postgresql` and friends instead.
- Logs
  - Django logs to console and to `electronics-backend/debug.log` when running in that directory.

---

## Useful Endpoints

- API root: `/` — see `electronics-backend/electronics_backend/urls.py` for exposed resources under `/api/`.
- Frontend app: `/` on the frontend service (Next.js).

---

## License

This project is provided as-is. Add your license details here if needed.
