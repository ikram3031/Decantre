# Decantre Frontend Deployment Guide

This guide explains how to deploy and manage this frontend client website (`Decantre` repository) on the VPS (`144.79.218.126`).

---

## 1. Prerequisites

- SSH access to the VPS (`root@144.79.218.126`).
- Docker installed on the VPS.
- Nginx configured to reverse proxy to port `8001`.

---

## 2. Directory Structure on VPS

We recommend deploying the frontend repository to:
`/opt/decantre-frontend`

---

## 3. Initial Setup & Cloning

If you are setting this up on the server for the first time, SSH into the VPS and run:

```bash
# 1. Login to the VPS
ssh root@144.79.218.126

# 2. Clone the repository
git clone https://github.com/ikram3031/Decantre.git /opt/decantre-frontend
```

---

## 4. Deployment / Update Process

Whenever changes are pushed to the `main` branch of this repository, update the production site using these steps:

```bash
# 1. SSH to the VPS
ssh root@144.79.218.126

# 2. Navigate to the frontend directory
cd /opt/decantre-frontend

# 3. Pull the latest code
git pull origin main

# 4. Stop and remove the existing container (if running)
docker stop decantre-frontend-prod || true
docker rm decantre-frontend-prod || true

# 5. Rebuild the Docker image with the production API URL
docker build \
  --build-arg VITE_API_URL=https://server.decantrebd.com \
  -t decantre-frontend-prod .

# 6. Run the new container on port 8001
docker run -d \
  --name decantre-frontend-prod \
  --restart always \
  -p 8001:8001 \
  decantre-frontend-prod
```

### Build Arguments Configuration:
- `VITE_API_URL`: The URL of the production API backend server (defaults to `https://server.decantrebd.com`).

---

## 5. Nginx Configuration

The VPS uses Nginx to route external traffic to the Docker container. 
The Nginx configuration file for `decantrebd.com` on the VPS is located at `/etc/nginx/sites-available/decantrebd.com` and must look like this:

```nginx
server {
    server_name decantrebd.com www.decantrebd.com;

    location / {
        proxy_pass http://localhost:8001; # Routes traffic to the Docker container
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl; # managed by Certbot
    # SSL configurations here...
}
```

If you modify Nginx configurations, remember to reload the server:
```bash
nginx -t && systemctl reload nginx
```

---

## 6. Maintenance & Troubleshooting

### View Container Logs:
To check if the server is running correctly or debug errors:
```bash
docker logs decantre-frontend-prod --tail 50 -f
```

### Check Container Status:
```bash
docker ps -a --filter name=decantre-frontend-prod
```
