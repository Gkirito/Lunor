import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Block} from "./block.model"

@Entity_()
export class Call {
    constructor(props?: Partial<Call>) {
        Object.assign(this, props)
    }

    /**
     * Unique call ID: blockNumber-extrinsicIdx-callIdx
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
     * Extrinsic index
     */
    @IntColumn_({nullable: false})
    extrinsicIdx!: number

    /**
     * Call index within extrinsic
     */
    @IntColumn_({nullable: false})
    callIdx!: number

    /**
     * Extrinsic hash
     */
    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    /**
     * Pallet name
     */
    @Index_()
    @StringColumn_({nullable: false})
    callSection!: string

    /**
     * Method name
     */
    @Index_()
    @StringColumn_({nullable: false})
    callMethod!: string

    /**
     * Signer address (SS58)
     */
    @Index_()
    @StringColumn_({nullable: true})
    signerSs58!: string | undefined | null

    /**
     * Call success status
     */
    @Index_()
    @BooleanColumn_({nullable: false})
    success!: boolean

    /**
     * Call arguments (JSON)
     */
    @StringColumn_({nullable: true})
    args!: string | undefined | null

    /**
     * Relationships
     */
    @Index_()
    @ManyToOne_(() => Block, {nullable: true})
    block!: Block
}
