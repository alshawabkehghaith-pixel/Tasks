# Connecting `docchecker.website` to Nginx with SSL
## Namecheap — Full Walkthrough

You have already purchased `docchecker.website` from Namecheap. This guide walks through buying the SSL certificate from Namecheap, activating it, wiring everything into your Nginx Docker stack, and verifying it all works.

---

## Overview of What You Are Doing

```
Step 1  Buy SSL certificate on Namecheap
Step 2  Generate a private key + CSR on your personal laptop
Step 3  Activate the certificate on Namecheap (paste CSR)
Step 4  Complete domain validation (automatic or DNS record)
Step 5  Download the certificate files from Namecheap
Step 6  Combine into a fullchain file
Step 7  Copy cert files to your work laptop
Step 8  Update nginx.ssl.conf and docker-compose.yml
Step 9  Update backend CORS
Step 10 Start the stack and test
```

---

---

# Step 1 — Buy the SSL Certificate on Namecheap

1. Log into [namecheap.com](https://www.namecheap.com)
2. Go to **Security → SSL Certificates** in the top nav
3. Choose **PositiveSSL** — this is the cheapest DV (Domain Validated) certificate (~$6–9/year) and gives you the exact same green padlock as expensive certificates
4. Add to cart and complete the purchase
5. After purchase, go to **Dashboard → Products → SSL Certificates**
6. You will see your new certificate listed with status **"Awaiting Activation"** — leave this tab open, you will come back to it in Step 3

---

---

# Step 2 — Generate the Private Key and CSR (Personal Laptop)

A CSR (Certificate Signing Request) is a file you generate on your machine. You send it to Namecheap, they sign it and send back your certificate. Your private key stays on your machine and never leaves it.

**Prerequisites:** Docker Desktop must be running on your personal laptop.

### Create the certs folder

Open PowerShell from your project root:

```powershell
New-Item -ItemType Directory -Force -Path "nginx\certs"
```

### Generate the key and CSR

```powershell
docker run --rm -v "${PWD}/nginx/certs:/certs" alpine/openssl req -new `
  -newkey rsa:2048 `
  -nodes `
  -keyout /certs/docchecker.website.key `
  -out /certs/docchecker.website.csr `
  -subj "/CN=docchecker.website/O=YourOrganisationName/C=US"
```

Replace `YourOrganisationName` with your company or your name. For a DV certificate it is informational only and does not affect validation.

### Verify the files were created

```powershell
Get-ChildItem nginx\certs\
```

Expected output:
```
docchecker.website.key    ← your private key — NEVER share or commit this
docchecker.website.csr    ← this goes to Namecheap
```

### Read the CSR contents (you will paste this into Namecheap)

```powershell
Get-Content nginx\certs\docchecker.website.csr
```

The output looks like this — copy the entire block including the dashes:

```
-----BEGIN CERTIFICATE REQUEST-----
MIICvDCCAaQCAQAwdzELMAkGA1UEBhMCVVMxETAPBgNVBAoMCFlvdXJPcmcxHTAb
... (many lines) ...
-----END CERTIFICATE REQUEST-----
```

---

---

# Step 3 — Activate the Certificate on Namecheap

1. Go back to your Namecheap dashboard → **SSL Certificates** → click **Activate** next to your PositiveSSL certificate
2. In the **CSR** field, paste the entire contents of `docchecker.website.csr` (the `-----BEGIN CERTIFICATE REQUEST-----` block)
3. For **Server Software** select **Nginx**
4. Click **Next**

---

---

# Step 4 — Complete Domain Validation

Namecheap needs to confirm you own `docchecker.website`. Since you bought the domain from Namecheap too, they offer three methods — **DNS (CNAME) validation is the easiest** and usually resolves in minutes.

### Option A — DNS (CNAME) Validation (Recommended)

Namecheap will show you a CNAME record to add, something like:

```
Type:   CNAME
Host:   _abc123def456          (a unique string they provide)
Value:  abc123def456.comodoca.com.
```

To add this:
1. Go to Namecheap dashboard → **Domain List** → click **Manage** next to `docchecker.website`
2. Click **Advanced DNS**
3. Click **Add New Record**
4. Select type **CNAME**, paste the Host and Value exactly as Namecheap showed
5. Click the green tick to save
6. Go back to the SSL activation page and click **Next** or **Verify**

DNS propagation takes 1–15 minutes. Namecheap checks automatically and proceeds once it detects the record.

### Option B — Email Validation

If you choose email validation, Namecheap sends a verification email to one of these addresses:

```
admin@docchecker.website
administrator@docchecker.website
webmaster@docchecker.website
hostmaster@docchecker.website
postmaster@docchecker.website
```

This only works if you have a mailbox set up at one of those addresses. If you do not, use Option A instead.

---

---

# Step 5 — Download the Certificate Files

Once validation is complete (usually within minutes for DNS), Namecheap emails you the certificate files. Check the email address on your Namecheap account.

The email contains a zip file attachment. Extract it. Inside you will find:

```
docchecker_website.crt          ← your certificate
docchecker_website.ca-bundle    ← Namecheap/Comodo intermediate chain
```

> **Note:** Namecheap uses underscores in filenames (`docchecker_website`) even though your domain uses dots. This is normal.

Copy both files into your project's `nginx/certs/` folder on your personal laptop:

```
nginx/certs/
├── docchecker.website.key          ← generated in Step 2
├── docchecker.website.csr          ← no longer needed
├── docchecker_website.crt          ← downloaded from Namecheap
└── docchecker_website.ca-bundle    ← downloaded from Namecheap
```

---

---

# Step 6 — Combine Into a Full Chain File

Nginx needs one file containing both your certificate and the intermediate chain. Combine them in PowerShell:

```powershell
Get-Content nginx\certs\docchecker_website.crt, nginx\certs\docchecker_website.ca-bundle | Set-Content nginx\certs\fullchain.crt
```

Verify the combined file looks right — it should contain multiple certificate blocks:

```powershell
Get-Content nginx\certs\fullchain.crt
```

Expected: you will see two or three `-----BEGIN CERTIFICATE-----` blocks one after another. That is correct.

Your `nginx/certs/` folder now has everything needed:

```
nginx/certs/
├── docchecker.website.key          ← private key (MUST transfer to work laptop)
├── fullchain.crt                   ← combined certificate (MUST transfer to work laptop)
├── docchecker.website.csr          ← no longer needed
├── docchecker_website.crt          ← no longer needed (merged into fullchain.crt)
└── docchecker_website.ca-bundle    ← no longer needed (merged into fullchain.crt)
```

---

---

# Step 7 — Copy Cert Files to Your Work Laptop

Only two files need to transfer. Everything else is either no longer needed or will be generated on the work laptop.

**Files to copy:**

| File | Why |
|---|---|
| `nginx/certs/docchecker.website.key` | Private key — Nginx cannot decrypt traffic without this |
| `nginx/certs/fullchain.crt` | Certificate — Nginx presents this to browsers |

**Transfer methods (pick one):**
- USB drive
- OneDrive / Google Drive — the files are plain text, safe to copy this way
- Attach to a secure email to your work address

Place them in `nginx/certs/` inside the project on your work laptop so the path is:

```
your-project/
└── nginx/
    └── certs/
        ├── docchecker.website.key
        └── fullchain.crt
```

---

---

# Step 8 — Configure Nginx for HTTPS

The following changes are made on your **work laptop** where you will run the Docker stack.

## Update `nginx/nginx.ssl.conf`

Replace the contents of `nginx/nginx.ssl.conf` with this (placeholders already filled for `docchecker.website`):

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

  # Block 1: HTTP — redirect all traffic to HTTPS
  server {
    listen 80;
    server_name docchecker.website;

    location / {
      return 301 https://$host$request_uri;
    }
  }

  # Block 2: HTTPS — the actual application
  server {
    listen 443 ssl;
    server_name docchecker.website;

    ssl_certificate     /etc/nginx/certs/fullchain.crt;
    ssl_certificate_key /etc/nginx/certs/docchecker.website.key;

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

## Update `docker-compose.yml`

Update the `nginx` service to expose port 443 and mount the SSL config and certs:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx/nginx.ssl.conf:/etc/nginx/nginx.conf:ro
    - ./nginx/certs:/etc/nginx/certs:ro
  depends_on:
    - frontend
    - backend
```

---

---

# Step 9 — Update Backend CORS

Open `Backend/app/config.py` and add `https://docchecker.website` to the allowed origins:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:80",
    "https://docchecker.website",    # ← add this
]
```

Also point your domain's DNS A record to the machine running this stack. Log into Namecheap → **Domain List** → **Manage** → **Advanced DNS** and add:

```
Type:   A
Host:   @
Value:  <the public IP of the machine running docker compose>
TTL:    Automatic
```

---

---

# Step 10 — Start the Stack and Test

```powershell
docker compose down
docker compose build
docker compose up -d
```

Wait about 30 seconds for the backend healthcheck to pass, then run the verification tests.

## Verification Tests

### Test 1 — HTTP redirects to HTTPS

```powershell
curl -v http://docchecker.website/
```

Expected: `301 Moved Permanently` with `Location: https://docchecker.website/`

