# Backend Dockerfile — Python

####################################################################################################
#                                                                                                  #
# Placeholders (replace before use):                                                               #
#   {{PYTHON_VERSION}}     Python base image tag, e.g. 3.11                                        #
#   {{BACKEND_PORT}}       Port the application server binds to, e.g. 8081                         #
#   {{BACKEND_START_CMD}}  Entrypoint command, e.g. if python -m app.server is the command,        #
#                          replace ["{{BACKEND_START_CMD}}"] with ["python", "-m", "app.server"]   #
#                                                                                                  #
####################################################################################################

# Notes:
#   - WORKDIR is /app. Any config file read with a relative path
#     (e.g. config.ini, settings.toml) must live at the root of the
#     backend source directory so it is copied to /app/.

FROM python:{{PYTHON_VERSION}}-slim

# Uncomment for Microsoft SQL Server / pyodbc support
# RUN apt-get update && apt-get install -y --no-install-recommends \
#       curl gnupg2 apt-transport-https \
#     && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
#     && curl https://packages.microsoft.com/config/debian/12/prod.list \
#          > /etc/apt/sources.list.d/mssql-release.list \
#     && apt-get update \
#     && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
#     && apt-get purge -y --auto-remove curl gnupg2 apt-transport-https \
#     && rm -rf /var/lib/apt/lists/*
# -----------------------------------------------------------------

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE {{BACKEND_PORT}}

CMD ["{{BACKEND_START_CMD}}"]
