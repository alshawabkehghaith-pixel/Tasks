# Next Steps — Post DocChecker & Full Stack Containerisation Guide

This document covers everything after DocChecker Phase 2 is working:

1. Closing out DocChecker properly
2. Preparing for the other team's full stack (LDAP + Airflow)
3. What specifically changes when containerising that stack
4. The sequence to follow when their code is ready

---

---

# Part 1 — Close Out DocChecker

## Step 1 — Commit All Docker Artefacts

Everything created during Phase 2 must be committed to git so it is version-controlled and usable as a reference template.

Files to stage and commit:

```
Backend/Dockerfile
Backend/.dockerignore
Backend/config.ini              (reload = false change)
Backend/app/config.py           (CORS origins change)
Backend/requirements.txt        (removed invalid dotenv line)
Frontend/Dockerfile
Frontend/.dockerignore
Frontend/next.config.ts         (BACKEND_URL env var change)
nginx/nginx.conf
nginx/nginx.local-test.conf
docker-compose.yml
CONTAINERIZATION_GUIDE.md
NEXT_STEPS_AND_FULL_STACK_GUIDE.md
```

**Do not commit** `Backend/.env` — it holds real credentials and is already in `.gitignore`.

---

## Step 2 — Add a `Backend/.env.example` File

Since `.env` is never committed, add a `.env.example` so anyone cloning the repo knows exactly what variables are required. This is standard practice in professional repos.

Create `Backend/.env.example`:

```env
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com/
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_DEPLOYMENT=
BUILD_TAG=1.0.0
IS_DEPLOYED=true
```

Commit this file. Anyone onboarding copies it to `.env` and fills in their values.

---

## Step 3 — Verify the Guide Still Matches What Was Built

Read through `CONTAINERIZATION_GUIDE.md` and confirm no steps drifted during your actual Phase 2 work — different file paths, commands that needed tweaking, anything that was different in practice. Update the guide now while it is fresh. The other team will follow it verbatim.

---

---

# Part 2 — Prepare for the Other Team's Stack

Do this while the other team is still developing. The goal is to not be blocked the moment they hand you the code.

## Questions to Get Answered Now

Ask the team these questions before the handover. Each one unblocks a specific part of the containerisation work.

| Question | Why You Need It |
|---|---|
| What port does their backend run on? | Nginx upstream config + `EXPOSE` in backend Dockerfile |
| What is their API prefix? (e.g. `/api/`) | Nginx `location` block routing rule |
| Is LDAP an external corporate server or needs to be containerised for dev? | Determines whether you add an OpenLDAP container or just env vars |
| What LDAP library does the backend use? (`ldap3`, `python-ldap`, etc.) | Some have OS-level dependencies that affect the Dockerfile base image |
| Will Airflow use LocalExecutor or CeleryExecutor? | LocalExecutor = simpler (no Redis), CeleryExecutor = distributed workers |
| What Python version does the backend require? | `FROM python:X.XX-slim` in the Dockerfile |
| What Node version does the frontend require? | `FROM node:XX-alpine` in the Dockerfile |
| Is there a `package-lock.json` committed in the frontend? | Required for `npm ci` in the frontend build stage |
| What path should the Airflow UI be served on? (e.g. `/airflow/`) | Nginx `location` block + `AIRFLOW__WEBSERVER__BASE_URL` config |
| Are there any long-running background tasks beyond Airflow? | May need additional proxy timeout tuning in Nginx |

---

## Pre-Draft Their `nginx.conf` Based on What You Learn

Once you have the ports and path prefixes you can write their Nginx config before the code even arrives. Fill in their actual values:

```nginx
events {
  worker_connections 1024;
}

http {
  client_max_body_size 50M;

  upstream frontend {
    server frontend:<their_frontend_port>;
  }

  upstream backend {
    server backend:<their_backend_port>;
  }

  upstream airflow {
    server airflow-webserver:8080;
  }

  server {
    listen 80;

    # Airflow UI
    location /airflow/ {
      proxy_pass         http://airflow/airflow/;
      proxy_set_header   Host              $host;
      proxy_set_header   X-Real-IP         $remote_addr;
      proxy_read_timeout 120s;
    }

    # Backend API
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

    # Frontend (catch-all, must be last)
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

The final routing table through Nginx will be:

```
http://localhost/           → Next.js frontend
http://localhost/api/       → FastAPI backend
http://localhost/airflow/   → Airflow web UI
```

One port. Three services. All isolated.

---

## Generate the Airflow Fernet Key Now

Airflow encrypts credentials stored in its metadata database using a Fernet key. It must be generated once, kept consistent across all Airflow containers, and stored somewhere safe (password manager or secrets vault). If it is lost or changed, all stored Airflow connections and passwords become unreadable.

Generate it once:

```powershell
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Save the output. It goes into the `.env` file as `AIRFLOW_FERNET_KEY` when you build the stack.

