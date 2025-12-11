import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class DailyStat {
    constructor(props?: Partial<DailyStat>) {
        Object.assign(this, props)
    }

    /**
     * Date in YYYY-MM-DD format
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Date
     */
    @Index_()
    @DateTimeColumn_({nullable: false})
    date!: Date

    /**
     * Number of blocks
     */
    @IntColumn_({nullable: false})
    blocksCount!: number

    /**
     * Number of transfers
     */
    @IntColumn_({nullable: false})
    transfersCount!: number

    /**
     * Total transfer volume (DOT only)
     */
    @BigIntColumn_({nullable: false})
    transfersVolume!: bigint

    /**
     * Number of active accounts
     */
    @IntColumn_({nullable: false})
    activeAccounts!: number

    /**
     * Number of new accounts
     */
    @IntColumn_({nullable: false})
    newAccounts!: number
}
