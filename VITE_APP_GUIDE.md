# Vite React App — Creation, Integration & Containerisation Guide

This guide walks through building a Vite React app from scratch, connecting it to the DocChecker backend through Nginx, containerising it, and adding it to the existing Docker Compose stack.

---

## What Is This and Why

**Vite** is a tool that creates and runs modern JavaScript frontend apps. It is the equivalent of `create-next-app` but lighter — no server-side rendering, just a React app that runs entirely in the browser.

**What you are building:**
- A small Vite React app with a UI that calls the DocChecker backend API through Nginx
- That app containerised as its own Docker container
- Added to your existing docker-compose stack alongside backend, frontend, and nginx

**Why this matters:**
It proves that Nginx works as a shared entry point that any frontend — not just the DocChecker Next.js app — can use to reach the backend. This is exactly the pattern the other team uses.

```
Browser → http://localhost        → DocChecker (Next.js)  ─┐
Browser → http://localhost:5173   → Vite React app        ─┤─► Nginx :80 ──► Backend :8081
```

The Vite app makes its API calls to `http://localhost/api/` — the Nginx port — not directly to the backend. Nginx handles the routing.

---

---

# Part 1 — Create the Vite React App

## Step 1 — Scaffold the App

From the DocChecker project root in your terminal:

```powershell
npm create vite@latest ViteApp -- --template react
cd ViteApp
npm install
```

This creates a `ViteApp/` folder with a working React app. The `--template react` flag gives you plain React with JavaScript (no TypeScript, keeping it simple).

---

## Step 2 — Replace the App Content

Open `ViteApp/src/App.jsx` and replace everything with the following. This gives you a UI with multiple test buttons — one for each thing you want to verify:

```jsx
import { useState } from 'react'

const NGINX_BASE = 'http://localhost'

function ApiTest({ label, url, method = 'GET', body = null }) {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const run = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setStatus(null)
    try {
      const options = { method }
      if (body) {
        options.headers = { 'Content-Type': 'application/json' }
        options.body = JSON.stringify(body)
      }
      const res = await fetch(url, options)
      setStatus(res.status)
      const text = await res.text()
      try {
        setResult(JSON.parse(text))
      } catch {
        setResult(text)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.method}>{method}</span>
        <code style={styles.url}>{url}</code>
      </div>
      <p style={styles.label}>{label}</p>
      <button onClick={run} disabled={loading} style={styles.button}>
        {loading ? 'Calling...' : 'Run Test'}
      </button>
      {status && (
        <p style={{ ...styles.status, color: status < 300 ? '#155724' : '#721c24' }}>
          HTTP {status}
        </p>
      )}
      {result !== null && (
        <div style={styles.success}>
          <strong>Response:</strong>
          <pre style={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && (
        <div style={styles.errorBox}>
          <strong>Error:</strong> {error}
          {error.includes('Failed to fetch') && (
            <p style={styles.hint}>
              Hint: Make sure the docker-compose stack is running and Nginx is up on port 80.
            </p>
          )}
          {error.includes('CORS') && (
            <p style={styles.hint}>
              Hint: Add http://localhost:5173 to CORS_ALLOWED_ORIGINS in Backend/app/config.py.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

const tests = [
  {
    label: 'Basic health check — confirms Nginx is routing /api/* to the backend',
    url: `${NGINX_BASE}/api/healthz`,
    method: 'GET',
  },
  {
    label: 'API root — confirms the backend welcome response comes through Nginx',
    url: `${NGINX_BASE}/api/`,
    method: 'GET',
  },
  {
    label: 'Frontend root — confirms Nginx is serving the Next.js app on /',
    url: `${NGINX_BASE}/`,
    method: 'GET',
  },
  {
    label: 'Non-existent route — confirms Nginx returns a proper 404 and does not crash',
    url: `${NGINX_BASE}/api/this-route-does-not-exist`,
    method: 'GET',
  },
]

export default function App() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Vite App — Nginx Integration Tests</h1>
      <p style={styles.subtitle}>
        Each test calls the DocChecker stack through the Nginx entry point on port 80.
        This app is served on port 5173 as its own container.
      </p>
      <div style={styles.stack}>
        {tests.map((t) => (
          <ApiTest key={t.url + t.method} {...t} />
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, sans-serif',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#555',
    marginBottom: '2rem',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.25rem',
    background: '#fafafa',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  method: {
    background: '#0070f3',
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  url: {
    fontSize: '0.9rem',
    color: '#333',
  },
  label: {
    fontSize: '0.85rem',
    color: '#666',
    margin: '0 0 0.75rem',
  },
  button: {
    padding: '0.4rem 1rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid #0070f3',
    background: '#0070f3',
    color: '#fff',
  },
  status: {
    margin: '0.5rem 0 0',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
  success: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    background: '#d4edda',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
  errorBox: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    background: '#f8d7da',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
  hint: {
    marginTop: '0.5rem',
    fontSize: '0.8rem',
    color: '#555',
  },
  pre: {
    margin: '0.5rem 0 0',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
}
```

---

## Step 3 — Test Locally First (Before Containerising)

Make sure your DocChecker docker-compose stack is already running:

```powershell
# From project root
docker compose ps
# All three services (backend, frontend, nginx) should show as running/healthy
```

Then start the Vite dev server:

```powershell
cd ViteApp
npm run dev
```

