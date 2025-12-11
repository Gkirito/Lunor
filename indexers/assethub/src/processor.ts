import {assertNotNull} from '@subsquid/util-internal'
import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'

export const processor = new SubstrateBatchProcessor()
    // AssetHub Archive
    .setGateway(assertNotNull(process.env.ARCHIVE_ENDPOINT, 'No archive endpoint supplied'))
    // AssetHub RPC endpoint
    .setRpcEndpoint({
        url: assertNotNull(process.env.RPC_ENDPOINT_HTTP, 'No RPC endpoint supplied'),
        rateLimit: 10
    })
    // Allow overriding start block to avoid full replay when backfilling incrementally
    .setBlockRange({from: Number(process.env.START_BLOCK ?? 0)})
    // Listen to all necessary events for AssetHub
    .addEvent({
        name: [
            // Balances & Assets
            'Balances.Transfer',
            'Assets.Transferred',
            'Assets.Created',
            'Assets.Destroyed',
            'Assets.MetadataSet',

            // System
            'System.ExtrinsicSuccess',
            'System.ExtrinsicFailed',

            // NominationPools (Staking) - lowercase pallet name
            'nominationPools.Created',
            'nominationPools.Bonded',
            'nominationPools.Unbonded',
            'nominationPools.Withdrawn',
            'nominationPools.PaidOut',
            'nominationPools.StateChanged',
            'nominationPools.MemberRemoved',
            'nominationPools.PoolSlashed',
            'nominationPools.PoolCommissionUpdated',
            'nominationPools.PoolCommissionChangeRateUpdated',
            'nominationPools.PoolMaxCommissionUpdated',
        ],
        extrinsic: true,
    })
    .addCall({
        extrinsic: true,
    })
    .setFields({
        event: {
            args: true,
            indexInBlock: true,
            phase: true,
        },
        call: {
            args: true,
            origin: true,
        },
        extrinsic: {
            hash: true,
            fee: true,
            success: true,
            error: true,
            signature: true,
            version: true,
        },
        block: {
            timestamp: true,
            validator: true,
            stateRoot: true,
            extrinsicsRoot: true,
        }
    })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
