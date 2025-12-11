#!/bin/bash

# Test database connection and show table counts

echo "Testing database connection..."

docker exec -it lunor-postgres psql -U postgres -d lunolens -c "
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname IN ('assethub')
ORDER BY schemaname, tablename;
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database connection successful!"
    echo ""
    echo "Checking row counts..."
    docker exec -it lunor-postgres psql -U postgres -d lunolens -c "
    SELECT 'assethub.block' as table_name, COUNT(*) as rows FROM assethub.block
    UNION ALL
    SELECT 'assethub.event', COUNT(*) FROM assethub.event
    UNION ALL
    SELECT 'assethub.call', COUNT(*) FROM assethub.call
    UNION ALL
    SELECT 'assethub.transfer', COUNT(*) FROM assethub.transfer
    UNION ALL
    SELECT 'assethub.asset', COUNT(*) FROM assethub.asset
    UNION ALL
    SELECT 'assethub.account', COUNT(*) FROM assethub.account;
    " 2>/dev/null
else
    echo "❌ Cannot connect to database. Is PostgreSQL running?"
    echo "Run: docker-compose up -d postgres"
    exit 1
fi
