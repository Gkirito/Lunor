#!/bin/bash

# Lunolens Setup and Run Script

set -e

echo "🚀 Lunolens Setup Script"
echo "========================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL
echo "📦 Starting PostgreSQL..."
docker-compose up -d postgres

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if PostgreSQL is ready
until docker exec lunor-postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "   Still waiting..."
    sleep 2
done

echo "✅ PostgreSQL is ready!"
echo ""

# Setup AssetHub indexer
echo "🔧 Setting up AssetHub indexer..."
cd indexers/assethub

if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

echo "🔨 Building project..."
npm run build

echo "📝 Creating database migration..."
npm run db:create-migration || echo "⚠️  Migration already exists or failed"

echo "🗄️  Applying database migration..."
npm run db:migrate

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start indexing:"
echo "  cd indexers/assethub"
echo "  npm run process"
echo ""
echo "To start Superset:"
echo "  docker-compose up -d superset"
echo "  Open http://localhost:8088 (admin/admin)"
echo ""
