#!/usr/bin/env sh
set -e

# Wait for database if using Postgres
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for database connection..."
  # Use python to check DB connection retries
  python - <<'PYCODE'
import os, time, sys
import urllib.parse as up
import socket
url = os.environ.get('DATABASE_URL')
if not url:
    sys.exit(0)
parsed = up.urlparse(url)
host, port = parsed.hostname, parsed.port or 5432
for i in range(30):
    try:
        with socket.create_connection((host, port), timeout=2):
            print('Database is reachable')
            sys.exit(0)
    except OSError:
        print('Waiting for database...', i+1)
        time.sleep(1)
print('Database not reachable in time', file=sys.stderr)
sys.exit(1)
PYCODE
fi

python manage.py migrate --noinput
python manage.py collectstatic --noinput

# Start Gunicorn
: "${PORT:=8000}"
: "${WEB_CONCURRENCY:=3}"
exec gunicorn electronics_backend.wsgi:application \
    --workers "$WEB_CONCURRENCY" \
    --bind 0.0.0.0:"$PORT" \
    --access-logfile '-' --error-logfile '-' \
    --timeout 120
