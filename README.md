# Lunor (AssetHub analytics)

Polkadot AssetHub analytics stack for a small test deployment: Subsquid indexer + Postgres + Superset frontend.

## Quick start
1) Start DB + Superset (Docker required):
```bash
npm run db:up         # docker-compose up -d postgres
npm run superset:up   # docker-compose up -d superset
# Open http://localhost:8088, admin / admin (created by init script)
```

2) Run the AssetHub indexer (local Node):
```bash
cd indexers/assethub
npm install      # first time
npm run build    # tsc build
# Tweak .env (RPC/ARCHIVE, START_BLOCK, etc.); we often use START_BLOCK=8000000
PGOPTIONS='-c search_path=assethub' START_BLOCK=8000000 npm run process
```
The indexer writes into the `assethub` schema in Postgres.

## Components
- Postgres: container `lunor-postgres`, port 5432, default user/pass `postgres/postgres`, schemas `assethub`, `squid_processor` (internal).
- Superset: container `lunor-superset`, port 8088. Config in `superset/superset_config.py`, init script `superset/init-superset.sh` (creates admin and preconfigures the DB connection).
- Indexer: `indexers/assethub` (Subsquid), entry `src/main.ts`, schema `schema.graphql` + generated models.

## Tables (assethub)
- `block`: basic block info (state_root / extrinsics_root / author_ss58)
- `event`: events (with extrinsic_hash)
- `extrinsic`: extrinsics (section/method, signer, fee, args)
- `call`: call stack (extrinsicIdx/callIdx, signer, args)
- `transfers`: DOT and asset transfers (block_hash, extrinsic_id/hash, from/to, pubkeys, symbol/decimals)
- `asset`: asset metadata (creation tracked; later metadata can be added)
- `balance`: account asset balances (free/reserved/frozen/misc_frozen/nonce, updated at block)
- Aggregates: `daily_stat` etc.

## Common commands
Root:
```bash
npm run db:up          # start Postgres
npm run superset:up    # start Superset
```
Indexer (`indexers/assethub`):
```bash
npm run build          # build
npm run process        # run processor (uses .env, START_BLOCK configurable)
npm run serve          # GraphQL service (if needed)
```

## Superset tips
- Login: http://localhost:8088, admin / admin (change password/secret for prod)
- If new columns are missing: Datasets → Edit → “Sync columns from source”
- SQL connection (inside container): Host `postgres`, Port `5432`, DB `lunolens`, User/Pass `postgres/postgres`, Schema `assethub`

## Notes
- Only AssetHub is ingested.
- Indexer uses upsert to avoid PK conflicts on replays. Catching up from block 8,000,000 can take time.

## 🎨 Creating Dashboards
1. Go to http://localhost:8088
2. Login with admin/admin
3. Add database connection:
   - Database: PostgreSQL
   - SQLAlchemy URI: `postgresql://postgres:postgres@postgres:5432/lunolens`
4. Create datasets from tables
5. Build charts and dashboards

## 📈 Monitoring
### Check indexer progress
```bash
# View logs
docker-compose logs -f postgres

# Connect to database
docker exec -it lunor-postgres psql -U postgres -d lunolens

# Check row counts
SELECT 'blocks', COUNT(*) FROM assethub.block
UNION ALL
SELECT 'transfers', COUNT(*) FROM assethub.transfers
UNION ALL
SELECT 'assets', COUNT(*) FROM assethub.asset;
```

## 🐛 Troubleshooting
### Docker not running
```bash
# Start Docker Desktop
# Then retry: docker-compose up -d postgres
```
### Database connection refused
```bash
docker ps | grep postgres
docker-compose logs postgres
```
### Indexer errors
```bash
cat indexers/assethub/.env
cd indexers/assethub && npm run build
```

## 📚 Resources
- [Subsquid Documentation](https://docs.subsquid.io/)
- [Dune Analytics Polkadot Tables](https://docs.dune.com/data-catalog/substrate/overview)
- [Apache Superset Documentation](https://superset.apache.org/docs/intro)

## 📄 License
MIT

## 👥 Contributing
This is an MVP project. Contributions welcome after initial release.
