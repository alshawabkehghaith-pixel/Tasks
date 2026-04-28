# Containerisation & Deployment Template
**Internal Engineering Reference — Consulting Agency**

A production-ready template for containerising web applications with a Python backend, Node.js frontend, and Nginx reverse proxy. Covers local development validation, full containerisation, SSL certificate setup, and VM deployment.

---

## Contents

1. [Architecture](#architecture)
2. [Template Structure](#template-structure)
3. [Customisation](#customisation)
4. [Required Application Changes](#required-application-changes)
5. [Phase 1 — Validate Nginx Locally](#phase-1--validate-nginx-locally)
6. [Phase 2 — Containerise and Test](#phase-2--containerise-and-test)
7. [Phase 3 — SSL Certificate](#phase-3--ssl-certificate)
8. [Phase 4 — VM Deployment](#phase-4--vm-deployment)
9. [Phase 5 — Connect Domain and SSL to Nginx](#phase-5--connect-domain-and-ssl-to-nginx)
10. [Verification Checklist](#verification-checklist)
11. [Debugging](#debugging)
12. [Extensions](#extensions)
13. [Production Checklist](#production-checklist)

---

## Architecture

```
Internet
  └─► Nginx :80 / :443         (sole public entry point)
        ├─ {{API_PREFIX}}/*  ──► Backend  :{{BACKEND_PORT}}
        └─ /*               ──► Frontend :{{FRONTEND_PORT}}
```

The backend and frontend containers are never exposed to the host or internet. All ingress flows through Nginx, which terminates SSL, enforces routing, and proxies to upstream services over the internal Docker network.

---

## Template Structure

```
docker-deploy-template/
├── README.md                       this document
├── backend/
│   ├── Dockerfile                  Python backend image
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile                  Node.js frontend image (multi-stage)
│   └── .dockerignore
├── nginx/
│   ├── nginx.conf                  Production — HTTP only
│   ├── nginx.ssl.conf              Production — HTTPS with SSL termination
│   ├── nginx.local-test.conf       Phase 1 validation only
│   └── certs/                      Certificate files (never committed)
├── docker-compose.yml
└── backend/.env.example            Secrets reference (committed)
    backend/.env                    Secrets (never committed)
```

---

## Customisation

Every placeholder follows the format `{{PLACEHOLDER}}`. Use a global find-and-replace across the folder before proceeding.

| Placeholder | Description | Example |
|---|---|---|
| `{{PYTHON_VERSION}}` | Python base image tag | `3.11` |
| `{{NODE_VERSION}}` | Node.js base image tag | `20` |
| `{{BACKEND_PORT}}` | Port the backend server binds to | `8081` |
| `{{FRONTEND_PORT}}` | Port the frontend server binds to | `3000` |
| `{{API_PREFIX}}` | URL path prefix for all API routes | `/api` |
| `{{BACKEND_START_CMD}}` | Command to start the backend process | `python -m app.server` |
| `{{BACKEND_INTERNAL_URL}}` | Backend URL visible to the Next.js Node process | `http://backend:8081` |
| `{{BACKEND_HEALTHCHECK_URL}}` | Full URL used for the Compose healthcheck | `http://localhost:8081/api/healthz` |
| `{{DOMAIN}}` | Public domain name (SSL phases only) | `app.example.com` |

**How to replace — VS Code / Cursor global find-and-replace:**
`Ctrl+Shift+H` → search `{{PLACEHOLDER}}` → replace with the actual value → Replace All.

---

## Required Application Changes

Two code-level changes must be made to the application before containerising. These are required regardless of framework.

### 1. Frontend — Make the backend URL configurable

Development proxies (e.g. Next.js rewrites) typically hardcode `localhost:PORT` as the backend destination. Inside a Docker container the backend is on a separate network and is not reachable via `localhost`.

**Next.js (`next.config.ts`):**

```typescript
// Before
destination: 'http://localhost:8081/api/:path*'

// After
const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8081';
destination: `${backendUrl}/api/:path*`
```

In `docker-compose.yml`, `BACKEND_URL` is set to `http://backend:{{BACKEND_PORT}}` so the Next.js server reaches the backend by its Docker service name. Local development is unaffected — when `BACKEND_URL` is unset, it falls back to `localhost`.

For Vite / CRA applications where all API calls are browser-side fetches using relative paths (`/api/...`), this change is not required. The browser sends relative requests to the Nginx host, which routes them to the backend directly.

### 2. Backend — Update CORS allowed origins

The backend's CORS policy must permit the Nginx origin. When the application runs behind Nginx on port 80, the browser's `Origin` header is `http://localhost`, not `http://localhost:{{FRONTEND_PORT}}`.

```python
# FastAPI example — update to match your framework
CORS_ALLOWED_ORIGINS = [
    "http://localhost:{{FRONTEND_PORT}}",  # local dev
    "http://localhost",                    # containerised (Nginx :80)
    "http://localhost:80",
    # "https://{{DOMAIN}}",               # add when deploying to production
]
```

### 3. Backend — Disable reload mode

Hot-reload (e.g. `reload=true` in uvicorn) watches the filesystem for changes. Inside a container the filesystem is static, making reload mode unnecessary and potentially unstable.

Set reload to `false` in the backend's configuration file before building the image.

---

## Phase 1 — Validate Nginx Locally

**Purpose:** Confirm the Nginx routing configuration is correct before building any Docker images. A misconfiguration caught here takes seconds to fix; the same mistake caught after a full `docker compose build` costs several minutes.

**How it works:** The backend and frontend run natively on the host. A standalone Nginx container is started with `nginx/nginx.local-test.conf`, which routes to `host.docker.internal` — the DNS name Docker Desktop assigns to the host machine. The container has no knowledge of your application images; it only proxies HTTP traffic.

> **Linux without Docker Desktop:** `host.docker.internal` is not set up automatically. Append `--add-host=host.docker.internal:host-gateway` to the `docker run` command in step 2.

### Steps

**1. Start native dev servers**

```bash
# Backend
cd <backend-directory>
<start command>            # e.g. python -m app.server

# Frontend — separate terminal
cd <frontend-directory>
npm run dev
```

Confirm both are accessible before continuing:
```bash
curl http://localhost:{{BACKEND_PORT}}{{API_PREFIX}}/healthz
# Open http://localhost:{{FRONTEND_PORT}} in a browser
```

**2. Run the Nginx validation container**

The container mounts `nginx.local-test.conf` as its active config. It does not use any other file from this template.

```powershell
# Windows PowerShell
docker run --rm -p 80:80 `
  -v "${PWD}/nginx/nginx.local-test.conf:/etc/nginx/nginx.conf:ro" `
  nginx:alpine
```

```bash
# Mac / Linux
docker run --rm -p 80:80 \
  -v "$(pwd)/nginx/nginx.local-test.conf:/etc/nginx/nginx.conf:ro" \
  nginx:alpine
```

The container occupies port 80. Leave it running for the verification step.

**3. Verify routing**

In a new terminal:

```bash
curl http://localhost{{API_PREFIX}}/healthz   # expect JSON from the backend
curl http://localhost/                        # expect HTML from the frontend
```

Open `http://localhost` in a browser. The application should behave identically to accessing it on its native port, except all traffic now flows through Nginx on port 80.

**4. Stop the container**

`Ctrl+C` in the terminal running the container. Phase 1 is complete. Proceed to Phase 2 only if both routes responded correctly.

---

## Phase 2 — Containerise and Test

### Steps

**1. Create the secrets file**

```bash
cp backend/.env.example backend/.env
```

Populate `backend/.env` with real credentials. This file must never be committed.

**2. Build all images**

```bash
docker compose build
```

See [Debugging](#debugging) for common build failures.

**3. Start the stack**

```bash
docker compose up -d
```

Startup order is enforced by `depends_on`: the backend must pass its healthcheck before the frontend starts; the frontend must be running before Nginx starts.

**4. Verify**

```bash
# All services running; only nginx shows published ports
docker compose ps

# API responds through Nginx
curl http://localhost{{API_PREFIX}}/healthz

# Backend is NOT directly accessible (must refuse connection)
curl http://localhost:{{BACKEND_PORT}}/

# Frontend is NOT directly accessible (must refuse connection)
curl http://localhost:{{FRONTEND_PORT}}/
```

Open `http://localhost` and exercise the application end-to-end.

**5. Common operations**

```bash
docker compose logs -f                          # stream all logs
docker compose logs backend                     # single service logs
docker compose restart backend                  # restart after a config change
docker compose down                             # stop and remove containers
docker compose down --rmi all                   # full reset including images
docker compose exec backend sh                  # shell into a running container
```

---

## Phase 3 — SSL Certificate

SSL is required for production. Two approaches are supported: purchasing a certificate from a CA (e.g. Namecheap/Sectigo) and using Let's Encrypt via Certbot.

### Option A — Purchased Certificate (Namecheap / any CA)

**1. Generate a private key and CSR**

Run from the project root. Requires Docker.

```powershell
# Windows PowerShell
docker run --rm -v "${PWD}/nginx/certs:/certs" alpine/openssl req -new `
  -newkey rsa:2048 -nodes `
  -keyout /certs/your_domain.key `
  -out /certs/your_domain.csr `
  -subj "/CN={{DOMAIN}}/O=YourOrganisation/C=US"
```

```bash
# Mac / Linux
docker run --rm -v "$(pwd)/nginx/certs:/certs" alpine/openssl req -new \
  -newkey rsa:2048 -nodes \
  -keyout /certs/your_domain.key \
  -out /certs/your_domain.csr \
  -subj "/CN={{DOMAIN}}/O=YourOrganisation/C=US"
```

`your_domain.key` is the private key — it must never leave the machine or be committed. `your_domain.csr` is submitted to the CA.

**2. Submit the CSR to your CA**

- Log into the CA portal (e.g. Namecheap → SSL Certificates → Activate)
- Select **Server-Side Automation / Manual CSR**
- Server software: **Nginx**
- Paste the contents of `your_domain.csr`

**3. Complete domain validation**

The CA must verify you control the domain. DNS (CNAME) validation is recommended:

- The CA provides a CNAME record (Host + Value)
- Add it in your DNS provider's control panel
- The Host value should be entered without the domain suffix — the DNS provider appends it automatically
- Validation typically completes within 5–15 minutes
- Use [dnschecker.org](https://dnschecker.org) to confirm the CNAME is resolvable before clicking Verify

**4. Download and combine certificate files**

The CA emails a zip containing `your_domain.crt` and `your_domain.ca-bundle`. Extract both into `nginx/certs/`, then combine:

```powershell
# Windows
Get-Content nginx\certs\your_domain.crt, nginx\certs\your_domain.ca-bundle |
  Set-Content nginx\certs\fullchain.crt
```

```bash
# Mac / Linux
cat nginx/certs/your_domain.crt nginx/certs/your_domain.ca-bundle \
  > nginx/certs/fullchain.crt
```

Verify the combined file contains multiple `-----BEGIN CERTIFICATE-----` blocks — this confirms the chain is intact.

`nginx/certs/` should now contain:
```
your_domain.key     private key
fullchain.crt       certificate + intermediate chain
```

Add `nginx/certs/` to `.gitignore`.

---

### Option B — Let's Encrypt (Certbot)

Let's Encrypt requires the domain's DNS A record to point to a publicly reachable server before issuance.

**1. Add Certbot to `docker-compose.yml`**

```yaml
certbot:
  image: certbot/certbot
  volumes:
    - certbot_certs:/etc/letsencrypt
    - certbot_www:/var/www/certbot

nginx:
  volumes:
    - ./nginx/nginx.ssl.conf:/etc/nginx/nginx.conf:ro
    - certbot_certs:/etc/letsencrypt:ro
    - certbot_www:/var/www/certbot:ro
  ports:
    - "80:80"
    - "443:443"

volumes:
  certbot_certs:
  certbot_www:
```

**2. First-time issuance (two-stage)**

Nginx cannot start with the SSL config until certificate files exist. Start with a temporary HTTP-only config, issue the certificate, then switch.

*Stage 1 — start Nginx on HTTP only:*

Create `nginx/nginx.certbot-init.conf`:
```nginx
events { worker_connections 1024; }
http {
  server {
    listen 80;
    server_name {{DOMAIN}};
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 'OK'; add_header Content-Type text/plain; }
  }
}
```
Point `docker-compose.yml` nginx volumes to this file temporarily and run: `docker compose up -d nginx`

*Stage 2 — issue the certificate:*
```bash
docker compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email your@email.com --agree-tos --no-eff-email \
  -d {{DOMAIN}}
```

*Stage 3 — switch to the SSL config and restart:*
```bash
# Restore nginx.ssl.conf in docker-compose.yml volumes, then:
docker compose restart nginx
```

**3. Certificate renewal**

Let's Encrypt certificates expire after 90 days. Automate renewal with a monthly cron job on the server:

```bash
# crontab -e
0 3 1 * * docker compose -f /path/to/docker-compose.yml run --rm certbot renew \
  && docker compose -f /path/to/docker-compose.yml restart nginx
```

---

## Phase 4 — VM Deployment

Any Linux VM with a public IP, SSH access, and Docker installed is sufficient. Common providers: AWS EC2, GCP Compute Engine, DigitalOcean Droplets, Azure VMs, Oracle Cloud.

**Recommended:** Ubuntu 22.04 LTS, minimum 1 vCPU / 1 GB RAM.

### VM Setup

**1. Install Docker**

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
```

**2. Open firewall ports**

This must be done at two levels:

*Cloud provider firewall / security group:*
Add inbound rules allowing TCP port 80 and TCP port 443 from `0.0.0.0/0` (all sources). The exact UI varies by provider:

| Provider | Location |
|---|---|
| AWS | EC2 → Security Groups → Inbound Rules |
| GCP | VPC Network → Firewall → Create Firewall Rule |
| DigitalOcean | Networking → Firewalls → Inbound Rules |
| Azure | Networking → Add Inbound Port Rule |
| Oracle Cloud | VCN → Security List → Add Ingress Rules |

*OS-level firewall (Ubuntu):*
```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
```

### Deploying the Application

**Option A — Transfer project files directly**

```bash
# From your local machine
scp -r /path/to/project user@<vm-ip>:~/app
```

Then on the VM:
```bash
cd ~/app
docker compose up -d
```

**Option B — Push images to Docker Hub, transfer only config files (recommended for large applications)**

Building images on a low-resource VM is slow and may run out of memory. Build locally, push to a registry, and pull on the VM.

*On your local machine:*
```bash
docker login

docker tag <local-backend-image> <dockerhub-username>/<app>-backend:latest
docker tag <local-frontend-image> <dockerhub-username>/<app>-frontend:latest

docker push <dockerhub-username>/<app>-backend:latest
docker push <dockerhub-username>/<app>-frontend:latest
```

*Update `docker-compose.yml` on the VM* — replace the `build:` blocks with `image:` references:
```yaml
backend:
  image: <dockerhub-username>/<app>-backend:latest

frontend:
  image: <dockerhub-username>/<app>-frontend:latest
```

*On the VM:*
```bash
docker compose pull
docker compose up -d
```

Transfer only the config files (not source code):
```
nginx/           (including certs/)
docker-compose.yml
backend/.env
```

**Updating after code changes:**
```bash
# Local machine
docker compose build
docker push <dockerhub-username>/<app>-backend:latest
docker push <dockerhub-username>/<app>-frontend:latest

# VM
docker compose pull
docker compose up -d --force-recreate
```

---

## Phase 5 — Connect Domain and SSL to Nginx

### Prerequisites

- SSL certificate files in `nginx/certs/` (`fullchain.crt` + `your_domain.key`)
- Domain A record pointing to the VM's public IP
- Ports 80 and 443 open on the VM

**Verify DNS before proceeding:**
```bash
nslookup {{DOMAIN}}
# Must return the VM's public IP
```

### Update `nginx.ssl.conf`

Replace all `{{DOMAIN}}` placeholders with the actual domain. Confirm the certificate paths match the filenames in `nginx/certs/`:

```nginx
ssl_certificate     /etc/nginx/certs/fullchain.crt;
ssl_certificate_key /etc/nginx/certs/your_domain.key;
```

### Update `docker-compose.yml`

Switch the nginx service to use the SSL config and expose port 443:

```yaml
nginx:
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.ssl.conf:/etc/nginx/nginx.conf:ro
    - ./nginx/certs:/etc/nginx/certs:ro
```

### Update CORS

Add the production domain to the backend's allowed origins:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:{{FRONTEND_PORT}}",
    "http://localhost",
    "https://{{DOMAIN}}",
]
```

Rebuild and restart:

```bash
docker compose down
docker compose build backend   # only if CORS change requires rebuild
docker compose up -d
```

---

## Verification Checklist

Run after completing Phase 2, and again after Phase 5. All items must pass.

### Phase 2 (HTTP)

```bash
# 1. All services running; only nginx has published ports
docker compose ps

# 2. API responds through Nginx
curl http://localhost{{API_PREFIX}}/healthz
# Expected: JSON from the backend

# 3. Backend is not directly accessible
curl http://localhost:{{BACKEND_PORT}}/
# Expected: connection refused

# 4. Frontend is not directly accessible
curl http://localhost:{{FRONTEND_PORT}}/
# Expected: connection refused

# 5. Application works end-to-end in browser
# Open http://localhost — exercise all major features

# 6. Stack survives a restart
docker compose down && docker compose up -d && docker compose ps
```

### Phase 5 (HTTPS + Domain)

```bash
# 7. HTTP redirects to HTTPS
curl -v http://{{DOMAIN}}/
# Expected: 301 redirect to https://{{DOMAIN}}/

# 8. HTTPS API call succeeds (no -k flag — certificate is trusted)
curl https://{{DOMAIN}}{{API_PREFIX}}/healthz
# Expected: JSON from the backend

# 9. Certificate is valid and issued by the correct CA
curl -v https://{{DOMAIN}}{{API_PREFIX}}/healthz
# In output, look for: issuer: CN=<CA name>
# e.g. "Sectigo RSA Domain Validation Secure Server CA" for Namecheap

# 10. Browser — green padlock, no security warnings
# Open https://{{DOMAIN}} — application must load fully

# 11. Backend is still not directly accessible on the public domain
curl https://{{DOMAIN}}:{{BACKEND_PORT}}/
# Expected: connection refused
```

---

## Debugging

### Build failures

**`pip install` — package not found**
```
ERROR: Could not find a version that satisfies the requirement <package>
```
A package name in `requirements.txt` is incorrect. Common mistakes: `dotenv` → `python-dotenv`, `sklearn` → `scikit-learn`, `PIL` → `Pillow`.

---

**`npm ci` — missing lockfile**
```
npm error The `npm ci` command can only install with an existing package-lock.json
```
Run `npm install` locally in the frontend directory to generate `package-lock.json`, commit it, then rebuild.

---

**Next.js build fails — TypeScript error**
TypeScript errors surface during `npm run build` but not `npm run dev`. Run `npm run build` locally, resolve all errors, then rebuild the image.

---

### Runtime failures

**Backend shows `unhealthy`**

Check logs first:
```bash
docker compose logs backend
```
If logs show the application running but the healthcheck fails, the healthcheck URL path is wrong. Verify `{{BACKEND_HEALTHCHECK_URL}}` matches an existing endpoint. If `curl: command not found` appears, the healthcheck is using curl in a slim image — use the Python-based healthcheck in `docker-compose.yml` instead.

---

**502 Bad Gateway from Nginx**

Nginx is running but cannot reach an upstream service.
```bash
docker compose ps          # confirm upstream containers are running
docker compose logs backend
docker compose logs frontend
```
Verify the port numbers in `nginx.conf` match the actual ports the services bind to.

---

**CORS error in browser console**

The backend rejected the request because the browser's `Origin` does not appear in `CORS_ALLOWED_ORIGINS`. Apply the change from [Required Application Changes](#required-application-changes) and restart the backend.

---

**`nginx: [emerg]` in logs — SSL certificate error**
```bash
docker compose logs nginx
```
Common causes:
- `fullchain.crt` or `your_domain.key` not present in `nginx/certs/` on the server
- Private key does not match the certificate (regenerated after CSR submission) — the key file used must be from the same generation as the submitted CSR
- `fullchain.crt` is missing the intermediate chain — re-combine `your_domain.crt` + `your_domain.ca-bundle`

---

**Domain does not resolve / times out**

```bash
nslookup {{DOMAIN}}
```
If the returned IP does not match the VM's public IP, the DNS A record is pointing elsewhere. Update it in the DNS provider and wait for propagation (check [dnschecker.org](https://dnschecker.org)).

If DNS resolves correctly but the site times out, the VM's firewall is blocking inbound traffic. Verify both the cloud provider security group and the OS-level iptables rules (see [Phase 4](#phase-4--vm-deployment)).

---

**`host.docker.internal` does not resolve (Linux)**

On Linux without Docker Desktop, add `--add-host=host.docker.internal:host-gateway` to the Phase 1 `docker run` command, or add `extra_hosts: ["host.docker.internal:host-gateway"]` to the nginx service in `docker-compose.yml`.

---

## Extensions

Drop-in additions for common stack components. Add each service to `docker-compose.yml`.

### PostgreSQL

```yaml
db:
  image: postgres:15
  environment:
    - POSTGRES_USER=${DB_USER}
    - POSTGRES_PASSWORD=${DB_PASSWORD}
    - POSTGRES_DB=${DB_NAME}
  expose:
    - "5432"
  volumes:
    - db_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD", "pg_isready", "-U", "${DB_USER}"]
    interval: 10s
    retries: 5

volumes:
  db_data:
```

Add `depends_on: db: condition: service_healthy` to the backend service.

---

### Microsoft SQL Server

```yaml
sqlserver:
  image: mcr.microsoft.com/mssql/server:2022-latest
  environment:
    - ACCEPT_EULA=Y
    - SA_PASSWORD=${DB_PASSWORD}
    - MSSQL_PID=Developer
  expose:
    - "1433"
  volumes:
    - sqlserver_data:/var/opt/mssql
  healthcheck:
    test: ["CMD-SHELL", "/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P ${DB_PASSWORD} -Q 'SELECT 1' || exit 1"]
    interval: 15s
    retries: 10
    start_period: 30s
```

Uncomment the ODBC driver block in `backend/Dockerfile` when using pyodbc.

---

### Apache Airflow (LocalExecutor)

```yaml
airflow-postgres:
  image: postgres:15
  environment:
    - POSTGRES_USER=airflow
    - POSTGRES_PASSWORD=airflow
    - POSTGRES_DB=airflow
  expose:
    - "5432"
  healthcheck:
    test: ["CMD", "pg_isready", "-U", "airflow"]
    interval: 10s
    retries: 5

airflow-init:
  image: apache/airflow:2.9.0
  depends_on:
    airflow-postgres:
      condition: service_healthy
  environment:
    - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://airflow:airflow@airflow-postgres/airflow
    - AIRFLOW__CORE__FERNET_KEY=${AIRFLOW_FERNET_KEY}
  command: db migrate

airflow-scheduler:
  image: apache/airflow:2.9.0
  depends_on:
    airflow-init:
      condition: service_completed_successfully
  environment:
    - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://airflow:airflow@airflow-postgres/airflow
    - AIRFLOW__CORE__FERNET_KEY=${AIRFLOW_FERNET_KEY}
  volumes:
    - ./dags:/opt/airflow/dags
    - airflow_logs:/opt/airflow/logs
  command: scheduler

airflow-webserver:
  image: apache/airflow:2.9.0
  depends_on:
    airflow-init:
      condition: service_completed_successfully
  environment:
    - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://airflow:airflow@airflow-postgres/airflow
    - AIRFLOW__CORE__FERNET_KEY=${AIRFLOW_FERNET_KEY}
    - AIRFLOW__WEBSERVER__BASE_URL=https://{{DOMAIN}}/airflow
  volumes:
    - ./dags:/opt/airflow/dags
    - airflow_logs:/opt/airflow/logs
  expose:
    - "8080"
  command: webserver
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/airflow/health"]
    interval: 15s
    retries: 5
```

Add to `nginx.conf` before the catch-all `/` location:
```nginx
location /airflow/ {
  proxy_pass http://airflow-webserver:8080/airflow/;
  proxy_set_header Host $host;
  proxy_read_timeout 120s;
}
```

Generate the Fernet key once and store it securely:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

---

### LDAP (containerised, for development)

```yaml
ldap:
  image: osixia/openldap:1.5.0
  environment:
    - LDAP_ORGANISATION=Example Org
    - LDAP_DOMAIN=example.com
    - LDAP_ADMIN_PASSWORD=${LDAP_ADMIN_PASSWORD}
  expose:
    - "389"
    - "636"
  volumes:
    - ldap_data:/var/lib/ldap
    - ldap_config:/etc/ldap/slapd.d
```

For an external corporate LDAP server, no container is needed — configure the connection via environment variables in `backend/.env`.

---

## Production Checklist

Before going live, verify all of the following.

**Security**
- [ ] `backend/.env` is not committed and not present in any Docker image
- [ ] `nginx/certs/` is excluded from version control
- [ ] Backend and frontend use `expose` (not `ports`) in `docker-compose.yml`
- [ ] HTTPS is enabled with a valid, trusted certificate
- [ ] HTTP redirects to HTTPS (port 80 block in `nginx.ssl.conf`)
- [ ] `CORS_ALLOWED_ORIGINS` contains only the production domain — all `localhost` variants removed
- [ ] Backend reload / debug mode is disabled
- [ ] No default or placeholder passwords remain in any service configuration

**Reliability**
- [ ] All services have a `healthcheck` defined
- [ ] `depends_on` uses `condition: service_healthy` to enforce startup ordering
- [ ] `proxy_read_timeout` is sufficient for the slowest expected operation
- [ ] `client_max_body_size` accommodates the largest expected upload

**Maintainability**
- [ ] Certificate renewal is automated (Let's Encrypt cron job) or calendared (purchased certificate)
- [ ] `docker compose down && docker compose up -d` starts the stack cleanly from any state
- [ ] A new team member can clone the repo, populate `.env` from `.env.example`, and run `docker compose up` with no additional setup

---

## Quick Reference

| Task | Command |
|---|---|
| Build all images | `docker compose build` |
| Start stack | `docker compose up -d` |
| Stop stack | `docker compose down` |
| View all containers | `docker compose ps` |
| Stream logs | `docker compose logs -f` |
| Logs for one service | `docker compose logs <service>` |
| Restart one service | `docker compose restart <service>` |
| Rebuild + restart one service | `docker compose build <service> && docker compose up -d --force-recreate <service>` |
| Shell into container | `docker compose exec <service> sh` |
| Test Nginx config | `docker compose exec nginx nginx -t` |
| Full reset | `docker compose down --rmi all` |
| Phase 1 validation (Windows) | `docker run --rm -p 80:80 -v "${PWD}/nginx/nginx.local-test.conf:/etc/nginx/nginx.conf:ro" nginx:alpine` |
| Phase 1 validation (Mac/Linux) | `docker run --rm -p 80:80 -v "$(pwd)/nginx/nginx.local-test.conf:/etc/nginx/nginx.conf:ro" nginx:alpine` |
| Generate self-signed cert | `docker run --rm -v "${PWD}/nginx/certs:/certs" alpine/openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /certs/domain.key -out /certs/fullchain.crt -subj "/CN={{DOMAIN}}"` |
| Generate Fernet key | `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"` |
