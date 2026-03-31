# DocChecker — Nginx + Containerization Guide

This guide walks through two phases:

1. **Phase 1 — Nginx Local Test**: Spin up only an Nginx container that proxies to your locally running frontend and backend, to validate the routing config before touching any Dockerfiles.
2. **Phase 2 — Full Containerization**: Write Dockerfiles for the backend and frontend, wire everything together with Docker Compose, and test the complete stack.

The methodology here is designed to be copied directly to the other team's application. The only things that change between projects are service names, ports, and secret values.

---

## Architecture

```
Browser
  └─► Nginx :80
        ├─ /api/*   ──────────► FastAPI backend  :8081
        └─ /* (all else) ─────► Next.js frontend :3000
```

Nginx is the **only** publicly exposed port. The frontend and backend containers are only reachable from inside the Docker network.

---

## Prerequisites

- Docker Desktop installed and running
- PowerShell (all commands below are for PowerShell on Windows)
- Backend and frontend can both run locally (you have confirmed this already)

---

---

# Phase 1 — Test Nginx Locally (No Dockerfiles Yet)

The goal is to prove the Nginx routing config is correct using your native dev services.  
On Windows/Docker Desktop, containers reach your host machine via `host.docker.internal`.

---

## Step 1 — Create the Nginx directory and configs

Create a folder `nginx/` at the project root.

Inside it, create **two** config files:

### `nginx/nginx.local-test.conf`

This is used only for Phase 1 testing. It points to your host machine where the dev servers run.

```nginx
events {
  worker_connections 1024;
}

http {
  client_max_body_size 50M;

  server {
    listen 80;

    # All /api/* requests go to the FastAPI backend running on your host
    location /api/ {
      proxy_pass         http://host.docker.internal:8081;
      proxy_http_version 1.1;
      proxy_set_header   Host              $host;
      proxy_set_header   X-Real-IP         $remote_addr;
      proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto $scheme;
      proxy_read_timeout 300s;
      proxy_send_timeout 300s;
    }

    # Everything else goes to the Next.js frontend running on your host
    location / {
      proxy_pass         http://host.docker.internal:3000;
      proxy_http_version 1.1;
      proxy_set_header   Upgrade    $http_upgrade;
      proxy_set_header   Connection "upgrade";
      proxy_set_header   Host       $host;
    }
  }
}
```

### `nginx/nginx.conf`

