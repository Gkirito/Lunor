# Superset Configuration

import os
from pathlib import Path
from flask_appbuilder.security.manager import AUTH_DB, AUTH_OAUTH

# Security
SECRET_KEY = os.environ.get('SUPERSET_SECRET_KEY', 'change-this-to-a-long-random-string')

# Database connection for Superset metadata (use sqlite file directly under superset/data)
BASE_DIR = Path(__file__).resolve().parent
TEMPLATES_AUTO_RELOAD = True
SUPERSET_TEMPLATE_OVERRIDE_DIR = BASE_DIR / "data" / "templates"
SQLALCHEMY_DATABASE_URI = f"sqlite:///{(BASE_DIR / 'data' / 'superset.db')}"

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
APP_ICON = "/static/assets/images/lunor_logo.svg"
FAVICON = "/static/assets/images/favicon.svg"
FAVICONS = [{"href": FAVICON}]

# Language options (enable language selection in preferences)
BABEL_DEFAULT_LOCALE = "en"

# Google OAuth login (values taken from environment so secrets stay out of git)
AUTH_TYPE = AUTH_DB
AUTH_USER_REGISTRATION = False
GOOGLE_OAUTH_CLIENT_ID = os.environ.get("GOOGLE_OAUTH_CLIENT_ID", "")
GOOGLE_OAUTH_CLIENT_SECRET = os.environ.get("GOOGLE_OAUTH_CLIENT_SECRET", "")

if GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET:
    AUTH_TYPE = AUTH_OAUTH
    AUTH_USER_REGISTRATION = True
    AUTH_USER_REGISTRATION_ROLE = "Gamma"
    OAUTH_PROVIDERS = [
        {
            "name": "google",
            "icon": "fa-google",
            "token_key": "access_token",
            "remote_app": {
                "client_id": GOOGLE_OAUTH_CLIENT_ID,
                "client_secret": GOOGLE_OAUTH_CLIENT_SECRET,
                "api_base_url": "https://www.googleapis.com/oauth2/v2/",
                "server_metadata_url": "https://accounts.google.com/.well-known/openid-configuration",
                "client_kwargs": {
                    "scope": "openid email profile",
                    "access_type": "offline",
                },
                "authorize_url": "https://accounts.google.com/o/oauth2/auth",
                "access_token_url": "https://oauth2.googleapis.com/token",
            },
        }
    ]

# Disable UI theme administration to force config-defined theme only
ENABLE_UI_THEME_ADMINISTRATION = False
# Default (light) theme tokens
THEME_DEFAULT = {
    "token": {
        "colorPrimary": "#ff2670",
        "colorInfo": "#ff2670",
        "colorLink": "#ff2670",
        "borderRadius": 8,
        "brandLogoAlt": "Lunor",
        "brandLogoUrl": APP_ICON,
    },
     "algorithm": "default",
}

# Force single theme (no dark variant)
THEME_DARK = None
