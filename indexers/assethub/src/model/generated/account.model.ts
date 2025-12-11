import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    /**
     * Account address (SS58)
     */
    @PrimaryColumn_()
    id!: string

    /**
     * First seen block
     */
    @IntColumn_({nullable: false})
    firstSeenBlock!: number

    /**
     * First seen timestamp
     */
    @DateTimeColumn_({nullable: false})
    firstSeenAt!: Date

    /**
     * Last active block
     */
    @IntColumn_({nullable: false})
    lastActiveBlock!: number

    /**
     * Last active timestamp
     */
    @DateTimeColumn_({nullable: false})
    lastActiveAt!: Date

    /**
     * Total transactions count
     */
    @IntColumn_({nullable: false})
    txCount!: number
}
