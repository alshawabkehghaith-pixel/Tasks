# Domain & SSL Configuration with Nginx

This document covers how to connect a domain name to your Nginx setup and enable HTTPS. This is a deployment concern — it does not affect local development at all. On your local machine `http://localhost` stays as-is.

---

## The Mental Model

```
User types: https://docchecker.yourcompany.com/api/healthz

1. Browser asks DNS:  what IP is docchecker.yourcompany.com?
   DNS answers:       203.0.113.42  (your server's public IP)

2. Browser connects to 203.0.113.42:443 (HTTPS)
   Nginx presents SSL certificate → browser trusts it → encrypted connection established

3. Nginx sees: server_name = docchecker.yourcompany.com, path = /api/healthz
   Routes to:  backend container (plain HTTP inside Docker network — no certs needed internally)

4. Backend responds → Nginx forwards back → browser receives the response
```

Three things make this work:
1. **DNS** — points the domain to your server's IP (done in a DNS provider, not in Nginx)
2. **`server_name`** — tells Nginx which domain to respond to (done in `nginx.conf`)
3. **SSL certificate** — proves the domain is yours so HTTPS works (issued by Let's Encrypt via Certbot)

---

---

# Part 1 — DNS

## What It Is

DNS (Domain Name System) translates a human-readable domain name into an IP address. You configure this at wherever your domain is registered — Cloudflare, Route 53 (AWS), GoDaddy, Namecheap, etc. Nginx is not involved in this step.

## What to Add

Log into your DNS provider and create an **A record**:

| Field | Value |
|---|---|
| Type | A |
| Name | `docchecker` (for a subdomain) or `@` (for the root domain) |
| Value | Your server's public IP address |
| TTL | 300 (5 minutes — low TTL is good while setting up) |

After saving, the domain `docchecker.yourcompany.com` will resolve to your server's IP. DNS propagation can take a few minutes up to a few hours depending on the provider.

## Verify DNS is Propagated

```powershell
# Run this from your local machine — not the server
nslookup docchecker.yourcompany.com

# Or use an online tool:
# https://dnschecker.org
```

Do not move on to Nginx config or certificates until this resolves correctly.

---

---

# Part 2 — Nginx `server_name`

## What It Is

Right now your `nginx.conf` has no `server_name`, which means Nginx responds to any hostname — `localhost`, an IP address, anything. Once you have a domain you tell Nginx explicitly which hostname to accept.

## Current Config vs Domain Config

**Current (local dev):**
```nginx
server {
    listen 80;

    location /api/ { ... }
    location / { ... }
}
```

**With a domain:**
```nginx
server {
    listen 80;
    server_name docchecker.yourcompany.com;   # ← only respond to this domain

    location /api/ { ... }
    location / { ... }
}
```

## Serving Multiple Domains from One Nginx

You can have multiple `server` blocks, each with a different `server_name`. Nginx matches the incoming request's `Host` header against all `server_name` values and routes accordingly:

```nginx
server {
    listen 80;
    server_name docchecker.yourcompany.com;
    # DocChecker routing rules...
}

server {
    listen 80;
    server_name otherapp.yourcompany.com;
    # Other app routing rules...
}
```

This is called **name-based virtual hosting** — one Nginx instance, one IP, multiple domains.

---

---

# Part 3 — SSL Certificate with Let's Encrypt + Certbot

## What It Is

**Let's Encrypt** is a free, automated certificate authority. It issues SSL certificates that browsers trust.

**Certbot** is the tool that:
1. Proves to Let's Encrypt that you own the domain (by temporarily serving a file that Let's Encrypt checks)
2. Downloads the certificate to your server
3. Auto-renews it every 90 days (certificates expire after 90 days)

## How the Proof of Ownership Works

