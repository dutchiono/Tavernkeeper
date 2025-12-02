import { ethers, upgrades } from 'hardhat';
import { updateFrontendAddresses } from './updateFrontend';

/**
 * Query implementation addresses from deployed proxies and update addresses.ts
 * Run this after deployment to fix IMPLEMENTATION_ADDRESSES
 */
async function main() {
    console.log('=== Querying Implementation Addresses ===\n');

    // Get addresses from LOCALHOST_ADDRESSES (these are the proxies)
    const proxyAddresses = {
        KEEP_TOKEN: '0x9b0E42Df8cEf8802C690F9900955aDb04ff41439',
        INVENTORY: '0x0e8af75fb9A1B10a2A4AB1608E5764ca1311f74B',
        ADVENTURER: '0xB944d3417bE71c6a8A8E333C2daA3E48025820F4',
        TAVERNKEEPER: '0xFC1461a94852f10f6A2b784517586EcA1A06D1f6',
        THE_CELLAR: '0x81b3D14992bd61290274C64ac6dD2e9C9675166E',
        CELLAR_ZAP: '0x5f07940934d5263e9083eA63F1a851372AC0cDCC',
    };

    const implementationAddresses: Record<string, string> = {};

    for (const [key, proxyAddress] of Object.entries(proxyAddresses)) {
        try {
            const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
            implementationAddresses[key] = implAddress;
            console.log(`${key}:`);
            console.log(`  Proxy: ${proxyAddress}`);
            console.log(`  Implementation: ${implAddress}`);
            console.log('');
        } catch (error) {
            console.error(`Failed to get implementation for ${key}:`, error);
        }
    }

    // Update frontend addresses
    if (Object.keys(implementationAddresses).length > 0) {
        await updateFrontendAddresses({
            KEEP_TOKEN_IMPL: implementationAddresses.KEEP_TOKEN,
            INVENTORY_IMPL: implementationAddresses.INVENTORY,
            ADVENTURER_IMPL: implementationAddresses.ADVENTURER,
            TAVERNKEEPER_IMPL: implementationAddresses.TAVERNKEEPER,
            THE_CELLAR_IMPL: implementationAddresses.THE_CELLAR,
            CELLAR_ZAP_IMPL: implementationAddresses.CELLAR_ZAP,
        });
        console.log('✅ Implementation addresses updated!');
    } else {
        console.error('❌ No implementation addresses found!');
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
