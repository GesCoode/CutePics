# MemLyra deployment (VPS)

## Stack

- **App:** Docker (`memlyra` on port 3001)
- **Database:** PostgreSQL 16 (`memlyra-db`, internal only)
- **Reverse proxy:** Nginx + Let's Encrypt
- **Public URL:** https://memlyra.com

## `.env` (on server, never commit)

```env
ORIGIN=https://memlyra.com
POSTGRES_PASSWORD=...
SESSION_SECRET=...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contact@gesmoo.com
SMTP_PASS=<google-app-password>
SMTP_FROM=MemLyra <noreply@gesmoo.com>
```

## Deploy updates

```bash
cd ~/MemLyra
git pull
docker compose up -d --build
```

## Nginx

Config template: `deploy/nginx/memlyra.conf`

On the server:

```bash
sudo ln -sf /etc/nginx/sites-available/memlyra /etc/nginx/sites-enabled/memlyra
sudo nginx -t && sudo systemctl reload nginx
```

SSL (first time):

```bash
sudo certbot --nginx -d memlyra.com -d www.memlyra.com
```

## Cloudflare

- DNS: `memlyra.com` and `www` → server IP (proxied is fine)
- SSL/TLS mode: **Full (strict)** (origin has a valid Let's Encrypt cert)

## Delete a test account

```bash
docker exec -it memlyra-db psql -U memlyra -d memlyra \
  -c "DELETE FROM users WHERE email = 'you@example.com';"
```
