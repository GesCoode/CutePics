# CutePics deployment

## Stack

- **App:** Docker (`cutepics` on port 3003)
- **Database:** PostgreSQL 16 (`cutepics-db`, internal only)
- **Reverse proxy:** Nginx + Let's Encrypt
- **Public URL:** https://cutepics.gesmoo.com

## DNS

Add an A record before requesting SSL:

```
cutepics.gesmoo.com  →  your server IP
```

Then:

```bash
sudo certbot --nginx -d cutepics.gesmoo.com
```

## `.env` (on server, never commit)

```env
ORIGIN=https://cutepics.gesmoo.com
POSTGRES_PASSWORD=...
SESSION_SECRET=...
CRON_SECRET=...
GEMINI_API_KEY=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@gesmoo.com
SMTP_PASS=...
SMTP_FROM=CutePics noreply@gesmoo.com
```

Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

After updating `.env`:

```bash
cd ~/CutePics
docker compose up -d
```

## Deploy updates

```bash
cd ~/CutePics
git pull
docker compose up -d --build
```

## Daily emails (18:00 Europe/Amsterdam)

Cron script: `deploy/cutepics-daily.sh`

```bash
sudo cp deploy/cutepics-daily.sh /root/cutepics-daily.sh
sudo chmod +x /root/cutepics-daily.sh
(crontab -l 2>/dev/null; echo 'CRON_TZ=Europe/Amsterdam'; echo '0 18 * * * /root/cutepics-daily.sh >> /var/log/cutepics-cron.log 2>&1') | crontab -
```

## Manual test

```bash
CRON_SECRET=$(grep ^CRON_SECRET= ~/CutePics/.env | cut -d= -f2-)
curl -X POST -H "Authorization: Bearer $CRON_SECRET" http://127.0.0.1:3003/api/cron/daily
```

## Subscribe flow

1. User picks categories and enters email on the homepage
2. `POST /api/subscribe` saves to PostgreSQL
3. Gemini generates a welcome image and SMTP sends it immediately
4. Cron sends a new image every day at 18:00
