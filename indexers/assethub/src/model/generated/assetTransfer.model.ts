import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Asset} from "./asset.model"

@Entity_()
export class AssetTransfer {
    constructor(props?: Partial<AssetTransfer>) {
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
     * Extrinsic hash
     */
    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    /**
     * Asset ID
     */
    @Index_()
    @StringColumn_({nullable: false})
    assetId!: string

    /**
     * From address (SS58)
     */
    @Index_()
    @StringColumn_({nullable: false})
    fromSs58!: string

    /**
     * To address (SS58)
     */
    @Index_()
    @StringColumn_({nullable: false})
    toSs58!: string

    /**
     * Transfer amount
     */
    @Index_()
    @BigIntColumn_({nullable: false})
    amount!: bigint

    /**
     * Relationships
     */
    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset
}
