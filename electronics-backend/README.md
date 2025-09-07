# ComponentPulse Backend (Django 4)

Production-ready Django REST API for the ComponentPulse store.

- ASGI/WSGI: WSGI via Gunicorn (container)
- Static files: WhiteNoise
- Database: SQLite (dev) or Postgres (recommended, especially on Railway)
- CORS/CSRF: Configurable via environment variables

## Requirements

- Python 3.11 and pip, or
- Docker (recommended for parity with production)

## Environment Variables

Copy `.env.example` to `.env` and adjust values:

```env
# Required
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Option A: SQLite (default)
# no changes required

# Option B: Local Postgres (no SSL)
DB_ENGINE=django.db.backends.postgresql
DB_NAME=cpulse
DB_USER=cpulse
DB_PASSWORD=cpulse
DB_HOST=127.0.0.1
DB_PORT=5432

# CORS/CSRF (adjust for your frontend URL)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000

# In production on Railway you will receive DATABASE_URL automatically.
```

Notes:
- When `DATABASE_URL` is set (Railway), it takes precedence (via `dj-database-url`) and SSL is enforced.
- For local Postgres without SSL, do not set `DATABASE_URL`; use the `DB_*` variables above.

## Run locally (without Docker)

1) (Optional) start Postgres locally:

```bash
docker run -d --name pg-cpulse \
  -e POSTGRES_USER=cpulse \
  -e POSTGRES_PASSWORD=cpulse \
  -e POSTGRES_DB=cpulse \
  -p 5432:5432 postgres:16
```

2) Install deps and run the server:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver 0.0.0.0:8000
```

API root: http://127.0.0.1:8000/

## Run with Docker

Build and run using your `.env`:

```bash
docker build -t componentpulse-backend:latest -f Dockerfile .

docker run --rm -p 8000:8000 --env-file ./.env componentpulse-backend:latest
```

Container startup process (`entrypoint.sh`):
- Wait for database (if `DATABASE_URL` provided)
- `python manage.py migrate --noinput`
- `python manage.py collectstatic --noinput`
- Start Gunicorn on `$PORT` (default 8000)

## Deployment to Railway

Create a service in Railway pointing to this folder. Dockerfile will be auto-detected.

- Attach a Postgres resource to this service (Railway injects `DATABASE_URL`).
- Set environment variables:
  - `SECRET_KEY` — generate a strong value
  - `DEBUG=False`
  - `ALLOWED_HOSTS=<your-backend>.up.railway.app`
  - `CORS_ALLOWED_ORIGINS=https://<your-frontend>.up.railway.app`
  - `CSRF_TRUSTED_ORIGINS=https://<your-frontend>.up.railway.app`
  - Optional: `DJANGO_LOG_LEVEL=INFO`

Static files are served via WhiteNoise. For media uploads, use a persistent storage (e.g., S3) or a Railway Volume.

## Useful Commands

```bash
# Migrations
python manage.py makemigrations
python manage.py migrate

# Admin user
python manage.py createsuperuser

# Collect static
python manage.py collectstatic
```

## Troubleshooting

- 403/CSRF errors: ensure frontend domain in `CSRF_TRUSTED_ORIGINS` and `CORS_ALLOWED_ORIGINS`.
- CORS errors: verify `CORS_ALLOWED_ORIGINS` and that your frontend uses the correct API base URL (`/api`).
- DB connection on Railway: make sure Postgres resource is attached so `DATABASE_URL` is present.