---

---

# Part 3 — What Changes When Containerising the Full Stack

The core methodology from DocChecker is identical. The additions are LDAP and Airflow.

---

## Addition 1 — LDAP

### Scenario A: External Corporate LDAP (Active Directory)

The most common case. The LDAP server is not containerised — the backend container just needs to reach it over the network.

Add these to the backend `.env`:

```env
LDAP_HOST=ldap.yourcompany.com
LDAP_PORT=389
LDAP_BASE_DN=dc=yourcompany,dc=com
LDAP_BIND_DN=cn=svc-account,dc=yourcompany,dc=com
LDAP_BIND_PASSWORD=secret
```

The backend container inherits the host machine's network routing. If your machine can reach the LDAP server, the container can too. The only thing to verify is that the corporate firewall allows outbound LDAP connections from the Docker host.

> **LDAPS (port 636):** If the server uses SSL, the backend container may need to trust the corporate CA certificate. Mount the cert file into the container and set `LDAPTLS_CACERT=/path/to/cert.pem` in the environment.

### Scenario B: LDAP Containerised for Dev

If no corporate LDAP is available during dev, add an OpenLDAP container to the Compose stack:

```yaml
ldap:
  image: osixia/openldap:1.5.0
  environment:
    - LDAP_ORGANISATION=Your Company
    - LDAP_DOMAIN=yourcompany.com
    - LDAP_ADMIN_PASSWORD=adminpassword
  expose:
    - "389"
    - "636"
  volumes:
    - ldap_data:/var/lib/ldap
    - ldap_config:/etc/ldap/slapd.d
```

The backend's `LDAP_HOST` in `.env` becomes `ldap` (the Docker service name) instead of an external hostname.

---

## Addition 2 — Airflow

Airflow is the most significant change from DocChecker. It is not a single process — it is four components that all need to run and communicate.

### Airflow's Components

| Component | What It Does | Port |
|---|---|---|
| `airflow-webserver` | The browser UI | 8080 (internal only) |
| `airflow-scheduler` | Triggers DAG runs on schedule | none |
| `airflow-worker` | Executes tasks (CeleryExecutor only) | none |
| `postgres` | Airflow's metadata database | 5432 (internal only) |

For most dev setups, **LocalExecutor** (no separate worker container) is sufficient. CeleryExecutor is only needed if tasks need to run on separate machines.

### Airflow Services in `docker-compose.yml`

Add these services alongside your existing backend, frontend, and nginx services:

```yaml
postgres:
  image: postgres:15
  environment:
    - POSTGRES_USER=airflow
    - POSTGRES_PASSWORD=airflow
    - POSTGRES_DB=airflow
  expose:
    - "5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD", "pg_isready", "-U", "airflow"]
    interval: 10s
    retries: 5

airflow-init:
  image: apache/airflow:2.9.0
  depends_on:
    postgres:
      condition: service_healthy
  environment:
    - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://airflow:airflow@postgres/airflow
    - AIRFLOW__CORE__FERNET_KEY=${AIRFLOW_FERNET_KEY}
  command: db migrate

airflow-scheduler:
  image: apache/airflow:2.9.0
  depends_on:
    airflow-init:
      condition: service_completed_successfully
  environment:
    - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://airflow:airflow@postgres/airflow
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
    - AIRFLOW__DATABASE__SQL_ALCHEMY_CONN=postgresql+psycopg2://airflow:airflow@postgres/airflow
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
```

Add these to the `volumes:` section at the bottom of `docker-compose.yml`:

```yaml
volumes:
  postgres_data:
  airflow_logs:
  ldap_data:       # only if using containerised LDAP
  ldap_config:     # only if using containerised LDAP
```

### The New Pattern: `airflow-init`

This is the one structural difference from DocChecker. `airflow-init` is a **one-shot container** — it runs `db migrate` to set up the Airflow database schema and then exits. All other Airflow containers wait for it to finish with `condition: service_completed_successfully` before starting.

You do not need to do anything special — Docker Compose handles this automatically. Just do not be alarmed when you see `airflow-init` exit with code 0 during `docker compose up`.

### DAG Files

DAGs are mounted as a volume, not copied into the image:

```yaml
volumes:
  - ./dags:/opt/airflow/dags
```

This means DAG files can be updated without rebuilding the Airflow image — just drop a `.py` file into the `dags/` folder and the scheduler picks it up.

