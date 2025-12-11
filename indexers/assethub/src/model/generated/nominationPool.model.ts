import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {NominationPoolMember} from "./nominationPoolMember.model"
import {NominationPoolEvent} from "./nominationPoolEvent.model"
import {NominationPoolSnapshot} from "./nominationPoolSnapshot.model"

@Entity_()
export class NominationPool {
    constructor(props?: Partial<NominationPool>) {
        Object.assign(this, props)
    }

    /**
     * Pool ID
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Pool name/metadata
     */
    @StringColumn_({nullable: true})
    metadata!: string | undefined | null

    /**
     * Pool state: Open/Blocked/Destroying
     */
    @Index_()
    @StringColumn_({nullable: false})
    state!: string

    /**
     * Total staked amount (raw, Planck)
     */
    @Index_()
    @BigIntColumn_({nullable: false})
    totalStaked!: bigint

    /**
     * Number of members
     */
    @IntColumn_({nullable: false})
    memberCount!: number

    /**
     * Current commission (1e7 = 1%)
     */
    @BigIntColumn_({nullable: true})
    commissionCurrent!: bigint | undefined | null

    /**
     * Maximum commission
     */
    @BigIntColumn_({nullable: true})
    commissionMax!: bigint | undefined | null

    /**
     * Commission change rate
     */
    @BigIntColumn_({nullable: true})
    commissionChangeRate!: bigint | undefined | null

    /**
     * Root account
     */
    @StringColumn_({nullable: false})
    rootAccount!: string

    /**
     * Nominator account
     */
    @StringColumn_({nullable: true})
    nominatorAccount!: string | undefined | null

    /**
     * Bouncer account
     */
    @StringColumn_({nullable: true})
    bouncerAccount!: string | undefined | null

    /**
     * Creation timestamp
     */
    @Index_()
    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    /**
     * Creation block number
     */
    @IntColumn_({nullable: false})
    createdAtBlock!: number

    /**
     * Last update timestamp
     */
    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    /**
     * Last update block
     */
    @IntColumn_({nullable: false})
    updatedAtBlock!: number

    /**
     * Relationships
     */
    @OneToMany_(() => NominationPoolMember, e => e.pool)
    members!: NominationPoolMember[]

    @OneToMany_(() => NominationPoolEvent, e => e.pool)
    events!: NominationPoolEvent[]

    @OneToMany_(() => NominationPoolSnapshot, e => e.pool)
    snapshots!: NominationPoolSnapshot[]
}