```
Certbot running on your server
    └─► Tells Let's Encrypt: "I own docchecker.yourcompany.com"
    └─► Let's Encrypt says: "Prove it — serve this file at:
            http://docchecker.yourcompany.com/.well-known/acme-challenge/XYZ"
    └─► Certbot serves that file through Nginx
    └─► Let's Encrypt fetches it, verifies it ← this is why DNS must point to your server first
    └─► Let's Encrypt issues the certificate
```

This is why DNS propagation must be complete before running Certbot.

---

---

# Part 4 — Full Nginx + Certbot Docker Setup

## Updated `nginx/nginx.conf`

This replaces your current `nginx.conf` when deploying with a domain:

```nginx
events {
  worker_connections 1024;
}

http {
  client_max_body_size 50M;

  upstream frontend {
    server frontend:3000;
  }

  upstream backend {
    server backend:8081;
  }

  # Step 1: HTTP server — used during certificate issuance and to redirect to HTTPS
  server {
    listen 80;
    server_name docchecker.yourcompany.com;

    # Certbot places a challenge file here during certificate issuance
    location /.well-known/acme-challenge/ {
      root /var/www/certbot;
    }

    # Redirect all other HTTP traffic to HTTPS
    location / {
      return 301 https://$host$request_uri;
    }
  }

  # Step 2: HTTPS server — the actual application
  server {
    listen 443 ssl;
    server_name docchecker.yourcompany.com;

    ssl_certificate     /etc/letsencrypt/live/docchecker.yourcompany.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docchecker.yourcompany.com/privkey.pem;

    # Mozilla-recommended SSL settings
    ssl_protocols             TLSv1.2 TLSv1.3;
    ssl_ciphers               ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache         shared:SSL:10m;
    ssl_session_timeout       1d;

    location /api/ {
      proxy_pass         http://backend;
      proxy_http_version 1.1;
      proxy_set_header   Host              $host;
      proxy_set_header   X-Real-IP         $remote_addr;
      proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto https;
      proxy_read_timeout 300s;
      proxy_send_timeout 300s;
    }

    location / {
      proxy_pass         http://frontend;
      proxy_http_version 1.1;
      proxy_set_header   Upgrade    $http_upgrade;
      proxy_set_header   Connection "upgrade";
      proxy_set_header   Host       $host;
    }
  }
}
```

---

## Updated `docker-compose.yml`

Add the `certbot` service and update the `nginx` service to expose port 443 and mount the certificate volumes:

```yaml
services:

  backend:
    build:
      context: ./Backend
      dockerfile: Dockerfile
    env_file:
      - ./Backend/.env
    expose:
      - "8081"
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8081/api/healthz')"]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 15s

  frontend:
    build:
      context: ./Frontend
      dockerfile: Dockerfile
    environment:
      - BACKEND_URL=http://backend:8081
    expose:
      - "3000"
    depends_on:
      backend:
        condition: service_healthy

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"                                        # ← add HTTPS port
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - certbot_certs:/etc/letsencrypt:ro                # ← certificate files
      - certbot_www:/var/www/certbot:ro                  # ← challenge files during issuance
    depends_on:
      - frontend
      - backend

  certbot:
    image: certbot/certbot
    volumes:
      - certbot_certs:/etc/letsencrypt                   # ← writes certificates here
      - certbot_www:/var/www/certbot                     # ← writes challenge files here
    # This container is used on-demand, not always running
    # See Part 5 for the commands to run

volumes:
  certbot_certs:
  certbot_www:
```

---

---

# Part 5 — Issuing the Certificate

## Important: Two-Stage First-Time Setup

The first time you set up SSL there is a chicken-and-egg situation: Nginx needs the certificate files to start (because `nginx.conf` references them), but Certbot needs Nginx running to serve the challenge file. The solution is a two-stage first-time setup.

### Stage 1 — Start Nginx on HTTP Only First

Before you add the HTTPS `server` block to `nginx.conf`, start with a simplified config that only handles port 80 and the Certbot challenge path:

