import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {AssetTransfer} from "./assetTransfer.model"

@Entity_()
export class Asset {
    constructor(props?: Partial<Asset>) {
        Object.assign(this, props)
    }

    /**
     * Asset ID
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Asset name
     */
    @StringColumn_({nullable: true})
    name!: string | undefined | null

    /**
     * Asset symbol
     */
    @StringColumn_({nullable: true})
    symbol!: string | undefined | null

    /**
     * Asset decimals
     */
    @IntColumn_({nullable: false})
    decimals!: number

    /**
     * Asset owner
     */
    @StringColumn_({nullable: false})
    owner!: string

    /**
     * Total supply
     */
    @BigIntColumn_({nullable: false})
    supply!: bigint

    /**
     * Number of holders
     */
    @IntColumn_({nullable: false})
    holders!: number

    /**
     * Is sufficient asset
     */
    @BooleanColumn_({nullable: false})
    isSufficient!: boolean

    /**
     * Creation timestamp
     */
    @Index_()
    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    /**
     * Creation block number
     */
    @Index_()
    @IntColumn_({nullable: false})
    createdAtBlock!: number

    /**
     * Relationships
     */
    @OneToMany_(() => AssetTransfer, e => e.asset)
    transfers!: AssetTransfer[]
}
