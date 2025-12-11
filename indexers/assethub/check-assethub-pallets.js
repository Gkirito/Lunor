// Check AssetHub runtime pallets via RPC
const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
    const provider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io');
    const api = await ApiPromise.create({ provider });

    console.log('✅ Connected to AssetHub');
    console.log(`📊 Chain: ${await api.rpc.system.chain()}`);
    console.log(`🔢 Runtime version: ${api.runtimeVersion.specVersion.toString()}`);

    // Get all pallets
    const metadata = await api.rpc.state.getMetadata();
    const pallets = metadata.asLatest.pallets;

    console.log(`\n📦 Total Pallets: ${pallets.length}\n`);

    // List all pallets
    console.log('Available Pallets:');
    pallets.forEach((pallet, index) => {
        console.log(`  ${index + 1}. ${pallet.name.toString()}`);
    });

    // Check for Staking-related pallets
    console.log('\n🔍 Searching for Staking-related pallets...\n');
    const stakingRelated = pallets.filter(p => {
        const name = p.name.toString().toLowerCase();
        return name.includes('staking') ||
               name.includes('nomination') ||
               name.includes('pool') ||
               name.includes('validator');
    });

    if (stakingRelated.length > 0) {
        console.log('✅ Found Staking-related pallets:');
        stakingRelated.forEach(pallet => {
            console.log(`  - ${pallet.name.toString()}`);

            // Show events if available
            if (pallet.events.isSome) {
                const events = pallet.events.unwrap();
                console.log(`    Events (${events.length}):`);
                events.forEach(event => {
                    console.log(`      * ${event.name.toString()}`);
                });
            }
        });
    } else {
        console.log('❌ No Staking-related pallets found');
    }

    // Check NominationPools specifically
    const nominationPools = pallets.find(p => p.name.toString() === 'NominationPools');
    if (nominationPools) {
        console.log('\n📊 NominationPools Pallet Details:');
        console.log(`  Index: ${nominationPools.index.toString()}`);

        if (nominationPools.events.isSome) {
            const events = nominationPools.events.unwrap();
            console.log(`  Events (${events.length}):`);
            events.forEach(event => {
                console.log(`    - ${event.name.toString()}`);
            });
        }

        if (nominationPools.calls.isSome) {
            const calls = nominationPools.calls.unwrap();
            console.log(`  Calls (${calls.type.path[calls.type.path.length - 1]}):`);
        }

        if (nominationPools.storage.isSome) {
            const storage = nominationPools.storage.unwrap();
            console.log(`  Storage items (${storage.items.length}):`);
            storage.items.forEach(item => {
                console.log(`    - ${item.name.toString()}`);
            });
        }
    } else {
        console.log('\n❌ NominationPools pallet NOT found');
    }

    await api.disconnect();
}

main().catch(console.error);
