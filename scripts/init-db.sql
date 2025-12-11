-- Initialize database schema for AssetHub

-- Create schema
CREATE SCHEMA IF NOT EXISTS assethub;

-- Grant permissions
GRANT ALL PRIVILEGES ON SCHEMA assethub TO postgres;

-- Set search path
ALTER DATABASE lunolens SET search_path TO assethub, public;

COMMENT ON SCHEMA assethub IS 'AssetHub chain data';