---

### Test 2 — HTTPS API works (no `-k` flag — Namecheap cert is fully trusted)

```powershell
curl https://docchecker.website/api/healthz
```

Expected: JSON response from FastAPI

---

### Test 3 — See the certificate details

```powershell
curl -v https://docchecker.website/api/healthz
```

In the verbose output look for:

```
* Server certificate:
*  subject: CN=docchecker.website
*  issuer: CN=Sectigo RSA Domain Validation Secure Server CA
*  SSL connection using TLSv1.3
```

The issuer line confirms this is the Namecheap/Sectigo (Comodo) certificate — not self-signed.

---

### Test 4 — Frontend loads in browser with green padlock

Open `https://docchecker.website` in your browser. You should see:
- Green padlock (or lock icon) in the address bar
- No security warning
- The DocChecker UI loads and works fully

---

### Test 5 — Backend is still isolated

```powershell
curl https://docchecker.website:8081/api/healthz
```

Expected: connection refused — backend is not publicly exposed, only reachable through Nginx.

---

---

# Certificate Renewal Reminder

Namecheap PositiveSSL certificates are valid for **1 year**. Unlike Let's Encrypt, renewal is **manual** — you must repeat Steps 2–6 before the certificate expires.

Set a calendar reminder for **11 months from today** to renew. When renewal time comes:
1. Buy a new certificate (or renew the existing one in your Namecheap dashboard)
2. Generate a new CSR and key (Step 2)
3. Activate, validate, download (Steps 3–5)
4. Combine into `fullchain.crt` (Step 6)
5. Replace the old files in `nginx/certs/` on the work laptop
6. `docker compose restart nginx` — no rebuild needed, Nginx just re-reads the mounted files