```nginx
# Use this temporarily for first-time certificate issuance only
events { worker_connections 1024; }

http {
  server {
    listen 80;
    server_name docchecker.yourcompany.com;

    location /.well-known/acme-challenge/ {
      root /var/www/certbot;
    }

    location / {
      return 200 'Nginx is up, certificate pending';
      add_header Content-Type text/plain;
    }
  }
}
```

Start the stack with this config:

```bash
docker compose up -d nginx
```

### Stage 2 — Run Certbot to Issue the Certificate

```bash
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email your@email.com \
  --agree-tos \
  --no-eff-email \
  -d docchecker.yourcompany.com
```

If successful you will see:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/docchecker.yourcompany.com/fullchain.pem
```

### Stage 3 — Switch to the Full HTTPS Config

Now replace `nginx.conf` with the full config from Part 4 (both the port 80 redirect block and the port 443 SSL block) and restart Nginx:

```bash
docker compose restart nginx
```

The full stack is now running on HTTPS.

---

## Certificate Renewal

Let's Encrypt certificates expire after 90 days. Renew with:

```bash
docker compose run --rm certbot renew
docker compose restart nginx
```

In production this is automated with a cron job or a scheduled task that runs the above two commands monthly.

---

---

# Part 6 — What Changes in the Backend (CORS)

When you switch to a domain, the browser's `Origin` header changes from `http://localhost` to `https://docchecker.yourcompany.com`. Update `Backend/app/config.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",                          # local dev
    "http://localhost",                               # local containerised
    "https://docchecker.yourcompany.com",             # production domain
]
```

---

---

# Part 7 — Summary of Changes vs Local Setup

| Item | Local Dev | With Domain + SSL |
|---|---|---|
| URL | `http://localhost` | `https://docchecker.yourcompany.com` |
| Nginx port 80 | Serves the app | Redirects to HTTPS |
| Nginx port 443 | Not used | Serves the app over HTTPS |
| `server_name` | Not set (responds to all) | Set to the domain |
| SSL certificate | Not needed | Issued by Let's Encrypt via Certbot |
| DNS | Not applicable | A record points domain to server IP |
| CORS origins | `http://localhost` variants | Add the production domain |
| `docker-compose.yml` | Port 80 only | Ports 80 + 443, certbot service, two volumes |
| Certificate renewal | Not needed | Automated every 90 days |

---

# Key Concepts to Know

| Term | What It Means |
|---|---|
| **A record** | DNS record that maps a domain name to an IPv4 address |
| **SSL/TLS** | The protocol that encrypts traffic between browser and server (what makes HTTPS work) |
| **Certificate** | A file that proves your server owns the domain; issued by a trusted authority |
| **Let's Encrypt** | A free, automated certificate authority trusted by all major browsers |
| **Certbot** | The tool that requests and renews Let's Encrypt certificates |
| **`server_name`** | Nginx directive that tells a server block which domain to respond to |
| **SSL termination** | Nginx decrypts HTTPS at the edge; internal Docker traffic stays plain HTTP |
| **Virtual hosting** | Running multiple domains/apps from one Nginx using separate `server` blocks |
| **Certificate renewal** | Let's Encrypt certs last 90 days; Certbot automates the renewal process |

---

# Further Reading

- [Nginx `server_name` documentation](https://nginx.org/en/docs/http/server_names.html) — name-based virtual hosting in depth
- [How Let's Encrypt works](https://letsencrypt.org/how-it-works/) — 5-minute read on the certificate issuance process
- [Mozilla SSL configuration generator](https://ssl-config.mozilla.org/) — generates the correct `ssl_protocols`, `ssl_ciphers` directives for your Nginx version
- [Certbot + Nginx + Docker walkthrough](https://mindsers.blog/en/post/https-using-nginx-certbot-docker/) — practical guide for the exact Docker pattern used here
- [DNS propagation checker](https://dnschecker.org) — verify your A record is visible worldwide before running Certbot
