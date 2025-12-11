# Superset Configuration

import os

# Security
SECRET_KEY = os.environ.get('SUPERSET_SECRET_KEY', 'change-this-to-a-long-random-string')

# Database connection for Superset metadata (use the bundled SQLite so existing dashboards are preserved)
SQLALCHEMY_DATABASE_URI = 'sqlite:////app/superset_home/superset.db'

# Public access settings (for MVP - no authentication required)
PUBLIC_ROLE_LIKE = 'Gamma'
AUTH_ROLE_PUBLIC = 'Public'

# Enable SQL Lab
ENABLE_PROXY_FIX = True
SUPERSET_WEBSERVER_TIMEOUT = 300


# Feature flags
FEATURE_FLAGS = {
    'ENABLE_TEMPLATE_PROCESSING': True,
    'DASHBOARD_NATIVE_FILTERS': True,
    'DASHBOARD_CROSS_FILTERS': True,
    'DASHBOARD_NATIVE_FILTERS_SET': True,
}

# CORS settings
ENABLE_CORS = True
CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': ['*'],
    'resources': ['*'],
    'origins': ['*']
}

# Cache configuration
CACHE_CONFIG = {
    'CACHE_TYPE': 'simple',
    'CACHE_DEFAULT_TIMEOUT': 300
}

# Rate limiting
RATELIMIT_ENABLED = False

# Row limit for SQL queries
ROW_LIMIT = 50000
SQL_MAX_ROW = 100000

# CSV export settings
CSV_EXPORT = {
    'encoding': 'utf-8',
}

# Branding
APP_NAME = "Lunor"
# Custom logo (we copy this file into the static assets during build/init)
APP_ICON = "/static/assets/images/polkadot-logo.svg"
FAVICON = "/static/assets/images/polkadot-logo.svg"

# Language options (enable language selection in preferences)
BABEL_DEFAULT_LOCALE = "en"
LANGUAGES = {
    "en": {"flag": "us", "name": "English"},
    "zh": {"flag": "cn", "name": "中文"},
    "es": {"flag": "es", "name": "Español"},
    "fr": {"flag": "fr", "name": "Français"},
    "de": {"flag": "de", "name": "Deutsch"},
    "ja": {"flag": "jp", "name": "日本語"},
}

