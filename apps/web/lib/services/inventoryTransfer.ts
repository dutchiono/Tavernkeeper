/**
 * Inventory Transfer Service
 * Handles transferring items between TBAs (unequip/equip)
 */

import { type Address, type PublicClient, type WalletClient } from 'viem';
import { getAdventurerTBA, getTavernKeeperTBA } from '../inventory';
import { estimateTransferGas } from './gasEstimator';

export interface TransferItemParams {
  chainId: number;
  inventoryContract: Address;
  itemId: bigint;
  amount: bigint;
  fromType: 'adventurer' | 'tavernkeeper';
  fromContract: Address;
  fromTokenId: bigint;
  toType: 'adventurer' | 'tavernkeeper';
  toContract: Address;
  toTokenId: bigint;
}

/**
 * Transfer item from one TBA to another
 * Used for unequipping (Adventurer → TavernKeeper) or equipping (TavernKeeper → Adventurer)
 */
export async function transferItem(
  params: TransferItemParams,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<{ txHash: `0x${string}` }> {
  const {
    chainId,
    inventoryContract,
    itemId,
    amount,
    fromType,
    fromContract,
    fromTokenId,
    toType,
    toContract,
    toTokenId,
  } = params;

  // Get source TBA
  const fromTBA =
    fromType === 'adventurer'
      ? await getAdventurerTBA(chainId, fromContract, fromTokenId)
      : await getTavernKeeperTBA(chainId, fromContract, fromTokenId);

  // Get destination TBA
  const toTBA =
    toType === 'adventurer'
      ? await getAdventurerTBA(chainId, toContract, toTokenId)
      : await getTavernKeeperTBA(chainId, toContract, toTokenId);

  // Estimate gas
  const gasEstimate = await estimateTransferGas(
    publicClient,
    fromTBA,
    toTBA,
    inventoryContract,
    itemId,
    amount
  );

  // Get the account address (needed for signing)
  const [account] = await walletClient.getAddresses();
  if (!account) {
    throw new Error('No wallet connected');
  }

  // ERC-1155 safeTransferFrom
  // Note: The TBA must be able to execute this transaction
  // This requires the TBA to have execute capability (ERC-6551 account)
  const hash = await walletClient.writeContract({
    account,
    chain: null,
    address: inventoryContract,
    abi: [
      {
        inputs: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'id', type: 'uint256' },
          { name: 'amount', type: 'uint256' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'safeTransferFrom',
    args: [fromTBA, toTBA, itemId, amount, '0x' as `0x${string}`],
    gas: gasEstimate.gasLimit,
    gasPrice: gasEstimate.gasPrice,
  });

  // Wait for transaction
  await publicClient.waitForTransactionReceipt({ hash });

  return { txHash: hash };
}

/**
 * Unequip item from Adventurer to TavernKeeper
 * Convenience wrapper for transferItem
 */
export async function unequipItem(
  chainId: number,
  inventoryContract: Address,
  itemId: bigint,
  amount: bigint,
  adventurerContract: Address,
  adventurerTokenId: bigint,
  tavernKeeperContract: Address,
  tavernKeeperTokenId: bigint,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<{ txHash: `0x${string}` }> {
  return transferItem(
    {
      chainId,
      inventoryContract,
      itemId,
      amount,
      fromType: 'adventurer',
      fromContract: adventurerContract,
      fromTokenId: adventurerTokenId,
      toType: 'tavernkeeper',
      toContract: tavernKeeperContract,
      toTokenId: tavernKeeperTokenId,
    },
    publicClient,
    walletClient
  );
}

/**
 * Equip item from TavernKeeper to Adventurer
 * Convenience wrapper for transferItem
 */
export async function equipItem(
  chainId: number,
  inventoryContract: Address,
  itemId: bigint,
  amount: bigint,
  tavernKeeperContract: Address,
  tavernKeeperTokenId: bigint,
  adventurerContract: Address,
  adventurerTokenId: bigint,
  publicClient: PublicClient,
  walletClient: WalletClient
): Promise<{ txHash: `0x${string}` }> {
  return transferItem(
    {
      chainId,
      inventoryContract,
      itemId,
      amount,
      fromType: 'tavernkeeper',
      fromContract: tavernKeeperContract,
      fromTokenId: tavernKeeperTokenId,
      toType: 'adventurer',
      toContract: adventurerContract,
      toTokenId: adventurerTokenId,
    },
    publicClient,
    walletClient
  );
}

