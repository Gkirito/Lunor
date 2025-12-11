#!/bin/bash

# Reset database schema for AssetHub

echo "🔄 Resetting AssetHub database schema..."
echo ""

# Drop and recreate the assethub schema
docker exec lunor-postgres psql -U postgres -d lunolens << EOF
DROP SCHEMA IF EXISTS assethub CASCADE;
CREATE SCHEMA assethub;
GRANT ALL PRIVILEGES ON SCHEMA assethub TO postgres;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database schema reset successfully!"
    echo ""
    echo "Now you can run migrations:"
    echo "  cd indexers/assethub"
    echo "  npm run db:migrate"
else
    echo "❌ Failed to reset database schema"
    exit 1
fi
