import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Event} from "./event.model"
import {Call} from "./call.model"

@Entity_()
export class Block {
    constructor(props?: Partial<Block>) {
        Object.assign(this, props)
    }

    /**
     * Block hash
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Block number
     */
    @Index_()
    @IntColumn_({nullable: false})
    number!: number

    /**
     * Block timestamp
     */
    @Index_()
    @DateTimeColumn_({nullable: false})
    blockTime!: Date

    /**
     * Parent block hash
     */
    @StringColumn_({nullable: false})
    parentHash!: string
    /**
     * State root
     */
    @StringColumn_({nullable: true})
    stateRoot!: string | undefined | null
    /**
     * Extrinsics root
     */
    @StringColumn_({nullable: true})
    extrinsicsRoot!: string | undefined | null
    /**
     * Block author (validator) SS58
     */
    @Index_()
    @StringColumn_({nullable: true})
    authorSs58!: string | undefined | null

    /**
     * Number of extrinsics in block
     */
    @IntColumn_({nullable: false})
    extrinsicsCount!: number

    /**
     * Number of events in block
     */
    @IntColumn_({nullable: false})
    eventsCount!: number

    /**
     * Relationships
     */
    @OneToMany_(() => Event, e => e.block)
    events!: Event[]

    @OneToMany_(() => Call, e => e.block)
    calls!: Call[]
}