Open `http://localhost:5173` in your browser. You will see four test cards. Click **Run Test** on each one.

### Expected Results

| Test | Expected |
|---|---|
| `GET /api/healthz` | HTTP 200, JSON response from FastAPI |
| `GET /api/` | HTTP 200, welcome JSON from FastAPI |
| `GET /` | HTTP 200, HTML (the Next.js DocChecker page) |
| `GET /api/this-route-does-not-exist` | HTTP 404 or 422, JSON error from FastAPI |

All four going through Nginx on port 80 confirms the routing is working correctly from an external consumer.

### If You Get a CORS Error

The browser will show a CORS error if `http://localhost:5173` is not in the backend's allowed origins. Open `Backend/app/config.py` and add it:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",    # Vite dev server and containerised app
]
```

Then restart the backend container:

```powershell
docker compose restart backend
```

Refresh the Vite app and re-run the tests.

---

---

# Part 2 — Containerise the Vite App

## Step 4 — Create `ViteApp/.dockerignore`

```
node_modules
dist
.env
.env.*
```

---

## Step 5 — Create `ViteApp/Dockerfile`

Vite builds to a `dist/` folder of plain static HTML, JS, and CSS — no Node.js is needed to serve it in production. The standard approach is to serve it with `nginx:alpine`, which is tiny and purpose-built for static files.

```dockerfile
# Stage 1: build the Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve the static output with nginx
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
```

The final image is just `nginx:alpine` + your built files. No Node.js, no source code, no `node_modules` — very small.

---

## Step 6 — Add the Vite App to `docker-compose.yml`

Open your existing `docker-compose.yml` and add the `vite-app` service:

```yaml
  vite-app:
    build:
      context: ./ViteApp
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    depends_on:
      - nginx
```

**Why `ports` instead of `expose`?**
You need to access this app directly in your browser, so it must be published to the host. The container's internal nginx serves on port 80; you map that to port 5173 on your host so it does not clash with the main Nginx on port 80.

---

## Step 7 — Build and Start

```powershell
# From project root
docker compose build vite-app
docker compose up -d
```

Check all four containers are running:

```powershell
docker compose ps
```

Expected output — four services, `vite-app` and `nginx` both have published ports:

```
NAME                    SERVICE      STATUS     PORTS
docchecker-backend-1    backend      healthy
docchecker-frontend-1   frontend     running
docchecker-nginx-1      nginx        running    0.0.0.0:80->80/tcp
docchecker-vite-app-1   vite-app     running    0.0.0.0:5173->80/tcp
```

---

---

# Part 3 — Verify the Full Containerised Stack

## Test 1 — Vite App is Reachable

Open `http://localhost:5173` in a browser. The test UI should load with four cards.

---

## Test 2 — Run All Four API Tests in the Browser

Click **Run Test** on each card and confirm the expected results from the table in Step 3.

---

## Test 3 — Confirm Container Isolation from PowerShell

```powershell
# Vite app accessible (has published port)
curl http://localhost:5173/

# Nginx accessible (has published port)
curl http://localhost/api/healthz

# Backend NOT accessible from host (no published port)
curl http://localhost:8081/api/healthz

# Frontend NOT accessible from host (no published port)
curl http://localhost:3000/
```

The last two should return `connection refused`. This confirms:
- The Vite app and Nginx are the only public entry points
- The backend is protected behind Nginx

---

## Test 4 — Confirm the Vite App Reaches the Backend Through Nginx (Not Directly)

While the docker-compose stack is running, temporarily stop just the Nginx container:

```powershell
docker compose stop nginx
```

Now go back to `http://localhost:5173` and click **Run Test** on the `/api/healthz` card.

**Expected:** the test fails with a network error or "Failed to fetch". This confirms the Vite app is routing through Nginx — when Nginx is down, the API is unreachable even though the backend container is still running.

Restart Nginx:

```powershell
docker compose start nginx
```

Re-run the test — it should succeed again.

---

## Test 5 — Confirm All Services Survive a Full Restart

```powershell
docker compose down
docker compose up -d
docker compose ps
```

All four containers should come back up and all tests should pass again. This confirms the stack is stable and repeatable.

---

---

# Part 4 — Final File Structure

After completing this guide your project should look like this:

```
DocChecker/
├── Backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env                  (not committed)
│   ├── .env.example
│   └── app/config.py         (CORS updated to include :5173)
├── Frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── next.config.ts
├── ViteApp/                  ← new
│   ├── Dockerfile            ← new
│   ├── .dockerignore         ← new
│   ├── src/
│   │   └── App.jsx           ← new (replaced with test UI)
│   └── package.json
├── nginx/
│   ├── nginx.conf
│   └── nginx.local-test.conf
└── docker-compose.yml        ← updated (vite-app service added)
```

---

# Summary of What Each Container Does

| Container | Image | Published Port | Role |
|---|---|---|---|
| `backend` | Custom Python image | None (isolated) | FastAPI server |
| `frontend` | Custom Node image | None (isolated) | Next.js DocChecker app |
| `nginx` | `nginx:alpine` | `:80` | Reverse proxy — single entry point |
| `vite-app` | `nginx:alpine` + static files | `:5173` | Vite React test app |

The Vite app demonstrates that Nginx on port 80 is a working, shared API gateway — any frontend can call it regardless of what port or container that frontend is served from.
