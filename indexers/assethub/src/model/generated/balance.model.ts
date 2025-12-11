import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Balance {
    constructor(props?: Partial<Balance>) {
        Object.assign(this, props)
    }

    /**
     * assetId-addressSs58
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Asset ID
     */
    @Index_()
    @StringColumn_({nullable: false})
    assetId!: string

    /**
     * Account address (SS58)
     */
    @Index_()
    @StringColumn_({nullable: false})
    addressSs58!: string

    /**
     * Account public key (hex)
     */
    @Index_()
    @StringColumn_({nullable: false})
    addressPubkey!: string

    /**
     * Asset symbol (USDT/USDC/etc)
     */
    @Index_()
    @StringColumn_({nullable: false})
    symbol!: string

    /**
     * Free balance
     */
    @BigIntColumn_({nullable: false})
    free!: bigint

    /**
     * Reserved balance
     */
    @BigIntColumn_({nullable: false})
    reserved!: bigint
    /**
     * Misc frozen balance
     */
    @BigIntColumn_({nullable: true})
    miscFrozen!: bigint | undefined | null
    /**
     * Frozen balance
     */
    @BigIntColumn_({nullable: true})
    frozen!: bigint | undefined | null
    /**
     * Account nonce
     */
    @IntColumn_({nullable: true})
    nonce!: number | undefined | null

    /**
     * Total balance (free + reserved)
     */
    @BigIntColumn_({nullable: false})
    total!: bigint

    /**
     * Last updated timestamp
     */
    @Index_()
    @DateTimeColumn_({nullable: false})
    ts!: Date

    /**
     * Last updated block
     */
    @IntColumn_({nullable: false})
    updatedAtBlock!: number
}
