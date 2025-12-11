import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_({name: "transfers"})
export class Transfer {
    constructor(props?: Partial<Transfer>) {
        Object.assign(this, props)
    }

    /**
     * Unique transfer ID: blockNumber-eventIdx
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Block number
     */
    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * Block timestamp
     */
    @Index_()
    @DateTimeColumn_({nullable: false})
    blockTime!: Date
    /**
     * Block hash
     */
    @Index_()
    @StringColumn_({nullable: true})
    blockHash!: string | undefined | null
    /**
     * Extrinsic id block-extrinsicIdx
     */
    @Index_()
    @StringColumn_({nullable: true})
    extrinsicId!: string | undefined | null

    /**
     * Extrinsic hash
     */
    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    /**
     * From address (SS58)
     */
    @Index_()
    @StringColumn_({nullable: false})
    fromSs58!: string
    /**
     * From public key (hex)
     */
    @Index_()
    @StringColumn_({nullable: true})
    fromPubkey!: string | undefined | null

    /**
     * To address (SS58)
     */
    @Index_()
    @StringColumn_({nullable: false})
    toSs58!: string
    /**
     * To public key (hex)
     */
    @Index_()
    @StringColumn_({nullable: true})
    toPubkey!: string | undefined | null

    /**
     * Transfer amount (raw)
     */
    @Index_()
    @BigIntColumn_({nullable: false})
    amount!: bigint

    /**
     * Asset ID (null for native DOT)
     */
    @Index_()
    @StringColumn_({nullable: true})
    assetId!: string | undefined | null
    /**
     * Asset symbol if known
     */
    @Index_()
    @StringColumn_({nullable: true})
    symbol!: string | undefined | null
    /**
     * Asset decimals if known
     */
    @IntColumn_({nullable: true})
    decimals!: number | undefined | null

    /**
     * Transfer success
     */
    @BooleanColumn_({nullable: false})
    success!: boolean

    /**
     * Transfer type (native/asset)
     */
    @Index_()
    @StringColumn_({nullable: false})
    transferType!: string
}
