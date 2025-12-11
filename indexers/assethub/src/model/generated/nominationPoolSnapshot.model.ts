import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, DateTimeColumn as DateTimeColumn_, Index as Index_, IntColumn as IntColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {NominationPool} from "./nominationPool.model"

@Entity_()
export class NominationPoolSnapshot {
    constructor(props?: Partial<NominationPoolSnapshot>) {
        Object.assign(this, props)
    }

    /**
     * date-poolId
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Snapshot date
     */
    @Index_()
    @DateTimeColumn_({nullable: false})
    snapshotTime!: Date

    /**
     * Pool ID
     */
    @Index_()
    @IntColumn_({nullable: false})
    poolId!: number

    /**
     * Pool state at snapshot
     */
    @StringColumn_({nullable: false})
    state!: string

    /**
     * Total staked at snapshot
     */
    @BigIntColumn_({nullable: false})
    totalStaked!: bigint

    /**
     * Member count at snapshot
     */
    @IntColumn_({nullable: false})
    memberCount!: number

    /**
     * Commission at snapshot
     */
    @BigIntColumn_({nullable: true})
    commissionCurrent!: bigint | undefined | null

    /**
     * Relationships
     */
    @Index_()
    @ManyToOne_(() => NominationPool, {nullable: true})
    pool!: NominationPool
}
