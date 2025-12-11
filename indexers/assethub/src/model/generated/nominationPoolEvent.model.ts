import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {NominationPool} from "./nominationPool.model"

@Entity_()
export class NominationPoolEvent {
    constructor(props?: Partial<NominationPoolEvent>) {
        Object.assign(this, props)
    }

    /**
     * blockNumber-eventIdx
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
     * Event index
     */
    @IntColumn_({nullable: false})
    eventIndex!: number

    /**
     * Event type: Created/Bonded/Unbonded/Withdrawn/PaidOut/StateChanged/etc
     */
    @Index_()
    @StringColumn_({nullable: false})
    eventType!: string

    /**
     * Pool ID
     */
    @Index_()
    @IntColumn_({nullable: true})
    poolId!: number | undefined | null

    /**
     * Account involved
     */
    @Index_()
    @StringColumn_({nullable: true})
    account!: string | undefined | null

    /**
     * Amount (raw)
     */
    @BigIntColumn_({nullable: true})
    amount!: bigint | undefined | null

    /**
     * Era number
     */
    @IntColumn_({nullable: true})
    era!: number | undefined | null

    /**
     * Extra data (JSON)
     */
    @StringColumn_({nullable: true})
    extraData!: string | undefined | null

    /**
     * Relationships
     */
    @Index_()
    @ManyToOne_(() => NominationPool, {nullable: true})
    pool!: NominationPool | undefined | null
}
