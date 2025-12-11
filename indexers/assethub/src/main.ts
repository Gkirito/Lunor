import {TypeormDatabase, Store} from '@subsquid/typeorm-store'
import {In} from 'typeorm'
import * as ss58 from '@subsquid/ss58'
import assert from 'assert'

import {processor, ProcessorContext, Event, Block as ProcessorBlock} from './processor'
import {
    Block,
    Event as EventEntity,
    Call,
    Transfer,
    Asset,
    Account,
    DailyStat,
    Balance,
    Extrinsic
} from './model'

const ASSETHUB_PREFIX = 0 // AssetHub uses Polkadot prefix (0)

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    // Process all blocks, events, and calls
    const blocks: Block[] = []
    const events: EventEntity[] = []
    const calls: Call[] = []
    const transfers: Transfer[] = []
    const assets: Map<string, Asset> = new Map()
    const accounts: Map<string, Account> = new Map()
    const balances: Map<string, Balance> = new Map()
    const extrinsics: Map<string, Extrinsic> = new Map()

    for (const block of ctx.blocks) {
        assert(block.header.timestamp, `Block ${block.header.height} has no timestamp`)

        const blockTime = new Date(block.header.timestamp)
        const blockEntity = new Block({
            id: block.header.hash,
            number: block.header.height,
            blockTime: blockTime,
            parentHash: block.header.parentHash,
            stateRoot: (block.header as any).stateRoot,
            extrinsicsRoot: (block.header as any).extrinsicsRoot,
            authorSs58: block.header.validator ? ss58.codec(ASSETHUB_PREFIX).encode(block.header.validator) : null,
            extrinsicsCount: 0,
            eventsCount: block.events.length,
        })
        blocks.push(blockEntity)

        // Count extrinsics
        const extrinsicHashes = new Set<string>()
        for (const event of block.events) {
            if (event.extrinsic?.hash) {
                extrinsicHashes.add(event.extrinsic.hash)
            }
        }
        blockEntity.extrinsicsCount = extrinsicHashes.size

        // Process events
        for (let i = 0; i < block.events.length; i++) {
            const event = block.events[i]
            const eventEntity = new EventEntity({
                id: `${block.header.height}-${i}`,
                blockNumber: block.header.height,
                blockTime: blockTime,
                eventIdx: i,
                extrinsicHash: event.extrinsic?.hash,
                section: event.name.split('.')[0],
                method: event.name.split('.')[1],
                data: JSON.stringify(event.args),
                block: blockEntity,
            })
            events.push(eventEntity)

            const eventExtrinsicId = event.extrinsic ? `${block.header.height}-${event.extrinsic.index || 0}` : undefined
            // Process specific events
            await processEvent(event, block.header.height, blockTime, i, block.header.hash, eventExtrinsicId, {
                transfers,
                assets,
                accounts,
                balances,
                store: ctx.store,
            })
        }

        // Process calls
        for (const call of block.calls) {
            if (!call.extrinsic) continue

            const extrinsicHash = call.extrinsic.hash || call.extrinsic.id
            if (!extrinsics.has(extrinsicHash)) {
                extrinsics.set(
                    extrinsicHash,
                    new Extrinsic({
                        id: extrinsicHash,
                        blockNumber: block.header.height,
                        blockTime: blockTime,
                        blockHash: block.header.hash,
                        extrinsicIdx: call.extrinsic.index || 0,
                        section: call.name.split('.')[0],
                        method: call.name.split('.')[1],
                        signerSs58: getSignerAddress(call.extrinsic.signature),
                        signerPubkey: getSignerPubkey(call.extrinsic.signature),
                        success: call.extrinsic.success || false,
                        fee: call.extrinsic.fee ? BigInt(call.extrinsic.fee) : null,
                        args: JSON.stringify(call.args),
                    })
                )
            }

            const callIdx = call.address.length > 0 ? call.address[call.address.length - 1] : 0
            const callEntity = new Call({
                id: call.id,
                blockNumber: block.header.height,
                blockTime: blockTime,
                extrinsicIdx: call.extrinsic.index || 0,
                callIdx: callIdx,
                extrinsicHash: call.extrinsic.hash,
                callSection: call.name.split('.')[0],
                callMethod: call.name.split('.')[1],
                signerSs58: getSignerAddress(call.extrinsic.signature),
                success: call.extrinsic.success || false,
                args: JSON.stringify(call.args),
                block: blockEntity,
            })
            calls.push(callEntity)

            // Track account activity
            const signer = callEntity.signerSs58
            if (signer) {
                await trackAccount(signer, block.header.height, blockTime, accounts)
            }
        }
    }

    // Save all data
    await ctx.store.upsert(blocks)
    await ctx.store.upsert(events)
    if (extrinsics.size > 0) {
        await ctx.store.upsert([...extrinsics.values()])
    }
    await ctx.store.upsert(calls)
    await ctx.store.upsert(transfers)

    if (assets.size > 0) {
        await ctx.store.upsert([...assets.values()])
    }

    if (accounts.size > 0) {
        await ctx.store.upsert([...accounts.values()])
    }

    if (balances.size > 0) {
        await ctx.store.upsert([...balances.values()])
    }

    ctx.log.info(`Processed ${ctx.blocks.length} blocks, ${events.length} events, ${transfers.length} transfers, ${balances.size} balance updates`)
})

