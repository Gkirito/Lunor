import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Block} from "./block.model"

@Entity_()
export class Event {
    constructor(props?: Partial<Event>) {
        Object.assign(this, props)
    }

    /**
     * Unique event ID: blockNumber-eventIdx
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
     * Event index within block
     */
    @IntColumn_({nullable: false})
    eventIdx!: number

    /**
     * Extrinsic hash (if event from extrinsic)
     */
    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    /**
     * Pallet name (section)
     */
    @Index_()
    @StringColumn_({nullable: false})
    section!: string

    /**
     * Method name
     */
    @Index_()
    @StringColumn_({nullable: false})
    method!: string

    /**
     * Event data (JSON)
     */
    @StringColumn_({nullable: true})
    data!: string | undefined | null

    /**
     * Relationships
     */
    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block
}
