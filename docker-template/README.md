# Docker Containerisation Template
### Consulting Agency — Internal Resource

This template is the go-to reference for containerising any web application with a backend, a frontend, and an Nginx reverse proxy. It is framework-agnostic and has been designed so that a developer unfamiliar with Docker can follow it from zero to a working containerised stack.

---

## What This Template Produces

```
Browser
  └─► Nginx :80  (the ONLY publicly exposed port)
        ├─ /api/*        ──────► Backend container  (Python/FastAPI or any language)
        └─ /* (all else) ──────► Frontend container (Next.js, Vite, React, etc.)
```

The backend and frontend containers are completely isolated from the outside world. Nothing can reach them directly. All traffic goes through Nginx. This is the standard architecture used by professional engineering teams and mirrors what cloud load balancers do in production.

---

## Template File Structure

```
docker-template/
├── README.md                        ← This file — the complete A-to-Z guide
├── PLACEHOLDERS.md                  ← Quick reference for all {{PLACEHOLDER}} values
│
├── backend/
│   ├── Dockerfile                   ← Python backend container definition
│   └── .dockerignore                ← Files excluded from the backend image
│
├── frontend/
│   ├── Dockerfile                   ← Node.js frontend container definition
│   └── .dockerignore                ← Files excluded from the frontend image
│
├── nginx/
│   ├── nginx.conf                   ← Production config (HTTP, no SSL)
│   ├── nginx.ssl.conf               ← Production config (HTTPS with domain)
│   ├── nginx.local-test.conf        ← Phase 1 test config (points to host machine)
│   └── certs/                       ← SSL certificate files go here (never committed)
│
├── docker-compose.yml               ← Wires all services together
└── backend/.env.example             ← Template for secrets file (committed)
    backend/.env                     ← Real secrets (NEVER committed)
```

---

## How to Use This Template

1. Copy the entire `docker-template/` folder into your project
2. Move `backend/Dockerfile` and `backend/.dockerignore` into your actual backend folder
3. Move `frontend/Dockerfile` and `frontend/.dockerignore` into your actual frontend folder
4. Keep `nginx/` and `docker-compose.yml` at the project root
5. Open `PLACEHOLDERS.md` and replace every `{{PLACEHOLDER}}` with real values
6. Make the two required code changes (sections below)
7. Follow the phase-by-phase setup

---

---

# Part 1 — Prerequisites

Before starting, confirm all of the following:

| Requirement | How to Verify |
|---|---|
| Docker Desktop installed and running | `docker --version` |
| Docker Compose available | `docker compose version` |
| Backend runs locally without Docker | Start it manually, confirm the port responds |
| Frontend runs locally without Docker | Start it manually, open in browser |
| `package-lock.json` exists in frontend | Check the frontend folder — if missing, run `npm install` locally first |
| Backend has a `requirements.txt` | Check the backend folder — if using Poetry only, see the Poetry note below |

### Poetry Note
If the backend uses Poetry instead of `requirements.txt`, replace this line in `backend/Dockerfile`:
```dockerfile
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
```
With:
```dockerfile
COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-root --no-dev
```

---

---

# Part 2 — Fill In the Placeholders

Open `PLACEHOLDERS.md` for the complete list. At minimum, replace all of these before proceeding:

| Placeholder | Where to find the value |
|---|---|
| `{{PYTHON_VERSION}}` | Check `pyproject.toml` (`requires-python`) or ask the backend developer |
| `{{NODE_VERSION}}` | Check `.nvmrc`, `.node-version`, or `engines` field in `package.json` — default to `20` if not specified |
| `{{BACKEND_PORT}}` | Check the backend config file (e.g. `config.ini`, `settings.py`, `.env`) or the start command |
| `{{FRONTEND_PORT}}` | Usually `3000` for Next.js, `5173` for Vite — check `package.json` scripts |
| `{{API_PREFIX}}` | The URL path prefix for all API routes — check the backend router setup (e.g. `/api`) |
| `{{BACKEND_START_COMMAND}}` | The command used to start the backend (e.g. `python -m app.server`, `uvicorn main:app`) |
| `{{BACKEND_URL_DEFAULT}}` | `http://backend:{{BACKEND_PORT}}` — use the Docker service name, not localhost |
| `{{BACKEND_HEALTHCHECK_PATH}}` | `http://localhost:{{BACKEND_PORT}}{{API_PREFIX}}/healthz` — confirm this endpoint exists |

