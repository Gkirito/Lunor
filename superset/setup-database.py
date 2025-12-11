#!/usr/bin/env python3
"""
Superset database setup script for Lunolens
Automatically configures database connections and dashboards
"""

from superset import db
from superset.models.core import Database
import json
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_database_connections():
    """Setup database connections for AssetHub"""

    # AssetHub Database Connection
    assethub_db = db.session.query(Database).filter_by(
        database_name='AssetHub'
    ).first()

    if not assethub_db:
        logger.info("Creating AssetHub database connection...")
        assethub_db = Database(
            database_name='AssetHub',
            sqlalchemy_uri='postgresql://postgres:postgres@postgres:5432/lunolens?options=-csearch_path%3Dassethub',
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
