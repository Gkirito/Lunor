module.exports = class ExtendBlockBalance1764990500000 {
    name = 'ExtendBlockBalance1764990500000'

    async up(db) {
        await db.query(`ALTER TABLE "block" ADD COLUMN IF NOT EXISTS "state_root" text`);
        await db.query(`ALTER TABLE "block" ADD COLUMN IF NOT EXISTS "extrinsics_root" text`);
        await db.query(`ALTER TABLE "block" ADD COLUMN IF NOT EXISTS "author_ss58" text`);
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_block_author_ss58" ON "block" ("author_ss58")`);

        await db.query(`ALTER TABLE "balance" ADD COLUMN IF NOT EXISTS "misc_frozen" numeric`);
        await db.query(`ALTER TABLE "balance" ADD COLUMN IF NOT EXISTS "frozen" numeric`);
        await db.query(`ALTER TABLE "balance" ADD COLUMN IF NOT EXISTS "nonce" integer`);
    }

    async down(db) {
        await db.query(`DROP INDEX IF EXISTS "assethub"."IDX_block_author_ss58"`);
        await db.query(`ALTER TABLE "block" DROP COLUMN IF EXISTS "state_root"`);
        await db.query(`ALTER TABLE "block" DROP COLUMN IF EXISTS "extrinsics_root"`);
        await db.query(`ALTER TABLE "block" DROP COLUMN IF EXISTS "author_ss58"`);
        await db.query(`ALTER TABLE "balance" DROP COLUMN IF EXISTS "misc_frozen"`);
        await db.query(`ALTER TABLE "balance" DROP COLUMN IF EXISTS "frozen"`);
        await db.query(`ALTER TABLE "balance" DROP COLUMN IF EXISTS "nonce"`);
    }
}