---

---

# Part 3 — Required Code Changes

Two changes must be made to the application code before containerising. These are always required regardless of the framework.

## Change 1 — Frontend API URL (Next.js)

**The problem:** The frontend's development proxy (e.g. Next.js rewrites) is hardcoded to `localhost:PORT`. Inside a Docker container there is no backend on localhost — the backend is on a separate container.

**The fix:** Make the backend URL configurable via an environment variable.

**In Next.js (`next.config.ts` or `next.config.js`):**

Before:
```typescript
destination: 'http://localhost:8081/api/:path*'
```

After:
```typescript
const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8081';
// ...
destination: `${backendUrl}/api/:path*`
```

`BACKEND_URL` is set to `http://backend:8081` in `docker-compose.yml` so the Next.js server can reach the backend by its Docker service name.

**Local dev is unchanged** — when running `npm run dev` without setting `BACKEND_URL`, it defaults to `localhost` as before.

**For Vite / CRA:** If the frontend makes browser-side fetch calls to `/api/...` (relative URLs), no change is needed. The browser sends those to Nginx, which routes them to the backend. The rewrite is only relevant for server-side calls.

---

## Change 2 — Backend CORS Origins

**The problem:** The backend's CORS allowed origins list contains only `http://localhost:3000`. When the app runs behind Nginx on port 80, the browser's Origin header becomes `http://localhost` — which the backend rejects.

**The fix:** Add `http://localhost` (and the production domain when applicable) to the allowed origins list.

**Example (FastAPI / Python):**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",       # local dev (direct frontend server)
    "http://localhost",            # containerised (Nginx on port 80)
    "http://localhost:80",         # explicit port form
    # "https://app.hrdf.com",      # add production domain when deploying
]
```

The exact location of this list varies by framework:
- FastAPI: `CORSMiddleware` configuration in `main.py`
- Django: `CORS_ALLOWED_ORIGINS` in `settings.py`
- Express.js: `cors()` middleware options
- Spring Boot: `@CrossOrigin` annotation or `WebMvcConfigurer`

---

## Change 3 — Disable Hot Reload in the Backend Config

**The problem:** Backend frameworks often have a "reload on file change" development mode (e.g. `reload=true` in uvicorn). Inside a Docker container there are no file changes, and reload mode can cause instability.

**The fix:** Set reload to `false` in the backend's config file before containerising.

---

---

# Part 4 — Phase 1: Test Nginx Locally

**Goal:** Validate the Nginx routing config is correct before spending time building Docker images. If there is a typo in the config, you catch it in 30 seconds instead of after a 10-minute build.

**How it works:** Your backend and frontend keep running natively. You spin up only an Nginx container that proxies to them using `host.docker.internal` (Docker Desktop's special hostname for the host machine).

## Step 1 — Start your native dev servers

Open two terminals:

```bash
# Terminal 1 — backend (adjust command for your framework)
cd your-backend-folder
python -m app.server

# Terminal 2 — frontend
cd your-frontend-folder
npm run dev
```

Confirm both are running:
```bash
curl http://localhost:{{BACKEND_PORT}}{{API_PREFIX}}/healthz   # should return JSON
# Open http://localhost:{{FRONTEND_PORT}} in browser — should show the app
```

## Step 2 — Run just Nginx as a container

From the project root (where `nginx/` folder is):

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

## Step 3 — Test routing

In a new terminal:

```bash
# Backend route through Nginx
curl http://localhost{{API_PREFIX}}/healthz
# Expected: JSON response from your backend

