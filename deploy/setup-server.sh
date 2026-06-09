#!/bin/bash
set -euo pipefail
mkdir -p ~/CutePics
cd ~/CutePics
tar -xzf /root/cutepics-deploy.tgz
rm -f /root/cutepics-deploy.tgz

read_env() {
  grep "^$1=" ~/MemLyra/.env | cut -d= -f2-
}

SMTP_HOST=$(read_env SMTP_HOST)
SMTP_PORT=$(read_env SMTP_PORT)
SMTP_SECURE=$(read_env SMTP_SECURE)
SMTP_USER=$(read_env SMTP_USER)
SMTP_PASS=$(read_env SMTP_PASS)

POSTGRES_PASSWORD=$(openssl rand -hex 24)
SESSION_SECRET=$(openssl rand -hex 32)
CRON_SECRET=$(openssl rand -hex 32)

GEMINI_API_KEY=""
if [ -f .env ] && grep -q '^GEMINI_API_KEY=.' .env 2>/dev/null; then
  GEMINI_API_KEY=$(grep '^GEMINI_API_KEY=' .env | cut -d= -f2-)
fi

printf '%s\n' \
  "ORIGIN=https://cutepics.gesmoo.com" \
  "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" \
  "SESSION_SECRET=${SESSION_SECRET}" \
  "CRON_SECRET=${CRON_SECRET}" \
  "SMTP_HOST=${SMTP_HOST}" \
  "SMTP_PORT=${SMTP_PORT}" \
  "SMTP_SECURE=${SMTP_SECURE}" \
  "SMTP_USER=${SMTP_USER}" \
  "SMTP_PASS=${SMTP_PASS}" \
  "SMTP_FROM=CutePics noreply@gesmoo.com" \
  "GEMINI_API_KEY=${GEMINI_API_KEY}" \
  "GEMINI_IMAGE_MODEL=imagen-4.0-generate-001" \
  "GEMINI_FALLBACK_MODEL=gemini-2.0-flash-preview-image-generation" \
  > .env

docker compose up -d --build
docker ps --filter name=cutepics
