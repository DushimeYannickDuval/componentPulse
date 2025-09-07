# syntax=docker/dockerfile:1

FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=8000

WORKDIR /app

# Install system dependencies (for Pillow, psycopg2 if used)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libpq-dev \
      libjpeg62-turbo-dev \
      zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (better caching)
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . .

# Ensure entrypoint script is runnable inside the container
# (we will invoke it via `sh` so chmod is not strictly necessary)

EXPOSE 8000

# Default command runs migrations, collects static, then starts gunicorn
CMD ["sh", "-c", "sh /app/entrypoint.sh"]