# Frontend route through Nginx
curl http://localhost/
# Expected: HTML from your frontend
```

Also open `http://localhost` in a browser. The full app should be usable through Nginx.

## Step 4 — Stop Nginx

Press `Ctrl+C` in the terminal running the Nginx container. Phase 1 is complete.

**If this worked: proceed to Phase 2.**

**If the browser showed the app but API calls failed:** This is a CORS error (see Debugging section). Apply Change 2 from Part 3 and restart the backend.

**If Nginx returned 502 Bad Gateway:** Nginx reached the upstream service but got an error back. The backend or frontend is not running, or is on a different port than the config specifies. Verify the ports in `nginx.local-test.conf` match what your dev servers are running on.

**If Nginx returned 404 for API routes:** The `{{API_PREFIX}}` in the config does not match the prefix the backend uses. Check the backend routing setup.

---

---

# Part 5 — Phase 2: Full Containerisation

**Goal:** Build Docker images for the backend and frontend, wire everything together with Docker Compose, and run the full isolated stack.

## Step 1 — Create the `.env` secrets file

Copy the example file and fill in real values:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in every variable. The application will not start without valid credentials.

## Step 2 — Verify the folder structure

Confirm the following files are in place (adjust paths to match your project):

```
your-project/
├── backend/
│   ├── Dockerfile          ← from template
│   ├── .dockerignore       ← from template
│   ├── .env                ← your secrets (not committed)
│   ├── .env.example        ← placeholder template (committed)
│   └── ... (your backend code)
├── frontend/
│   ├── Dockerfile          ← from template
│   ├── .dockerignore       ← from template
│   └── ... (your frontend code)
├── nginx/
│   ├── nginx.conf          ← from template (placeholders filled)
│   └── nginx.local-test.conf
└── docker-compose.yml      ← from template (placeholders filled)
```

## Step 3 — Build all images

```bash
docker compose build
```

Watch the output carefully. See the Debugging section for common build errors.

**If the build succeeds with no errors: proceed to Step 4.**

## Step 4 — Start the full stack

```bash
docker compose up
```

Watch the logs. The expected startup order is:
1. `backend` starts
2. `backend` healthcheck passes (takes 15–30 seconds on first start)
3. `frontend` starts (depends on backend being healthy)
4. `nginx` starts last

You can also start in detached mode (background):
```bash
docker compose up -d
```

## Step 5 — Verify the stack

```bash
# See all running containers — only nginx should show a published port
docker compose ps

# Backend API through Nginx
curl http://localhost{{API_PREFIX}}/healthz

# Frontend through Nginx
curl http://localhost/

# Confirm backend is NOT directly accessible (should refuse connection)
curl http://localhost:{{BACKEND_PORT}}/

# Confirm frontend is NOT directly accessible (should refuse connection)
curl http://localhost:{{FRONTEND_PORT}}/
```

Open `http://localhost` in a browser. Use the application end-to-end.

## Step 6 — Useful day-to-day commands

```bash
# View logs for a specific service
docker compose logs backend
docker compose logs frontend
docker compose logs nginx

# Follow logs in real time
docker compose logs -f

# Restart a single service after a config change
docker compose restart backend

# Stop the stack
docker compose down

# Full reset (removes containers, networks, and images)
docker compose down --rmi all
```

---

---

# Part 6 — Phase 3: SSL & Domain (Production)

Skip this section for local development. Use it when deploying to a real server with a public domain.

## Option A — Self-Signed Certificate (Local Domain Testing)

Use this to test HTTPS behaviour locally with a fake domain before deploying to a real server.

### Step 1 — Add a fake domain to your hosts file

**Windows** (open Notepad as Administrator):
```
C:\Windows\System32\drivers\etc\hosts
```
Add: `127.0.0.1   myapp.local`

**Mac/Linux:**
```bash
sudo echo "127.0.0.1   myapp.local" >> /etc/hosts
```

Verify: `ping myapp.local` should reply from `127.0.0.1`

