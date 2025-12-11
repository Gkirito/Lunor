module.exports = class ExtendTransfersExtrinsics1764990000000 {
    name = 'ExtendTransfersExtrinsics1764990000000'

    async up(db) {
        await db.query(`CREATE TABLE "extrinsic" (
            "id" character varying NOT NULL,
            "block_number" integer NOT NULL,
            "block_time" TIMESTAMP WITH TIME ZONE NOT NULL,
            "block_hash" text,
            "extrinsic_idx" integer NOT NULL,
            "section" text,
            "method" text,
            "signer_ss58" text,
            "signer_pubkey" text,
            "success" boolean NOT NULL,
            "fee" numeric,
            "args" text,
            CONSTRAINT "PK_extrinsic" PRIMARY KEY ("id")
        )`);
        await db.query(`CREATE INDEX "IDX_extrinsic_block_number" ON "extrinsic" ("block_number")`);
        await db.query(`CREATE INDEX "IDX_extrinsic_block_time" ON "extrinsic" ("block_time")`);
        await db.query(`CREATE INDEX "IDX_extrinsic_section" ON "extrinsic" ("section")`);
        await db.query(`CREATE INDEX "IDX_extrinsic_method" ON "extrinsic" ("method")`);
        await db.query(`CREATE INDEX "IDX_extrinsic_signer_ss58" ON "extrinsic" ("signer_ss58")`);

        await db.query(`ALTER TABLE "transfers" ADD COLUMN IF NOT EXISTS "block_hash" text`);
        await db.query(`ALTER TABLE "transfers" ADD COLUMN IF NOT EXISTS "extrinsic_id" text`);
        await db.query(`ALTER TABLE "transfers" ADD COLUMN IF NOT EXISTS "from_pubkey" text`);
        await db.query(`ALTER TABLE "transfers" ADD COLUMN IF NOT EXISTS "to_pubkey" text`);
        await db.query(`ALTER TABLE "transfers" ADD COLUMN IF NOT EXISTS "symbol" text`);
        await db.query(`ALTER TABLE "transfers" ADD COLUMN IF NOT EXISTS "decimals" integer`);
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_transfer_block_hash" ON "transfers" ("block_hash")`);
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_transfer_extrinsic_id" ON "transfers" ("extrinsic_id")`);
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_transfer_from_pubkey" ON "transfers" ("from_pubkey")`);
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_transfer_to_pubkey" ON "transfers" ("to_pubkey")`);
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_transfer_symbol" ON "transfers" ("symbol")`);
    }

    async down(db) {
        await db.query(`DROP TABLE "extrinsic"`);
        await db.query(`DROP INDEX IF EXISTS "assethub"."IDX_transfer_block_hash"`);
        await db.query(`DROP INDEX IF EXISTS "assethub"."IDX_transfer_extrinsic_id"`);
        await db.query(`DROP INDEX IF EXISTS "assethub"."IDX_transfer_from_pubkey"`);
        await db.query(`DROP INDEX IF EXISTS "assethub"."IDX_transfer_to_pubkey"`);
        await db.query(`DROP INDEX IF EXISTS "assethub"."IDX_transfer_symbol"`);
        await db.query(`ALTER TABLE "transfers" DROP COLUMN IF EXISTS "block_hash"`);
        await db.query(`ALTER TABLE "transfers" DROP COLUMN IF EXISTS "extrinsic_id"`);
        await db.query(`ALTER TABLE "transfers" DROP COLUMN IF EXISTS "from_pubkey"`);
        await db.query(`ALTER TABLE "transfers" DROP COLUMN IF EXISTS "to_pubkey"`);
        await db.query(`ALTER TABLE "transfers" DROP COLUMN IF EXISTS "symbol"`);
        await db.query(`ALTER TABLE "transfers" DROP COLUMN IF EXISTS "decimals"`);
    }
}
