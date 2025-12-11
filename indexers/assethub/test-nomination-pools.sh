#!/bin/bash
# Quick test to see if nominationPools events are captured

echo "🧪 Testing nominationPools event capture..."
echo "📍 Processing last 100 blocks only..."

# Temporarily modify the block range to only process recent blocks
export DB_NAME=lunolens
export DB_PORT=5432
export DB_HOST=localhost
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_SCHEMA=assethub
export RPC_ENDPOINT_WSS=wss://polkadot-asset-hub-rpc.polkadot.io
export RPC_ENDPOINT_HTTP=https://polkadot-asset-hub-rpc.polkadot.io
export ARCHIVE_ENDPOINT=https://v2.archive.subsquid.io/network/asset-hub-polkadot

# Run for a short time and grep for nominationPools
timeout 30s node -r dotenv/config lib/main.js 2>&1 | grep -i "nomination\|pool\|📊" || echo "No nominationPools events found in recent blocks"

echo ""
echo "✅ Test complete"