### Step 2 — Generate the self-signed certificate

From the project root:

```powershell
# Windows PowerShell
docker run --rm -v "${PWD}/nginx/certs:/certs" alpine/openssl req -x509 `
  -nodes -days 365 -newkey rsa:2048 `
  -keyout /certs/selfsigned.key `
  -out /certs/selfsigned.crt `
  -subj "/CN=myapp.local/O=YourOrg/C=US" `
  -addext "subjectAltName=DNS:myapp.local,IP:127.0.0.1"
```

```bash
# Mac/Linux
docker run --rm -v "$(pwd)/nginx/certs:/certs" alpine/openssl req -x509 \
  -nodes -days 365 -newkey rsa:2048 \
  -keyout /certs/selfsigned.key \
  -out /certs/selfsigned.crt \
  -subj "/CN=myapp.local/O=YourOrg/C=US" \
  -addext "subjectAltName=DNS:myapp.local,IP:127.0.0.1"
```

Add certs to `.gitignore`:
```
nginx/certs/
```

### Step 3 — Switch to the SSL nginx config

In `docker-compose.yml`, update the nginx service:
```yaml
nginx:
  volumes:
    - ./nginx/nginx.ssl.conf:/etc/nginx/nginx.conf:ro   # use SSL config
    - ./nginx/certs:/etc/nginx/certs:ro                  # mount certs
  ports:
    - "80:80"
    - "443:443"
```

In `nginx/nginx.ssl.conf`, replace `{{DOMAIN_NAME}}` with `myapp.local` and use the self-signed cert paths (see comments in that file).

### Step 4 — Update CORS

Add the new origin to the backend's CORS list:
```python
"https://myapp.local",
```

Restart: `docker compose down && docker compose up -d`

Open `https://myapp.local` — the browser will warn about the self-signed cert. Click **Advanced → Proceed**. The app should load over HTTPS.

---

## Option B — Let's Encrypt Certificate (Real Domain, Production)

Use this when deploying to a real VM with a public domain.

### Prerequisites
- The VM is publicly reachable on ports 80 and 443
- DNS A record for `{{DOMAIN_NAME}}` points to the VM's public IP
- Verify DNS: `nslookup {{DOMAIN_NAME}}` should return the VM's IP

### Step 1 — Add Certbot to `docker-compose.yml`

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

### Step 2 — First-time certificate issuance (two-stage)

**Stage A:** Start Nginx with a temporary HTTP-only config so Certbot can prove domain ownership:

Create `nginx/nginx.certbot-init.conf`:
```nginx
events { worker_connections 1024; }
http {
  server {
    listen 80;
    server_name {{DOMAIN_NAME}};
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 'Ready'; add_header Content-Type text/plain; }
  }
}
```

In `docker-compose.yml` temporarily point nginx to this init config and start:
```bash
docker compose up -d nginx
```

**Stage B:** Run Certbot:
```bash
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email {{SSL_EMAIL}} \
  --agree-tos \
  --no-eff-email \
  -d {{DOMAIN_NAME}}
```

If successful you will see:
```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/{{DOMAIN_NAME}}/fullchain.pem
```

**Stage C:** Switch `docker-compose.yml` back to `nginx.ssl.conf` and restart:
```bash
docker compose restart nginx
```

### Step 3 — Certificate renewal

Let's Encrypt certs expire after 90 days. Set up a monthly renewal cron job on the VM:

```bash
# Add to crontab (crontab -e)
0 3 1 * * docker compose -f /path/to/docker-compose.yml run --rm certbot renew && docker compose -f /path/to/docker-compose.yml restart nginx
```

---

---

# Part 7 — Verification Checklist

Run this checklist after completing Phase 2 (and after Phase 3 if applicable). Every item must pass before calling the deployment done.

## Phase 2 Checklist

