import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {NominationPool} from "./nominationPool.model"

@Entity_()
export class NominationPoolMember {
    constructor(props?: Partial<NominationPoolMember>) {
        Object.assign(this, props)
    }

    /**
     * poolId-accountId
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Pool ID
     */
    @Index_()
    @IntColumn_({nullable: false})
    poolId!: number

    /**
     * Member account address
     */
    @Index_()
    @StringColumn_({nullable: false})
    account!: string

    /**
     * Member points (shares)
     */
    @BigIntColumn_({nullable: false})
    points!: bigint

    /**
     * Unbonding eras info (JSON)
     */
    @StringColumn_({nullable: true})
    unbondingEras!: string | undefined | null

    /**
     * Joined timestamp
     */
    @DateTimeColumn_({nullable: false})
    joinedAt!: Date

    /**
     * Joined block
     */
    @IntColumn_({nullable: false})
    joinedAtBlock!: number

    /**
     * Last action timestamp
     */
    @DateTimeColumn_({nullable: false})
    lastActionAt!: Date

    /**
     * Last action block
     */
    @IntColumn_({nullable: false})
    lastActionBlock!: number

    /**
     * Relationships
     */
    @Index_()
    @ManyToOne_(() => NominationPool, {nullable: true})
    pool!: NominationPool
}
