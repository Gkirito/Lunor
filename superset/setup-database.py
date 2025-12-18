#!/usr/bin/env python3
"""
Superset database setup script for Lunolens
Automatically configures database connections and dashboards
"""

from superset import db
from superset.models.core import Database
import json
import logging
import os
from urllib.parse import urlencode, quote_plus

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_database_connections():
    """Setup database connections for AssetHub"""

    # AssetHub Database Connection
    assethub_db = db.session.query(Database).filter_by(
        database_name='AssetHub'
    ).first()

    if not assethub_db:
        db_user = os.environ.get("DB_USER", "postgres")
        db_pass = os.environ.get("DB_PASS", "")
        db_host = os.environ.get("DB_HOST", "127.0.0.1")
        db_port = os.environ.get("DB_PORT", "5432")
        db_name = os.environ.get("DB_NAME", "lunolens")
        db_ssl = os.environ.get("DB_SSL", "false").lower() == "true"
        db_ssl_reject = os.environ.get("DB_SSL_REJECT_UNAUTHORIZED", "true").lower() == "true"

        query_params = {"options": "-c search_path=assethub"}
        if db_ssl:
            query_params["sslmode"] = "verify-full" if db_ssl_reject else "require"

        query_string = urlencode(query_params)
        sqlalchemy_uri = (
            f"postgresql://{quote_plus(db_user)}:{quote_plus(db_pass)}"
            f"@{db_host}:{db_port}/{db_name}?{query_string}"
        )

        logger.info("Creating AssetHub database connection...")
        assethub_db = Database(
            database_name='AssetHub',
            sqlalchemy_uri=sqlalchemy_uri,
            expose_in_sqllab=True,
            allow_run_async=True,
            allow_ctas=True,
            allow_cvas=True,
            allow_dml=False,  # 只读访问更安全
            extra=json.dumps({
                "metadata_params": {},
                "engine_params": {
                    "connect_args": {
                        "options": "-c search_path=assethub"
                    }
                },
                "metadata_cache_timeout": {},
                "schemas_allowed_for_csv_upload": []
            })
        )
        db.session.add(assethub_db)
        logger.info("✅ AssetHub database connection created")
    else:
        logger.info("⚠️  AssetHub database connection already exists")

    db.session.commit()
    logger.info("🎉 Database setup complete!")

if __name__ == '__main__':
    setup_database_connections()
