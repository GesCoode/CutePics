# Deployment (VPS)

## Stack

- **App:** Docker (`app` on port 3001)
- **Database:** PostgreSQL 16 (`app-db`, internal only)
- **Reverse proxy:** Nginx + Let's Encrypt

## `.env` (on server, never commit)

Copy from `.env.example` and set production values:

```env
ORIGIN=https://example.com
POSTGRES_PASSWORD=...
SESSION_SECRET=...
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@example.com
SMTP_PASS=...
SMTP_FROM=My App <noreply@example.com>
```

## Deploy updates

```bash
cd ~/your-app
git pull
docker compose up -d --build
```

## Nginx

Config template: `deploy/nginx/app.conf`

On the server:

```bash
sudo ln -sf /etc/nginx/sites-available/app /etc/nginx/sites-enabled/app
sudo nginx -t && sudo systemctl reload nginx
```

SSL (first time):

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

## Delete a test account

```bash
docker exec -it app-db psql -U app -d app \
  -c "DELETE FROM users WHERE email = 'you@example.com';"
```
