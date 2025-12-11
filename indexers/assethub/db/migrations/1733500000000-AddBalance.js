module.exports = class AddBalance1733500000000 {
    name = 'AddBalance1733500000000'

    async up(db) {
        await db.query(`
            CREATE TABLE "balance" (
                "id" character varying NOT NULL,
                "asset_id" character varying NOT NULL,
                "address_ss58" text NOT NULL,
                "address_pubkey" text NOT NULL,
                "symbol" text NOT NULL,
                "free" numeric NOT NULL,
                "reserved" numeric NOT NULL,
                "total" numeric NOT NULL,
                "ts" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updated_at_block" integer NOT NULL,
                CONSTRAINT "PK_balance" PRIMARY KEY ("id")
            )
        `)

        await db.query(`CREATE INDEX "IDX_balance_asset_id" ON "balance" ("asset_id")`)
        await db.query(`CREATE INDEX "IDX_balance_address_ss58" ON "balance" ("address_ss58")`)
        await db.query(`CREATE INDEX "IDX_balance_address_pubkey" ON "balance" ("address_pubkey")`)
        await db.query(`CREATE INDEX "IDX_balance_symbol" ON "balance" ("symbol")`)
        await db.query(`CREATE INDEX "IDX_balance_ts" ON "balance" ("ts")`)
        await db.query(`CREATE INDEX "IDX_balance_asset_address" ON "balance" ("asset_id", "address_ss58")`)
    }

    async down(db) {
        await db.query(`DROP INDEX "assethub"."IDX_balance_asset_id"`)
        await db.query(`DROP INDEX "assethub"."IDX_balance_address_ss58"`)
        await db.query(`DROP INDEX "assethub"."IDX_balance_address_pubkey"`)
        await db.query(`DROP INDEX "assethub"."IDX_balance_symbol"`)
        await db.query(`DROP INDEX "assethub"."IDX_balance_ts"`)
        await db.query(`DROP INDEX "assethub"."IDX_balance_asset_address"`)
        await db.query(`DROP TABLE "balance"`)
    }
}