```bash
# 1. All containers running, only nginx has a published port
docker compose ps

# 2. Backend responds through Nginx
curl http://localhost{{API_PREFIX}}/healthz
# Expected: JSON response

# 3. Frontend responds through Nginx
curl -s http://localhost/ | grep -i "your-app-name"
# Expected: HTML containing your app name

# 4. Backend port is NOT accessible from host (MUST fail)
curl http://localhost:{{BACKEND_PORT}}/
# Expected: connection refused

# 5. Frontend port is NOT accessible from host (MUST fail)
curl http://localhost:{{FRONTEND_PORT}}/
# Expected: connection refused

# 6. Full application works end-to-end in browser
# Open http://localhost, use all major features

# 7. Stack survives a full restart
docker compose down && docker compose up -d && docker compose ps
# Expected: all services come back up cleanly
```

## Phase 3 (SSL) Additional Checks

```bash
# 8. HTTP redirects to HTTPS
curl -v http://{{DOMAIN_NAME}}/
# Expected: 301 redirect to https://{{DOMAIN_NAME}}/

# 9. HTTPS API works
curl -k https://{{DOMAIN_NAME}}{{API_PREFIX}}/healthz
# Expected: JSON response (use -k for self-signed, drop -k for Let's Encrypt)

# 10. Certificate details visible in verbose output
curl -kv https://{{DOMAIN_NAME}}{{API_PREFIX}}/healthz
# Look for: "subject: CN={{DOMAIN_NAME}}" and "SSL connection using TLSv1.3"

# 11. HTTPS frontend loads in browser
# Open https://{{DOMAIN_NAME}} — app should load (self-signed shows warning, click through)
```

---

---

# Part 8 — Debugging Guide

## Build Errors

---

### `pip install` fails — package not found

**Error:**
```
ERROR: Could not find a version that satisfies the requirement dotenv
```

**Cause:** A package name in `requirements.txt` is wrong. `dotenv` does not exist on PyPI — the correct name is `python-dotenv`.

**Fix:** Open `requirements.txt` and correct the package name. Common mistakes:
- `dotenv` → `python-dotenv`
- `sklearn` → `scikit-learn`
- `PIL` → `Pillow`
- `cv2` → `opencv-python`

---

### `npm ci` fails — missing or mismatched lockfile

**Error:**
```
npm error The `npm ci` command can only install with an existing package-lock.json
```

**Cause:** `package-lock.json` is missing from the frontend folder.

**Fix:** Run `npm install` locally in the frontend folder. This generates `package-lock.json`. Commit it to git, then rebuild.

---

### Next.js build fails — TypeScript or import error

**Error:**
```
Type error: ...
```

**Cause:** A TypeScript error that only surfaces during `npm run build` (not `npm run dev`).

**Fix:** Run `npm run build` locally first. Fix all errors, then rebuild the Docker image.

---

### `config.ini` / config file not found at runtime

**Error:**
```
KeyError: 'main'
configparser.NoSectionError: No section: 'server'
```

**Cause:** The backend reads a config file using a relative path (e.g. `config.read("config.ini")`). This resolves relative to the process working directory. If the Dockerfile `WORKDIR` does not match where the config file is, it will not be found.

**Fix:** Ensure `WORKDIR /app` is set in `backend/Dockerfile` and the config file is at the root of the backend source directory (so it copies to `/app/config.ini`). Do not change `WORKDIR`.

---

## Runtime Errors

---

### Backend shows as `unhealthy` in `docker compose ps`

**Cause A:** `curl` is not installed in the Python slim image (the healthcheck uses curl).

**Fix:** The template already uses a Python-based healthcheck that does not require curl:
```yaml
test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('...')"]
```
If you see this error, confirm the healthcheck in `docker-compose.yml` uses this Python form and not a curl command.

**Cause B:** The healthcheck endpoint path is wrong or the backend is crashing on startup.

**Fix:**
```bash
docker compose logs backend
```
Look for Python tracebacks or "Address already in use" errors.

---

### 502 Bad Gateway from Nginx

**Cause:** Nginx is running but cannot reach the upstream service (backend or frontend). The upstream container is either not running or is listening on a different port than the nginx config specifies.