---

---

# Troubleshooting

## Nginx fails to start — "key mismatch" error

```
nginx: [emerg] SSL_CTX_use_PrivateKey_file ... failed
```

**Cause:** The private key (`docchecker.website.key`) does not match the certificate (`fullchain.crt`). This happens if you regenerated the key on a different machine after already activating the certificate.

**Fix:** The key and certificate are a matched pair — they must be from the same CSR generation. Go back to your personal laptop, use the original `docchecker.website.key` that was generated alongside the CSR you submitted to Namecheap.

---

## Browser shows "Certificate not trusted" or security warning

**Cause:** The `fullchain.crt` is missing the intermediate chain — it only contains your certificate without the Namecheap/Comodo chain appended.

**Fix:** Re-run Step 6 to combine the files, making sure both `docchecker_website.crt` AND `docchecker_website.ca-bundle` are included in that order:

```powershell
Get-Content nginx\certs\docchecker_website.crt, nginx\certs\docchecker_website.ca-bundle | Set-Content nginx\certs\fullchain.crt
```

Restart Nginx: `docker compose restart nginx`

---

## curl works but browser shows warning

**Cause:** The browser cached a previous security decision or the cert chain is incomplete.

**Fix:** Open browser developer tools → Security tab → View Certificate. If the issuer chain is incomplete, re-do Step 6. If the chain looks correct, clear browser cache and try in an incognito window.

---

## CORS error in browser after switching to HTTPS

**Cause:** The browser's Origin header is now `https://docchecker.website` but the backend's `CORS_ALLOWED_ORIGINS` still only has `http://` variants.

**Fix:** Confirm Step 9 was applied — `https://docchecker.website` must be in the list. Rebuild and restart: `docker compose build backend && docker compose up -d --force-recreate backend`

---

## DNS not resolving to your machine

**Cause:** The A record in Namecheap DNS has not propagated yet, or points to the wrong IP.

**Fix:**
```powershell
nslookup docchecker.website
```
Should return your machine's public IP. If not, check Namecheap → Advanced DNS and confirm the A record value. Propagation can take up to 30 minutes after adding/changing a record. Check live status at [dnschecker.org](https://dnschecker.org).
