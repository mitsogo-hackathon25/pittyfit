# Fix “Upload too large” (HTTP 413) on VPS

**HTTP 413** means the reverse proxy (Nginx) rejected the request because the body was larger than `client_max_body_size` (often **1MB** by default). Django never sees the upload.

The admin UI compresses images and sends **one image per API request**, but each file can still be ~0.5–1MB, and an old deployed build may still send everything in a single multipart body (~50MB for 10×5MB files).

## 1. Raise Nginx `client_max_body_size`

Edit your site config (often `/etc/nginx/sites-available/pittyfit` or `default`):

```nginx
server {
    listen 80;
    server_name pitty.fit www.pitty.fit;

    # Allow multi-image product saves (adjust if needed)
    client_max_body_size 50M;

    location / {
        root /var/www/pittyfit/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        client_max_body_size 50M;
        proxy_pass http://127.0.0.1:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /media/ {
        alias /var/www/pittyfit/backend/media/;
    }
}
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 2. Django limits (already in `settings.py`)

Defaults allow **50MB** per request via `DATA_UPLOAD_MAX_MEMORY_SIZE` / `FILE_UPLOAD_MAX_MEMORY_SIZE`. Override in `backend/.env` if needed:

```env
DATA_UPLOAD_MAX_MEMORY_SIZE=52428800
FILE_UPLOAD_MAX_MEMORY_SIZE=52428800
```

Restart gunicorn after changing `.env`.

## 3. Smaller files (recommended)

Even with a higher limit, compress images before upload:

| Section        | Target size (each) |
|----------------|--------------------|
| Model views    | ~200–400 KB JPG    |
| Detail / macro | ~150–300 KB JPG    |
| Flat lay       | ~200–400 KB JPG    |

**Tip:** Save the product after uploading **one section at a time** (model → save → edit → detail → save) to keep each request smaller.
