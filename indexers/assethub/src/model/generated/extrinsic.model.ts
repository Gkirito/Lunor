import {Entity as Entity_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, BooleanColumn as BooleanColumn_, BigIntColumn as BigIntColumn_, Column as Column_} from "@subsquid/typeorm-store"

@Entity_({name: "extrinsic"})
export class Extrinsic {
    constructor(props?: Partial<Extrinsic>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    blockTime!: Date

    @Index_()
    @StringColumn_({nullable: true})
    blockHash!: string | undefined | null

    @Index_()
    @IntColumn_({nullable: false})
    extrinsicIdx!: number

    @Index_()
    @StringColumn_({nullable: true})
    section!: string | undefined | null

    @Index_()
    @StringColumn_({nullable: true})
    method!: string | undefined | null

    @Index_()
    @StringColumn_({nullable: true})
    signerSs58!: string | undefined | null

    @Index_()
    @StringColumn_({nullable: true})
    signerPubkey!: string | undefined | null

    @Index_()
    @BooleanColumn_({nullable: false})
    success!: boolean

    @BigIntColumn_({nullable: true})
    fee!: bigint | undefined | null

    @StringColumn_({nullable: true})
    args!: string | undefined | null
}
