#!/bin/bash

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Ensure dependencies are available
echo "📦 Installing required Python packages (flask-cors, psycopg2-binary)..."
pip install --quiet flask-cors psycopg2-binary >/dev/null 2>&1 || true

# Initialize Superset database
echo "📦 Initializing Superset database..."
superset db upgrade

# Create admin user (skip if exists)
echo "👤 Creating admin user..."
superset fab create-admin \
    --username admin \
    --firstname Admin \
    --lastname User \
    --email admin@lunor.io \
    --password admin 2>/dev/null || echo "Admin user already exists"

# Initialize Superset
echo "🔧 Initializing Superset roles and permissions..."
superset init

# Copy custom logo into static assets for branding (keeps build-time copy fresh)
if [ -f /app/superset_home/assets/images/polkadot-logo.svg ]; then
    cp /app/superset_home/assets/images/polkadot-logo.svg /app/superset/static/assets/images/polkadot-logo.svg || true
fi

# Setup database connections using superset shell
echo "🔌 Setting up database connections..."
superset shell < /app/setup-database.py || echo "Database setup script executed"

echo ""
echo "✅ Superset initialization complete!"
echo ""
echo "🚀 Starting Superset web server..."
echo "   Access at: http://localhost:8088"
echo "   Username: admin"
echo "   Password: admin"
echo ""

# Start Superset
exec superset run -h 0.0.0.0 -p 8088 --with-threads --reload