interface ProcessEventContext {
    transfers: Transfer[]
    assets: Map<string, Asset>
    accounts: Map<string, Account>
    balances: Map<string, Balance>
    store: any
}

async function processEvent(
    event: Event,
    blockHeight: number,
    blockTime: Date,
    eventIdx: number,
    blockHash: string,
    extrinsicId: string | undefined,
    context: ProcessEventContext
) {
    const eventName = event.name

    // Process Balances.Transfer (native DOT transfers)
    if (eventName === 'Balances.Transfer') {
        const {from, to, amount} = decodeBalancesTransfer(event)
        const fromSs58 = ss58.codec(ASSETHUB_PREFIX).encode(from)
        const toSs58 = ss58.codec(ASSETHUB_PREFIX).encode(to)

        context.transfers.push(new Transfer({
            id: `${blockHeight}-${eventIdx}`,
            blockNumber: blockHeight,
            blockTime: blockTime,
            blockHash: blockHash,
            extrinsicId: extrinsicId,
            extrinsicHash: event.extrinsic?.hash,
            fromSs58: fromSs58,
            fromPubkey: toHexPubkey(from),
            toSs58: toSs58,
            toPubkey: toHexPubkey(to),
            amount: amount,
            assetId: null,
            success: true,
            transferType: 'native',
        }))

        await trackAccount(fromSs58, blockHeight, blockTime, context.accounts)
        await trackAccount(toSs58, blockHeight, blockTime, context.accounts)
    }

    // Process Assets.Created
    if (eventName === 'Assets.Created') {
        const {assetId, creator, owner} = decodeAssetsCreated(event)
        const ownerSs58 = ss58.codec(ASSETHUB_PREFIX).encode(owner)

        context.assets.set(assetId.toString(), new Asset({
            id: assetId.toString(),
            name: null,
            symbol: null,
            decimals: 0,
            owner: ownerSs58,
            supply: 0n,
            holders: 0,
            isSufficient: false,
            createdAt: blockTime,
            createdAtBlock: blockHeight,
        }))
    }

    // Process Assets.Transferred
    if (eventName === 'Assets.Transferred') {
        const {assetId, from, to, amount} = decodeAssetsTransferred(event)
        const fromSs58 = ss58.codec(ASSETHUB_PREFIX).encode(from)
        const toSs58 = ss58.codec(ASSETHUB_PREFIX).encode(to)

        const asset = context.assets.get(assetId.toString())

        // Add to transfers table
        context.transfers.push(new Transfer({
            id: `${blockHeight}-${eventIdx}-asset`,
            blockNumber: blockHeight,
            blockTime: blockTime,
            blockHash: blockHash,
            extrinsicId: extrinsicId,
            extrinsicHash: event.extrinsic?.hash,
            fromSs58: fromSs58,
            fromPubkey: toHexPubkey(from),
            toSs58: toSs58,
            toPubkey: toHexPubkey(to),
            amount: amount,
            assetId: assetId.toString(),
            symbol: asset?.symbol,
            success: true,
            transferType: 'asset',
        }))

        // Update balances
        await updateBalance(
            context.balances,
            assetId.toString(),
            fromSs58,
            -amount,
            asset?.symbol || '',
            blockHeight,
            blockTime,
            context.store
        )
        await updateBalance(
            context.balances,
            assetId.toString(),
            toSs58,
            amount,
            asset?.symbol || '',
            blockHeight,
            blockTime,
            context.store
        )

        await trackAccount(fromSs58, blockHeight, blockTime, context.accounts)
        await trackAccount(toSs58, blockHeight, blockTime, context.accounts)
    }

    // Process Assets.MetadataSet
    if (eventName === 'Assets.MetadataSet') {
        const {assetId, name, symbol, decimals} = decodeAssetsMetadataSet(event)
        const asset = context.assets.get(assetId.toString())
        if (asset) {
            asset.name = name
            asset.symbol = symbol
            asset.decimals = decimals
        }
    }

    // Log NominationPools events (temporary - for testing)
    if (eventName.startsWith('NominationPools.')) {
        console.log(`📊 Found ${eventName} at block ${blockHeight}, event ${eventIdx}`)
        console.log(`   Data:`, JSON.stringify(event.args, null, 2))
    }
}

