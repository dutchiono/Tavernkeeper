/**
 * Gas Estimation Service
 * Estimates gas costs and calculates total fees (gas + small protocol fee)
 */

import { type Address, type PublicClient, formatEther, parseEther } from 'viem';

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  totalCost: bigint; // in wei
  totalCostEth: string; // in ETH (formatted)
  protocolFee: bigint; // in wei
  protocolFeeEth: string; // in ETH (formatted)
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
  publicClient: PublicClient,
  from: Address,
  to: Address,
  data: `0x${string}`,
  value?: bigint
): Promise<GasEstimate> {
  // Get current gas price
  const gasPrice = await publicClient.getGasPrice();

  // Estimate gas limit
  const gasLimit = await publicClient.estimateGas({
    account: from,
    to,
    data,
    value: value || 0n,
  });

  // Add 10% buffer to gas limit for safety
  const gasLimitWithBuffer = (gasLimit * 110n) / 100n;

  // Calculate base gas cost
  const baseGasCost = gasLimitWithBuffer * gasPrice;

  // Get protocol fee multiplier from env (default 1.1 = 10% above gas)
  const feeMultiplier = parseFloat(process.env.CLAIM_FEE_MULTIPLIER || '1.1');
  const protocolFee = baseGasCost * BigInt(Math.floor((feeMultiplier - 1) * 1000)) / 1000n;

  // Total cost = gas + protocol fee
  const totalCost = baseGasCost + protocolFee;

  return {
    gasLimit: gasLimitWithBuffer,
    gasPrice,
    totalCost,
    totalCostEth: formatEther(totalCost),
    protocolFee,
    protocolFeeEth: formatEther(protocolFee),
  };
}

/**
 * Estimate gas for minting multiple items to a TBA
 */
export async function estimateMintGas(
  publicClient: PublicClient,
  from: Address,
  inventoryContract: Address,
  tbaAddress: Address,
  itemIds: bigint[],
  amounts: bigint[]
): Promise<GasEstimate> {
  // ERC-1155 safeBatchTransferFrom ABI
  const mintData = {
    address: inventoryContract,
    abi: [
      {
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'ids', type: 'uint256[]' },
          { name: 'amounts', type: 'uint256[]' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'safeBatchTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ] as const,
    functionName: 'safeBatchTransferFrom',
    args: [from, tbaAddress, itemIds, amounts, '0x' as `0x${string}`],
  } as const;

  return estimateGas(publicClient, from, inventoryContract, mintData as any);
}

/**
 * Estimate gas for transferring item between TBAs
 */
export async function estimateTransferGas(
  publicClient: PublicClient,
  fromTBA: Address,
  toTBA: Address,
  inventoryContract: Address,
  itemId: bigint,
  amount: bigint
): Promise<GasEstimate> {
  // ERC-1155 safeTransferFrom ABI
  const transferData = {
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
    ] as const,
    functionName: 'safeTransferFrom',
    args: [fromTBA, toTBA, itemId, amount, '0x' as `0x${string}`],
  } as const;

  return estimateGas(publicClient, fromTBA, inventoryContract, transferData as any);
}

