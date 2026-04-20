# =============================================================================
# BACKEND DOCKERFILE TEMPLATE
# =============================================================================
# Placeholders to replace (use Ctrl+F to find each one):
#
#   {{PYTHON_VERSION}}         e.g. 3.11
#   {{BACKEND_PORT}}           e.g. 8081
#   {{BACKEND_START_COMMAND}}  e.g. python -m app.server
#
# Optional: if the backend connects to Microsoft SQL Server via pyodbc,
# uncomment the ODBC driver installation block below.
# =============================================================================

FROM python:{{PYTHON_VERSION}}-slim

# --- OPTIONAL: Uncomment this block if the backend uses pyodbc / SQL Server ---
# RUN apt-get update && apt-get install -y \
#     curl gnupg2 apt-transport-https \
#   && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
#   && curl https://packages.microsoft.com/config/debian/12/prod.list \
#        > /etc/apt/sources.list.d/mssql-release.list \
#   && apt-get update \
#   && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
#   && apt-get clean && rm -rf /var/lib/apt/lists/*
# -----------------------------------------------------------------------------

WORKDIR /app

# Copy and install dependencies first for better layer caching.
# If the backend uses poetry instead of pip, see the note in README.md.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application source
COPY . .

EXPOSE {{BACKEND_PORT}}

# WORKDIR is /app — any config file read with a relative path (e.g. config.ini)
# must be at the root of the backend source directory so it copies to /app/
CMD ["{{BACKEND_START_COMMAND}}"]
