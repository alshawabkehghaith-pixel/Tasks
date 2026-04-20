# Placeholder Quick Reference

Every placeholder in the template files uses the format `{{PLACEHOLDER_NAME}}`.  
Use **Ctrl+F** in your editor to find and replace each one across all files.

---

## Complete Placeholder List

| Placeholder | Description | Example Value | Files It Appears In |
|---|---|---|---|
| `{{APP_NAME}}` | Short name for the application — used in comments and container names | `docchecker` | `docker-compose.yml` |
| `{{PYTHON_VERSION}}` | Python version for the backend container base image | `3.11` | `backend/Dockerfile` |
| `{{NODE_VERSION}}` | Node.js version for the frontend container base image | `20` | `frontend/Dockerfile` |
| `{{BACKEND_PORT}}` | Port the backend server listens on | `8081` | `backend/Dockerfile`, `docker-compose.yml`, all nginx configs |
| `{{FRONTEND_PORT}}` | Port the frontend server listens on | `3000` | `frontend/Dockerfile`, `docker-compose.yml`, all nginx configs |
| `{{API_PREFIX}}` | URL path prefix for all backend API routes | `/api` | all nginx configs |
| `{{BACKEND_START_COMMAND}}` | Shell command to start the backend process | `python -m app.server` | `backend/Dockerfile` |
| `{{BACKEND_URL_DEFAULT}}` | Internal Docker URL the frontend uses to reach the backend for SSR | `http://backend:8081` | `frontend/Dockerfile`, `docker-compose.yml` |
| `{{BACKEND_HEALTHCHECK_PATH}}` | Full URL Compose uses to health-check the backend | `http://localhost:8081/api/healthz` | `docker-compose.yml` |
| `{{DOMAIN_NAME}}` | The real or test domain name | `app.hrdf.com` or `myapp.local` | `nginx/nginx.ssl.conf` |
| `{{SSL_EMAIL}}` | Email address for Let's Encrypt certificate registration | `admin@hrdf.com` | `README.md` (Certbot command) |

---

## How to Replace Them

### Option A — Editor Find & Replace (recommended)

1. Open the `docker-template/` folder in your editor
2. Use **Ctrl+Shift+H** (VS Code / Cursor) to open global find-and-replace
3. Search for `{{PLACEHOLDER_NAME}}`, replace with your value
4. Replace All
5. Repeat for each placeholder

### Option B — PowerShell one-liner (replace across all files at once)

```powershell
# Run from inside the docker-template folder
# Replace one placeholder at a time
Get-ChildItem -Recurse -File | ForEach-Object {
  (Get-Content $_.FullName) -replace '\{\{PYTHON_VERSION\}\}', '3.11' |
  Set-Content $_.FullName
}
```

---

## Minimum Required Replacements

These must be replaced before any `docker compose build` will succeed:

- [ ] `{{PYTHON_VERSION}}`
- [ ] `{{NODE_VERSION}}`
- [ ] `{{BACKEND_PORT}}`
- [ ] `{{FRONTEND_PORT}}`
- [ ] `{{API_PREFIX}}`
- [ ] `{{BACKEND_START_COMMAND}}`
- [ ] `{{BACKEND_URL_DEFAULT}}`
- [ ] `{{BACKEND_HEALTHCHECK_PATH}}`

These are only needed if using SSL:

- [ ] `{{DOMAIN_NAME}}`
- [ ] `{{SSL_EMAIL}}`
