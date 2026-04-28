# Containerisation & Deployment Template
**Internal Engineering Reference — Consulting Agency**

Production-ready template for containerising a Python backend + Node.js frontend behind an Nginx reverse proxy with SSL.

---

## Contents

1. [Architecture](#architecture)
2. [Template Structure](#template-structure)
3. [Customisation](#customisation)
4. [Required Application Changes](#required-application-changes)
5. [Phase 1 — Containerise and Test](#phase-1--containerise-and-test)
6. [Phase 2 — SSL Certificate](#phase-2--ssl-certificate)
7. [Phase 3 — VM Deployment](#phase-3--vm-deployment)
8. [Phase 4 — Connect Domain and SSL](#phase-4--connect-domain-and-ssl)
9. [Verification Checklist](#verification-checklist)
10. [Debugging](#debugging)
11. [Extensions](#extensions)
12. [Production Checklist](#production-checklist)
13. [Quick Reference](#quick-reference)

---

## Architecture

```
Internet
  └─► Nginx :80 / :443
        ├─ {{API_PREFIX}}/*  ──► Backend  :{{BACKEND_PORT}}
        └─ /*               ──► Frontend :{{FRONTEND_PORT}}
```

Nginx is the sole public entry point. The backend and frontend are on the internal Docker network only — never reachable directly from outside.

---

## Template Structure

```
docker-deploy-template/
├── README.md
├── backend/
│   ├── Dockerfile                  Python backend image
│   ├── .dockerignore
│   
│       
├── frontend/
│   ├── Dockerfile                  Node.js multi-stage image
│   └── .dockerignore
├── nginx/
│   ├── nginx.ssl.conf              HTTPS with SSL termination
│   └── certs/                      Certificate files — never commit
└── docker-compose.yml
```

---

## Customisation

Replace every `{{PLACEHOLDER}}` before use

| Placeholder | Description | Example |
|---|---|---|
| `{{PYTHON_VERSION}}` | Python base image tag | `3.11` |
| `{{NODE_VERSION}}` | Node.js base image tag | `20` |
| `{{BACKEND_PORT}}` | Port the backend server binds to | `8081` |
| `{{FRONTEND_PORT}}` | Port the frontend server binds to | `3000` |
| `{{API_PREFIX}}` | URL path prefix for all API routes | `/api` |
| `{{BACKEND_START_CMD}}` | Command to start the backend | `python -m app.server` |
| `{{BACKEND_INTERNAL_URL}}` | Backend URL used by the Next.js Node process | `http://backend:8081` |
| `{{BACKEND_HEALTHCHECK_URL}}` | Full URL for the Compose healthcheck | `http://localhost:8081/api/healthz` |
| `{{DOMAIN}}` | Public domain name | `app.example.com` |

---

## Required Application Changes

Make these changes to the application source before building images.

### 1. Frontend — configurable backend URL

Next.js rewrites typically hardcode `localhost` as the backend destination. Inside Docker, services communicate by service name, not `localhost`.

**`next.config.ts`:**
```typescript
// Before
destination: 'http://localhost:8081/api/:path*'

// After
const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8081';
destination: `${backendUrl}/api/:path*`
```

`BACKEND_URL` is set to `{{BACKEND_INTERNAL_URL}}` in `docker-compose.yml`. Local dev is unaffected — without the env var it falls back to `localhost`.

> Vite / CRA apps that use browser-side relative paths (`/api/...`) do not need this change.

### 2. Backend — CORS allowed origins

Behind Nginx on port 80, the browser sends `Origin: http://localhost` — not `http://localhost:{{FRONTEND_PORT}}`.

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:{{FRONTEND_PORT}}",  # local dev
    "http://localhost",                    # containerised via Nginx
    "http://localhost:80",
    # "https://{{DOMAIN}}",               # add in Phase 4
]
```

### 3. Backend — disable reload mode

Hot-reload (e.g. `reload=true` in uvicorn) is unnecessary and potentially unstable inside a container. Set it to `false` before building.

---

## Phase 1 — Containerise and Test

**1. Create the secrets file**

```bash
cp backend/.env.example backend/.env
# Populate with real credentials
```

**2. Build and start**

```bash
docker compose build
docker compose up -d
```

Startup order is enforced: backend healthcheck passes → frontend starts → nginx starts.

**3. Verify**

```bash
docker compose ps                           # only nginx shows published ports
curl http://localhost{{API_PREFIX}}/healthz # expect JSON
curl http://localhost:{{BACKEND_PORT}}/     # must refuse connection
curl http://localhost:{{FRONTEND_PORT}}/    # must refuse connection
```

Open `http://localhost` and exercise the application end-to-end.

**Common operations**

```bash
docker compose logs -f
docker compose logs <service>
docker compose restart <service>
docker compose down
docker compose down --rmi all              # full reset including images
docker compose exec <service> sh
```

---

## Phase 2 — SSL Certificate

### Option A — Purchased certificate (Namecheap / any CA)

**1. Generate a private key and CSR**

```powershell
# Windows
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

Keep `your_domain.key` secure — it must never leave the machine or be committed. Submit the contents of `your_domain.csr` to the CA.

**2. Submit CSR to the CA**

- CA portal → SSL Certificates → Activate
- Server-Side Automation / Manual CSR → Server software: **Nginx**
- Paste the contents of `your_domain.csr`

**3. Domain validation (CNAME method)**

The CA provides a CNAME record (Host + Value). Add it in your DNS provider:
- Enter only the subdomain part in the Host field — the provider appends the domain automatically
- Validation takes 5–15 minutes; confirm propagation at [dnschecker.org](https://dnschecker.org) before clicking Verify

**4. Combine certificate files**

The CA emails a zip with `your_domain.crt` and `your_domain.ca-bundle`. Extract both to `nginx/certs/`, then combine:

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

`nginx/certs/` should now contain `your_domain.key` and `fullchain.crt`. Add this directory to `.gitignore`.

---

### Option B — Let's Encrypt (Certbot)

The domain's DNS A record must already point to the public VM before issuance.

**1. Add to `docker-compose.yml`**

```yaml
certbot:
  image: certbot/certbot
  volumes:
    - certbot_certs:/etc/letsencrypt
    - certbot_www:/var/www/certbot

# Add to nginx service volumes:
#   - certbot_certs:/etc/letsencrypt:ro
#   - certbot_www:/var/www/certbot:ro

volumes:
  certbot_certs:
  certbot_www:
```

**2. First-time issuance**

Nginx cannot start with the SSL config until certificates exist. Bootstrap with a temporary HTTP config.

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

Point the nginx volume to this file and start: `docker compose up -d nginx`

Issue the certificate:
```bash
docker compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email your@email.com --agree-tos --no-eff-email \
  -d {{DOMAIN}}
```

Restore `nginx.ssl.conf` in the volumes and restart: `docker compose restart nginx`

**3. Renewal**

```bash
# crontab -e
0 3 1 * * docker compose -f /path/to/docker-compose.yml run --rm certbot renew \
  && docker compose -f /path/to/docker-compose.yml restart nginx
```

---

## Phase 3 — VM Deployment

**Requirements:** Any Linux VM (Ubuntu 22.04 LTS recommended) with a public IP and SSH access. Minimum 1 vCPU / 1 GB RAM. Common providers: AWS EC2, GCP Compute Engine, DigitalOcean, Azure, Oracle Cloud.

### 1. Install Docker

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker
```

### 2. Open firewall ports

Two levels must be configured.

**Cloud provider — inbound rules (TCP 80 and 443 from `0.0.0.0/0`):**

| Provider | Location |
|---|---|
| AWS | EC2 → Security Groups → Inbound Rules |
| GCP | VPC Network → Firewall → Create Firewall Rule |
| DigitalOcean | Networking → Firewalls → Inbound Rules |
| Azure | Networking → Add Inbound Port Rule |
| Oracle Cloud | VCN → Security List → Add Ingress Rules |

**OS-level (Ubuntu):**
```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
```

### 3. Deploy

**Option A — Transfer files directly** (simple projects)

```bash
# Local machine
scp -r /path/to/project user@<vm-ip>:~/app

# VM
cd ~/app && docker compose up -d
```

**Option B — Docker Hub + transfer config only** (recommended for large images)

Building on a low-resource VM is slow. Build locally, push to Docker Hub, pull on the VM.

```bash
# Local — build and push
docker login
docker tag <backend-image> <hub-username>/<app>-backend:latest
docker tag <frontend-image> <hub-username>/<app>-frontend:latest
docker push <hub-username>/<app>-backend:latest
docker push <hub-username>/<app>-frontend:latest
```

Update `docker-compose.yml` — replace `build:` blocks with `image:` references:
```yaml
backend:
  image: <hub-username>/<app>-backend:latest

frontend:
  image: <hub-username>/<app>-frontend:latest
```

Transfer only the config files to the VM:
```
nginx/              (including certs/)
docker-compose.yml
backend/.env
```

```bash
# VM
docker compose pull && docker compose up -d
```

**Updating after code changes:**
```bash
# Local
docker compose build
docker push <hub-username>/<app>-backend:latest
docker push <hub-username>/<app>-frontend:latest

# VM
docker compose pull && docker compose up -d --force-recreate
```

---

## Phase 4 — Connect Domain and SSL

**Prerequisites:**
- `nginx/certs/` contains `fullchain.crt` and `your_domain.key`
- DNS A record for `{{DOMAIN}}` points to the VM's public IP
- Ports 80 and 443 open on the VM

**Verify DNS:**
```bash
nslookup {{DOMAIN}}   # must return the VM's public IP
```

**Update `nginx.ssl.conf`** — replace `{{DOMAIN}}` and confirm the cert paths match your filenames:
```nginx
ssl_certificate     /etc/nginx/certs/fullchain.crt;
ssl_certificate_key /etc/nginx/certs/your_domain.key;
```

**Update CORS** — replace localhost entries with the production domain:
```python
CORS_ALLOWED_ORIGINS = [
    "https://{{DOMAIN}}",
]
```

**Rebuild and restart:**
```bash
docker compose down
docker compose build backend
docker compose up -d
```

---

## Verification Checklist

### After Phase 1

```bash
docker compose ps                              # only nginx has published ports
curl http://localhost{{API_PREFIX}}/healthz    # expect JSON
curl http://localhost:{{BACKEND_PORT}}/        # must refuse connection
curl http://localhost:{{FRONTEND_PORT}}/       # must refuse connection
docker compose down && docker compose up -d    # stack restarts cleanly
```

Open `http://localhost` and exercise the application end-to-end.

### After Phase 4

```bash
curl -v http://{{DOMAIN}}/                             # expect 301 → https
curl https://{{DOMAIN}}{{API_PREFIX}}/healthz          # expect JSON, no -k flag
curl https://{{DOMAIN}}:{{BACKEND_PORT}}/              # must refuse connection
```

Open `https://{{DOMAIN}}` in a browser — green padlock, no warnings.

---

## Debugging

**Backend shows `unhealthy`**

```bash
docker compose logs backend
```
If the app is running but the healthcheck fails, the URL in `{{BACKEND_HEALTHCHECK_URL}}` does not match an existing endpoint. If `curl: command not found` appears, the healthcheck is invoking curl inside a slim image — use the Python-based healthcheck already defined in `docker-compose.yml`.

---

**502 Bad Gateway**

Nginx is running but cannot reach an upstream container.
```bash
docker compose ps
docker compose logs backend
docker compose logs frontend
```
Verify the port numbers in `nginx.ssl.conf` match what the services actually bind to.

---

**CORS error in browser**

The browser's `Origin` is not in the backend's `CORS_ALLOWED_ORIGINS`. Apply the change from [Required Application Changes](#required-application-changes) and restart the backend.

---

**`nginx: [emerg]` — SSL error**

```bash
docker compose logs nginx
```
Common causes:
- `fullchain.crt` or `your_domain.key` not present in `nginx/certs/` on the server
- Private key does not match the certificate — the `.key` must be from the same run that produced the `.csr`
- `fullchain.crt` missing the intermediate chain — re-combine `your_domain.crt` + `your_domain.ca-bundle`

---

**Domain times out (DNS resolves correctly)**

The VM firewall is blocking inbound traffic. Verify both the cloud provider security group and the OS-level iptables rules (see [Phase 3](#phase-3--vm-deployment)).

---

## Extensions

Drop-in service blocks for `docker-compose.yml`.

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

Add to `nginx.ssl.conf` before the catch-all `/` location:
```nginx
location /airflow/ {
  proxy_pass http://airflow-webserver:8080/airflow/;
  proxy_set_header Host $host;
  proxy_read_timeout 120s;
}
```

Generate the Fernet key once and store it in `.env`:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

---

### LDAP (containerised — development only)

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

**Security**
- [ ] `backend/.env` is not committed and not present in any image layer
- [ ] `nginx/certs/` is in `.gitignore`
- [ ] Backend and frontend use `expose`, not `ports`
- [ ] HTTPS enabled with a valid, trusted certificate
- [ ] HTTP redirects to HTTPS
- [ ] `CORS_ALLOWED_ORIGINS` contains only the production domain
- [ ] Backend reload / debug mode disabled
- [ ] No placeholder passwords remain in any service

**Reliability**
- [ ] All services have a `healthcheck`
- [ ] `depends_on` uses `condition: service_healthy`
- [ ] `proxy_read_timeout` covers the slowest expected operation
- [ ] `client_max_body_size` covers the largest expected upload

**Maintainability**
- [ ] Certificate renewal is automated or calendared
- [ ] `docker compose down && docker compose up -d` works cleanly from any state
- [ ] A new team member can onboard with only: clone repo → populate `.env` → `docker compose up`

---

## Quick Reference

| Task | Command |
|---|---|
| Build all images | `docker compose build` |
| Start stack | `docker compose up -d` |
| Stop stack | `docker compose down` |
| View containers | `docker compose ps` |
| Stream all logs | `docker compose logs -f` |
| Logs for one service | `docker compose logs <service>` |
| Restart one service | `docker compose restart <service>` |
| Rebuild + restart one service | `docker compose build <service> && docker compose up -d --force-recreate <service>` |
| Shell into container | `docker compose exec <service> sh` |
| Validate Nginx config | `docker compose exec nginx nginx -t` |
| Full reset | `docker compose down --rmi all` |
| Generate Fernet key | `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"` |