### Startup Order for the Full Stack

```
postgres (healthy)
    └─► airflow-init (db migrate, then exits)
            ├─► airflow-scheduler (starts)
            └─► airflow-webserver (starts, healthy)
backend (healthy)
    └─► frontend (starts)

nginx (starts after frontend, backend, airflow-webserver are all up)
```

Add `airflow-webserver` to nginx's `depends_on` list so Nginx starts last:

```yaml
nginx:
  depends_on:
    - frontend
    - backend
    - airflow-webserver
```

---

## Full `.env` for the Other Team's Stack

```env
# Backend / App
BACKEND_PORT=8081
BUILD_TAG=1.0.0
IS_DEPLOYED=true

# Azure OpenAI (or whatever LLM the backend uses)
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_API_VERSION=
AZURE_OPENAI_DEPLOYMENT=

# LDAP
LDAP_HOST=ldap.yourcompany.com
LDAP_PORT=389
LDAP_BASE_DN=dc=yourcompany,dc=com
LDAP_BIND_DN=cn=svc-account,dc=yourcompany,dc=com
LDAP_BIND_PASSWORD=

# Airflow
AIRFLOW_FERNET_KEY=<generated key>
```

---

---

# Part 4 — Sequence to Follow When the Code Is Ready

Follow the exact same two-phase sequence from the DocChecker guide.

## Phase 1 — Nginx Local Test First

1. Get their frontend and backend running locally (natively, no Docker)
2. Run just the Nginx container using `nginx.local-test.conf` (pointing to `host.docker.internal`)
3. Verify all three routes work: `/`, `/api/`, `/airflow/`
4. Fix any routing or CORS issues at this stage — it is much faster to debug here than after building images

## Phase 2 — Full Containerisation

1. Write `Backend/Dockerfile` — same pattern as DocChecker, adjust Python version if different
2. Write `Frontend/Dockerfile` — identical multi-stage pattern
3. Add LDAP service or env vars based on what you learned in Part 2
4. Add Airflow + Postgres services to `docker-compose.yml`
5. Add `AIRFLOW_FERNET_KEY` to `.env`
6. Run `docker compose build` — fix any build errors
7. Run `docker compose up` — watch startup order complete
8. Run the verification checklist below

## Verification Checklist for the Full Stack

```powershell
# All containers running, only nginx has a published port
docker compose ps

# Backend API through Nginx
curl http://localhost/api/healthz

# Frontend through Nginx
curl http://localhost/

# Airflow UI through Nginx
curl http://localhost/airflow/health

# These should all FAIL (services not publicly exposed)
curl http://localhost:8081/
curl http://localhost:3000/
curl http://localhost:8080/
curl http://localhost:5432/
```

Open `http://localhost/airflow` in a browser — the Airflow UI should load and show a healthy scheduler.

---

## Known Issues Specific to This Stack

| Issue | Cause | Fix |
|---|---|---|
| LDAP connection refused from container | Corporate firewall blocks Docker host | IT needs to allow outbound LDAP from the Docker host IP |
| LDAP SSL certificate error | Container does not trust the corporate CA | Mount the CA cert and set `LDAPTLS_CACERT` env var |
| Airflow `db migrate` fails | Postgres not ready yet | Already handled by `condition: service_healthy` on postgres healthcheck |
| Airflow DAGs not appearing | Wrong volume mount path | Confirm `./dags` exists at the project root and matches the container path `/opt/airflow/dags` |
| Airflow UI shows 404 at `/airflow/` | `BASE_URL` not set | Set `AIRFLOW__WEBSERVER__BASE_URL=http://localhost/airflow` in airflow-webserver environment |
| Fernet key mismatch error | Different key across containers | All Airflow containers must use the same `AIRFLOW_FERNET_KEY` value from `.env` |

---

## What Stays the Same Across Both Projects

| Item | DocChecker | Other Team's Stack |
|---|---|---|
| Nginx pattern | ✓ | ✓ identical |
| `expose` vs `ports` isolation | ✓ | ✓ identical |
| Frontend Dockerfile (multi-stage Node) | ✓ | ✓ identical |
| Backend Dockerfile (slim Python) | ✓ | ✓ same pattern |
| `.env` for secrets | ✓ | ✓ identical |
| `depends_on` + `healthcheck` ordering | ✓ | ✓ identical |
| BACKEND_URL env var in Next.js config | ✓ | ✓ identical |
| CORS origins update | ✓ | ✓ identical |
| Two-phase test sequence | ✓ | ✓ identical |
| LDAP service | — | new |
| Airflow + Postgres services | — | new |
| `airflow-init` one-shot container | — | new |
