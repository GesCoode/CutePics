#!/bin/bash
set -euo pipefail
CRON_SECRET=$(grep '^CRON_SECRET=' /root/CutePics/.env | cut -d= -f2-)
curl -sf -X POST \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  http://127.0.0.1:3003/api/cron/daily