**Fix:**
```bash
# Check if the service is running
docker compose ps

# Check the service logs for startup errors
docker compose logs backend
docker compose logs frontend

# Verify the port in nginx.conf matches the port the service actually listens on
```

---

### 404 for all API routes

**Cause:** The `{{API_PREFIX}}` in `nginx.conf` does not match the actual API prefix the backend uses.

**Example:** Nginx routes `/api/` but the backend uses `/v1/` as its prefix — all requests to `/api/` hit the frontend, which returns 404.

**Fix:** Check the backend router setup and align the `location` block in `nginx.conf` with the actual prefix.

---

### CORS error in browser console

**Error in browser console:**
```
Access to fetch at 'http://localhost/api/...' from origin 'http://localhost' has been blocked by CORS policy
```

**Cause:** The backend's CORS allowed origins list does not include `http://localhost` (the Nginx origin).

**Fix:** Apply Change 2 from Part 3. Rebuild and restart the backend:
```bash
docker compose build backend
docker compose up -d --force-recreate backend
```

---

### `localhost:{{BACKEND_PORT}}` connection refused (expected)

This is **not an error** — this is correct behaviour. The backend uses `expose` (not `ports`) in `docker-compose.yml`, which means it is intentionally not accessible from outside the Docker network. Only Nginx is.

---

### Frontend makes API calls to `localhost:PORT` in production

**Symptom:** The browser's network tab shows API calls going to `http://localhost:8081/...` instead of `http://localhost/api/...`.

**Cause:** The frontend has a hardcoded backend URL in its source code rather than using relative paths or environment variables.

**Fix:** API calls in the frontend code should use relative paths (`/api/...`) so the browser sends them to whatever host the page was loaded from (Nginx). Search the frontend code for any hardcoded `localhost:PORT` strings and replace them with relative paths.

---

### Containers start but immediately restart (restart loop)

**Fix:**
```bash
docker compose logs backend --tail=50
```
Look for the first error. Common causes:
- Missing required environment variable (check `.env` file has all required keys)
- Port already in use on the host (another process is using the same port)
- Python import error (a package in `requirements.txt` is missing or wrong)

---

### `host.docker.internal` does not resolve (Linux)

**Cause:** `host.docker.internal` is a Docker Desktop feature. On Linux with plain Docker Engine it does not exist by default.

**Fix:** In `docker-compose.yml`, add this to the nginx service (Phase 1 local test only):
```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

---

---

# Part 9 — Extending the Template

These are drop-in additions for common stack components. Add each one to `docker-compose.yml` as an extra service.

## Adding a PostgreSQL Database

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

# Add to volumes: section
volumes:
  db_data:
```

Update backend `depends_on`:
```yaml
backend:
  depends_on:
    db:
      condition: service_healthy
```

Add to `backend/.env`:
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=mydb
DB_USER=myuser
DB_PASSWORD=mypassword
```

---

## Adding Microsoft SQL Server

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

**Important:** If the backend uses `pyodbc`, the `backend/Dockerfile` needs the ODBC driver installed at the OS level. Uncomment the ODBC block in the template Dockerfile.

---

## Adding Apache Airflow

Airflow has four components. Add all of these to `docker-compose.yml`:

```yaml
airflow-postgres:
  image: postgres:15
  environment:
    - POSTGRES_USER=airflow
    - POSTGRES_PASSWORD=airflow
    - POSTGRES_DB=airflow
  expose:
    - "5432"
  volumes:
    - airflow_postgres_data:/var/lib/postgresql/data
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
    - AIRFLOW__WEBSERVER__BASE_URL=http://localhost/airflow
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

# Add to volumes: section
volumes:
  airflow_postgres_data:
  airflow_logs:
```

Add to `nginx.conf` (before the catch-all `/` location):
```nginx
location /airflow/ {
  proxy_pass         http://airflow-webserver:8080/airflow/;
  proxy_set_header   Host $host;
  proxy_read_timeout 120s;
}
```

Generate the Fernet key once and store it safely:
```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Add to `backend/.env`:
```env
AIRFLOW_FERNET_KEY=<the generated value>
```