This is the **production** config used in Phase 2. It points to Docker Compose service names.

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

  server {
    listen 80;

    location /api/ {
      proxy_pass         http://backend;
      proxy_http_version 1.1;
      proxy_set_header   Host              $host;
      proxy_set_header   X-Real-IP         $remote_addr;
      proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto $scheme;
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

## Step 2 — Start your native dev servers

Open two terminals in your project root.

**Terminal 1 — Backend:**

```powershell
cd Backend
# activate your venv if you have one, then:
python -m app.server
```

Confirm it is running:

```powershell
curl http://localhost:8081/api/healthz
```

Expected response: a JSON object (e.g. `{"status":"ok"}` or similar).

**Terminal 2 — Frontend:**

```powershell
cd Frontend
npm run dev
```

Confirm it is running: open `http://localhost:3000` in a browser — you should see the app.

---

## Step 3 — Run the Nginx container pointing to your host

Open a **third** terminal from the project root and run:

```powershell
docker run --rm -p 80:80 `
  -v "${PWD}/nginx/nginx.local-test.conf:/etc/nginx/nginx.conf:ro" `
  nginx:alpine
```

This starts an Nginx container, mounts your local test config into it, and exposes port 80. Leave this terminal open.

---

## Step 4 — Test Nginx routing

Run these in a **fourth** terminal (or use a browser):

```powershell
# Test backend route through Nginx
curl http://localhost/api/healthz

# Test frontend route through Nginx
curl http://localhost/
```

Also open `http://localhost` in a browser. The full app should be usable — upload a document and run the pipeline — all traffic is now going through Nginx on port 80.

**What to verify:**

| Check | Expected |
|---|---|
| `curl http://localhost/api/healthz` | JSON response from FastAPI |
| `http://localhost/` in browser | DocChecker UI loads |
| File upload and pipeline run | Works end-to-end (Nginx has 300s timeout and 50M body size) |
| `http://localhost:8081` in browser | Still works directly (dev server unchanged) |

If the UI loads but API calls fail, check the CORS note in the **Known Issues** section at the bottom.

**Stop the Nginx container** with `Ctrl+C` in terminal 3 once you are satisfied.

---

---

# Phase 2 — Full Containerization

Now we write Dockerfiles for the backend and frontend, resolve the two code-level issues, and wire everything together with Docker Compose.

---

## Step 5 — Fix 1: Update `next.config.ts` for container compatibility

**The problem:** The Next.js rewrite destination is hardcoded to `localhost:8081`. Inside a Docker container the Next.js server has no backend on localhost — the backend is on a separate container. We make this configurable via an environment variable so that local dev still works unchanged.

Edit `Frontend/next.config.ts` to:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8081";
    return [
      {
        source: "/api/test/full-pipeline/:path*",
        destination: `${backendUrl}/api/test/full-pipeline/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

`BACKEND_URL` is a **server-side** env var (no `NEXT_PUBLIC_` prefix). It is only read by the Next.js Node process for SSR rewrites. The browser's fetch calls to `/api/...` go directly to Nginx, which routes them to the backend — the rewrite is not involved for browser-side fetches.

> **Local dev is unchanged.** When you run `npm run dev` without setting `BACKEND_URL`, it defaults to `http://localhost:8081` as before.

---

## Step 6 — Fix 2: Update CORS origins in the backend

**The problem:** `Backend/app/config.py` has `CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]`. In the containerized setup the browser talks to `http://localhost` (Nginx on port 80), so the browser's `Origin` header is `http://localhost`, not `http://localhost:3000`. The backend will reject those requests.

Edit `Backend/app/config.py`, change the `CORS_ALLOWED_ORIGINS` list to:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",   # local dev (Next.js dev server)
    "http://localhost",        # containerized (Nginx on port 80)
    "http://localhost:80",     # explicit port form (some browsers include it)
]
```

---

## Step 7 — Fix 3: Disable uvicorn `reload` for Docker

**The problem:** `Backend/config.ini` has `reload = true` under `[server]`. Uvicorn's reload mode watches the filesystem for code changes. Inside a Docker container there are no code changes, and reload mode can cause unexpected restarts.

Edit `Backend/config.ini`, change the `[server]` section to:

```ini
[main]
api_base = /api
port = 8081
IS_DEPLOYED=false


[server]
host = 0.0.0.0
port = 8081
reload = false
```

---

## Step 8 — Create `Backend/.dockerignore`

Create `Backend/.dockerignore`:

```
__pycache__
*.pyc
*.pyo
.env
.env.*
.venv
venv
*.egg-info
.pytest_cache
```

---

## Step 9 — Create `Backend/Dockerfile`

Create `Backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

EXPOSE 8081

# WORKDIR is /app so config.ini (at /app/config.ini) is found by configparser
CMD ["python", "-m", "app.server"]
```

> **Note on `requirements.txt`:** The file currently lists both `python-dotenv` and `dotenv`. The package `dotenv` does not exist on PyPI — `python-dotenv` is the correct one. Remove the `dotenv` line from `requirements.txt` before building, otherwise `pip install` will fail.

---

## Step 10 — Create `Frontend/.dockerignore`

Create `Frontend/.dockerignore`:

```
node_modules
.next
.env
.env.*
```

---

## Step 11 — Create `Frontend/Dockerfile`

The frontend uses a multi-stage build to keep the final image small.

Create `Frontend/Dockerfile`:

```dockerfile
# Stage 1: install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: build the Next.js app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Tell Next.js where the backend is for SSR rewrites at build time
ENV BACKEND_URL=http://backend:8081
RUN npm run build

# Stage 3: production runner (smallest possible image)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV BACKEND_URL=http://backend:8081

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
```

---

## Step 12 — Create `Backend/.env`

This file holds your Azure OpenAI credentials. It is already listed in `.gitignore` and will never be committed.

Create `Backend/.env`:

```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-key-here
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_DEPLOYMENT=your-deployment-name
BUILD_TAG=1.0.0
IS_DEPLOYED=true
```

Fill in your real values.

---

## Step 13 — Create `docker-compose.yml`

Create `docker-compose.yml` at the project root:

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
      test: ["CMD-SHELL", "curl -f http://localhost:8081/api/healthz || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 10s

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
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
```

**Why `expose` instead of `ports` for frontend and backend?**  
`expose` makes a port accessible only within the Docker network — not from your host machine. Only Nginx has `ports: - "80:80"`, which publishes it to your host. This enforces the "single entry point" requirement: everything must go through Nginx.

---

## Step 14 — Final file structure check

Before building, confirm your project looks like this:

```
DocChecker/
├── Backend/
│   ├── Dockerfile              ← new
│   ├── .dockerignore           ← new
│   ├── .env                    ← new (your secrets, not committed)
│   ├── config.ini              ← edited (reload = false)
│   ├── app/
│   │   └── config.py           ← edited (CORS_ALLOWED_ORIGINS)
│   └── requirements.txt        ← edited (remove bare `dotenv` line)
├── Frontend/
│   ├── Dockerfile              ← new
│   ├── .dockerignore           ← new
│   └── next.config.ts          ← edited (BACKEND_URL env var)
├── nginx/
│   ├── nginx.conf              ← new (production, uses service names)
│   └── nginx.local-test.conf   ← new (Phase 1 testing, uses host.docker.internal)
└── docker-compose.yml          ← new
```

---

## Step 15 — Build all images

From the project root:

```powershell
docker compose build
```

Watch the output for errors. Common things to fix:

- `pip install` fails → check `requirements.txt` for invalid package names (`dotenv` → remove it)
- `npm ci` fails → make sure `package-lock.json` exists (run `npm install` locally first if it doesn't)
- `npm run build` fails → a TypeScript or import error in the frontend; fix it locally first with `npm run build`, then rebuild

---

## Step 16 — Start the full stack

```powershell
docker compose up
```

Docker Compose starts services in dependency order:
1. `backend` starts first
2. Compose waits for the backend healthcheck to pass (`/api/healthz` returns 200)
3. `frontend` starts
4. `nginx` starts last

You will see interleaved logs from all three services. Watch for:
- `backend` — `Uvicorn running on http://0.0.0.0:8081`
- `frontend` — `Ready on http://0.0.0.0:3000` (or similar)
- `nginx` — no output at startup means it loaded successfully

---

## Step 17 — Test the full containerized stack

Open a new terminal and run these checks one by one:

```powershell
# 1. Backend health via Nginx
curl http://localhost/api/healthz

# 2. Backend directly (should FAIL — port not published)
curl http://localhost:8081/api/healthz

# 3. Frontend via Nginx
curl -s http://localhost/ | Select-String "DocChecker"
```

Check 2 should fail (connection refused) — that confirms the isolation is working correctly.

**Browser test:**

1. Open `http://localhost`
2. The DocChecker UI should load
3. Upload an RFP and a proposal document
4. Start the compliance check pipeline
5. The status polling should work (it calls `/api/test/full-pipeline/status/{session_id}` through Nginx)

---

## Step 18 — Useful commands during testing

```powershell
# View logs for a specific service
docker compose logs backend
docker compose logs frontend
docker compose logs nginx

# Follow logs in real time
docker compose logs -f

# Restart a single service (e.g. after a config change)
docker compose restart backend

# Stop everything
docker compose down

# Stop everything and remove volumes/images (full reset)
docker compose down --rmi all
```

---

---

# Applying This to the Other Team's Application

When you hand this methodology over, here is what changes and what stays the same.

## What stays identical

- `nginx/nginx.conf` structure (upstream blocks, location blocks, timeout/body directives)
- `docker-compose.yml` structure (`expose` vs `ports`, `depends_on`, `healthcheck`)
- `Frontend/Dockerfile` (multi-stage Node build)
- `Backend/Dockerfile` (python:3.11-slim, WORKDIR, CMD)
- The `BACKEND_URL` env var pattern in `next.config.ts`

## What changes per project

| Item | Change |
|---|---|
| `nginx.conf` upstream names | Match the other project's Compose service names |
| `nginx.conf` location rules | Add/remove routes to match the other project's API prefix |
| `docker-compose.yml` service names | Match the other project's naming |
| `docker-compose.yml` context paths | Match the other project's folder structure |
| `CORS_ALLOWED_ORIGINS` | Same pattern, same values (`http://localhost`, `http://localhost:3000`) |
| `Backend/.env` | The other project's credentials |
| Frontend `BACKEND_URL` default | Same pattern, change the port if the other backend uses a different one |

## Handoff checklist

- [ ] Copy `nginx/nginx.conf` and adjust upstream names and `location` routes to match the API prefix of the other backend
- [ ] Copy both Dockerfiles — change base image versions only if the other project requires it
- [ ] Copy `docker-compose.yml` — update service names and `context` paths
- [ ] Add `BACKEND_URL` env var to the other frontend's Next.js config (or equivalent config for non-Next apps)
- [ ] Add `http://localhost` and `http://localhost:80` to the other backend's CORS allowed origins
- [ ] Ensure `reload = false` (or equivalent) for the other backend in production/Docker mode
- [ ] Confirm the other backend's entrypoint resolves its config file relative to `WORKDIR`
- [ ] Create the other project's `.env` with its credentials (never commit this)

---

# Known Issues and Fixes

## CORS errors in the browser during Phase 1 test

**Symptom:** The app loads at `http://localhost` but API calls fail with a CORS error in the browser console.

**Cause:** In Phase 1, the backend is still running natively with `CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]`. The browser's page is now loaded from `http://localhost` (port 80 via Nginx), so the Origin header is `http://localhost`, which the backend rejects.

**Fix:** This is the same fix as Step 6. Do Step 6 before running Phase 1 if you want to test with the full browser flow, or skip browser testing in Phase 1 and only use `curl` (curl does not send an Origin header).

## `config.ini` not found in the backend container

**Symptom:** Backend container crashes immediately with a `KeyError` or `configparser` section error.

**Cause:** `Backend/app/config.py` calls `config.read("config.ini")` using a relative path. This resolves relative to the process working directory. In the Dockerfile, `WORKDIR` is set to `/app` and `config.ini` is copied there by `COPY . .`, so it should be at `/app/config.ini`. If you change `WORKDIR` or the copy path, this breaks.

**Fix:** Keep `WORKDIR /app` in the backend Dockerfile and do not change the relative path in `config.py`.

## `npm ci` fails during frontend build

**Symptom:** Docker build fails at the `npm ci` step with a lockfile error.

**Cause:** `package-lock.json` is missing or out of sync with `package.json`.

**Fix:** Run `npm install` locally in `Frontend/`, commit the resulting `package-lock.json`, then rebuild.

## Pipeline timeout through Nginx

**Symptom:** Long-running compliance checks (LLM calls) time out and return a 504 Gateway Timeout.

**Cause:** The default Nginx proxy timeout is 60 seconds.

**Fix:** Already handled — both `nginx.conf` files have `proxy_read_timeout 300s` and `proxy_send_timeout 300s`. If your LLM jobs take longer than 5 minutes, increase these values.

## Large file uploads rejected

**Symptom:** Uploading large PDFs returns a 413 Request Entity Too Large.

**Cause:** Nginx blocks request bodies over its limit.

**Fix:** Already handled — both configs have `client_max_body_size 50M`. Increase to `100M` or higher if needed.