async function updateBalance(
    balances: Map<string, Balance>,
    assetId: string,
    address: string,
    delta: bigint,
    symbol: string,
    blockNumber: number,
    blockTime: Date,
    store: any
) {
    const balanceId = `${assetId}-${address}`
    let balance = balances.get(balanceId)

    if (!balance) {
        // Load existing balance from database
        balance = await store.get(Balance, balanceId)

        if (!balance) {
            // Create new balance entry
            balance = new Balance({
                id: balanceId,
                assetId: assetId,
                addressSs58: address,
                addressPubkey: '0x' + Buffer.from(ss58.codec(ASSETHUB_PREFIX).decode(address)).toString('hex'),
                symbol: symbol,
                free: 0n,
                reserved: 0n,
                total: 0n,
                ts: blockTime,
                updatedAtBlock: blockNumber,
            })
        }
    }

    // Update balance
    balance.free = balance.free + delta
    balance.total = balance.free + balance.reserved
    balance.ts = blockTime
    balance.updatedAtBlock = blockNumber

    balances.set(balanceId, balance)
}

async function trackAccount(
    address: string,
    blockNumber: number,
    blockTime: Date,
    accounts: Map<string, Account>
) {
    let account = accounts.get(address)
    if (!account) {
        account = new Account({
            id: address,
            firstSeenBlock: blockNumber,
            firstSeenAt: blockTime,
            lastActiveBlock: blockNumber,
            lastActiveAt: blockTime,
            txCount: 1,
        })
        accounts.set(address, account)
    } else {
        account.lastActiveBlock = blockNumber
        account.lastActiveAt = blockTime
        account.txCount += 1
    }
}

function getSignerAddress(signature: any): string | undefined {
    if (!signature?.address) return undefined

    if (typeof signature.address === 'string') {
        return signature.address
    }

    if (signature.address.value) {
        return ss58.codec(ASSETHUB_PREFIX).encode(signature.address.value)
    }

    return undefined
}

function getSignerPubkey(signature: any): string | undefined {
    if (!signature?.address) return undefined

    if (signature.address.value && signature.address.value instanceof Uint8Array) {
        return '0x' + Buffer.from(signature.address.value).toString('hex')
    }

    if (Array.isArray(signature.address) && signature.address.length === 32) {
        return '0x' + Buffer.from(signature.address).toString('hex')
    }

    return undefined
}

function toHexPubkey(bytes: Uint8Array): string {
    return '0x' + Buffer.from(bytes).toString('hex')
}

// Event decoder functions
function decodeBalancesTransfer(event: Event): {from: Uint8Array, to: Uint8Array, amount: bigint} {
    // Support multiple runtime versions
    const args = event.args as any

    if (args.from && args.to && args.amount !== undefined) {
        return {
            from: decodeAddress(args.from),
            to: decodeAddress(args.to),
            amount: BigInt(args.amount)
        }
    }

    // Fallback to array format [from, to, amount]
    if (Array.isArray(args) && args.length >= 3) {
        return {
            from: decodeAddress(args[0]),
            to: decodeAddress(args[1]),
            amount: BigInt(args[2])
        }
    }

    throw new Error('Unknown Balances.Transfer event format')
}

function decodeAssetsCreated(event: Event): {assetId: number, creator: Uint8Array, owner: Uint8Array} {
    const args = event.args as any
    return {
        assetId: Number(args.assetId || args[0]),
        creator: decodeAddress(args.creator || args[1]),
        owner: decodeAddress(args.owner || args[2])
    }
}

function decodeAssetsTransferred(event: Event): {assetId: number, from: Uint8Array, to: Uint8Array, amount: bigint} {
    const args = event.args as any
    return {
        assetId: Number(args.assetId || args[0]),
        from: decodeAddress(args.from || args[1]),
        to: decodeAddress(args.to || args[2]),
        amount: BigInt(args.amount || args[3])
    }
}

function decodeAssetsMetadataSet(event: Event): {assetId: number, name: string, symbol: string, decimals: number} {
    const args = event.args as any
    return {
        assetId: Number(args.assetId || args[0]),
        name: String(args.name || args[1] || ''),
        symbol: String(args.symbol || args[2] || ''),
        decimals: Number(args.decimals || args[3] || 0)
    }
}

function decodeAddress(addr: any): Uint8Array {
    if (addr instanceof Uint8Array) {
        return addr
    }
    if (typeof addr === 'string') {
        // Convert hex string to Uint8Array
        if (addr.startsWith('0x')) {
            const hex = addr.substring(2)
            const bytes = new Uint8Array(hex.length / 2)
            for (let i = 0; i < hex.length; i += 2) {
                bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16)
            }
            return bytes
        }
        // Already SS58 string, need to encode to bytes first
        // Since we just need the pubkey, let's assume it's already a pubkey
        throw new Error(`String address not expected here: ${addr}`)
    }
    if (addr.value && addr.value instanceof Uint8Array) {
        return addr.value
    }
    if (addr.__kind === 'Id' && addr.value) {
        return decodeAddress(addr.value)
    }
    if (Array.isArray(addr) && addr.length === 32) {
        return new Uint8Array(addr)
    }
    throw new Error(`Unknown address format: ${JSON.stringify(addr)}`)
}
