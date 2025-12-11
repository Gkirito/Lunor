FROM apache/superset:latest

USER root

# Install PostgreSQL client and build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    postgresql-client && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Let the superset user write custom assets (logo)
RUN mkdir -p /app/superset/static/assets/images && \
    chown -R superset:superset /app/superset/static/assets/images

# Ensure pip exists in the venv, then install extras
RUN python -m ensurepip && \
    python -m pip install --no-cache-dir psycopg2-binary sqlalchemy-utils redis flask-cors

# Copy custom logo into served static assets (multiple locations used by Superset)
COPY Polkadot_Logo_Pink-Black.svg /tmp/polkadot-logo.svg
RUN mkdir -p /app/superset/static/assets/images && \
    mkdir -p /app/.venv/lib/python3.10/site-packages/superset/static/assets/images && \
    mkdir -p /app/build/lib/superset/static/assets/images && \
    cp /tmp/polkadot-logo.svg /app/superset/static/assets/images/polkadot-logo.svg && \
    cp /tmp/polkadot-logo.svg /app/.venv/lib/python3.10/site-packages/superset/static/assets/images/polkadot-logo.svg && \
    cp /tmp/polkadot-logo.svg /app/build/lib/superset/static/assets/images/polkadot-logo.svg && \
    chown superset:superset /app/superset/static/assets/images/polkadot-logo.svg

USER superset