---

## Adding an LDAP Service (Containerised, for Dev)

Use this when no corporate LDAP server is available during development:

```yaml
ldap:
  image: osixia/openldap:1.5.0
  environment:
    - LDAP_ORGANISATION=Your Company
    - LDAP_DOMAIN=yourcompany.com
    - LDAP_ADMIN_PASSWORD=${LDAP_ADMIN_PASSWORD}
  expose:
    - "389"
    - "636"
  volumes:
    - ldap_data:/var/lib/ldap
    - ldap_config:/etc/ldap/slapd.d

# Add to volumes: section
volumes:
  ldap_data:
  ldap_config:
```

For an external corporate LDAP (more common), no container is needed. Just add the connection details to `backend/.env`:
```env
LDAP_HOST=ldap.yourcompany.com
LDAP_PORT=389
LDAP_BASE_DN=dc=yourcompany,dc=com
LDAP_BIND_DN=cn=svc-account,dc=yourcompany,dc=com
LDAP_BIND_PASSWORD=
```

---

## Adding a Second Frontend (e.g. Vite App)

```yaml
vite-app:
  build:
    context: ./vite-app
    dockerfile: Dockerfile
  ports:
    - "5173:80"           # published directly — its own entry point
  depends_on:
    - nginx
```

The Vite app's `nginx.conf` (inside the vite-app container) serves static files. It makes browser-side fetch calls to `http://localhost/api/...` which hits the main Nginx → backend.

Add `http://localhost:5173` to the backend CORS list.

---

---

# Part 10 — Production Deployment Checklist

Use this before going live on a real server.

## Security

- [ ] `.env` file is not committed to git and not present in the Docker image
- [ ] Backend and frontend use `expose` (not `ports`) — only Nginx is public
- [ ] HTTPS is enabled (Let's Encrypt certificate, not self-signed)
- [ ] HTTP redirects to HTTPS (port 80 redirect block in nginx config)
- [ ] CORS `allow_origins` contains only the production domain — remove `http://localhost` variants
- [ ] Backend reload/debug mode is disabled
- [ ] No default passwords in any service (database, Airflow, LDAP)

## Reliability

- [ ] All services have `healthcheck` defined
- [ ] `depends_on` uses `condition: service_healthy` so startup order is enforced
- [ ] Nginx `proxy_read_timeout` is set high enough for the slowest expected operation
- [ ] `client_max_body_size` is high enough for the largest expected file upload
- [ ] Certificate auto-renewal cron job is set up

## Observability

- [ ] `docker compose logs -f` produces meaningful output from all services
- [ ] Log files are not written inside the container (use stdout/stderr or mounted volumes)

## Repeatability

- [ ] `docker compose down && docker compose up -d` starts the stack cleanly every time
- [ ] A new developer can clone the repo, copy `.env.example` to `.env`, fill in credentials, and run `docker compose up` with no other setup steps

---

---

# Quick Reference Card

| Task | Command |
|---|---|
| Build all images | `docker compose build` |
| Start stack | `docker compose up -d` |
| Stop stack | `docker compose down` |
| View all containers | `docker compose ps` |
| View logs (all) | `docker compose logs -f` |
| View logs (one service) | `docker compose logs backend` |
| Restart one service | `docker compose restart backend` |
| Rebuild one service | `docker compose build backend && docker compose up -d --force-recreate backend` |
| Open shell in container | `docker compose exec backend sh` |
| Full reset | `docker compose down --rmi all` |
| Run Phase 1 test | `docker run --rm -p 80:80 -v "${PWD}/nginx/nginx.local-test.conf:/etc/nginx/nginx.conf:ro" nginx:alpine` |
| Generate Fernet key | `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"` |
| Generate self-signed cert | See Part 6, Option A, Step 2 |
| Issue Let's Encrypt cert | See Part 6, Option B, Step 2 |
