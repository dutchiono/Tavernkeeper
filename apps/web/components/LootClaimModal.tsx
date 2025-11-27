'use client';

import React, { useState, useEffect } from 'react';
import { PixelBox, PixelButton } from './PixelComponents';
import { X, Coins, Loader2 } from 'lucide-react';
import type { LootClaim } from '../lib/services/lootClaim';

interface LootClaimModalProps {
  claims: LootClaim[];
  onClose: () => void;
  onClaimSuccess?: (claimId: string, txHash: string) => void;
}

export const LootClaimModal: React.FC<LootClaimModalProps> = ({
  claims,
  onClose,
  onClaimSuccess,
}) => {
  const [selectedClaim, setSelectedClaim] = useState<LootClaim | null>(null);
  const [gasEstimate, setGasEstimate] = useState<{
    totalCostEth: string;
    protocolFeeEth: string;
  } | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedClaim) {
      // Fetch gas estimate
      fetch(`/api/loot/claim?claimId=${selectedClaim.id}&action=estimate`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setGasEstimate({
              totalCostEth: data.totalCostEth,
              protocolFeeEth: data.protocolFeeEth,
            });
          }
        })
        .catch((err) => {
          setError('Failed to estimate gas');
          console.error(err);
        });
    }
  }, [selectedClaim]);

  const handleClaim = async () => {
    if (!selectedClaim) return;

    setIsClaiming(true);
    setError(null);

    try {
      const response = await fetch('/api/loot/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimId: selectedClaim.id,
          chainId: 10143, // Monad chain ID
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        onClaimSuccess?.(selectedClaim.id, data.txHash);
        // Remove claimed item from list
        setSelectedClaim(null);
        setGasEstimate(null);
      }
    } catch (err) {
      setError('Failed to claim loot');
      console.error(err);
    } finally {
      setIsClaiming(false);
    }
  };

  const unclaimedClaims = claims.filter((c) => !c.claimed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <PixelBox className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" title="Claim Loot" variant="paper">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-amber-950 hover:text-amber-900"
        >
          <X size={24} />
        </button>

        {unclaimedClaims.length === 0 ? (
          <div className="text-center py-8 text-amber-950">
            <p>No unclaimed loot available.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Loot Summary */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-amber-950">Unclaimed Loot</h3>
              {unclaimedClaims.map((claim) => (
                <div
                  key={claim.id}
                  className={`p-3 border-2 rounded cursor-pointer transition-all ${
                    selectedClaim?.id === claim.id
                      ? 'border-amber-600 bg-amber-100'
                      : 'border-amber-800 bg-amber-50 hover:border-amber-600'
                  }`}
                  onClick={() => setSelectedClaim(claim)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-amber-950">Adventurer: {claim.adventurerId}</p>
                      <p className="text-sm text-amber-800">
                        {claim.items.length} item{claim.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <Coins className="text-amber-600" size={20} />
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Claim Details */}
            {selectedClaim && (
              <div className="border-t-2 border-amber-800 pt-4">
                <h4 className="font-bold text-amber-950 mb-2">Items to Claim:</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {selectedClaim.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-amber-100 border-2 border-amber-800 rounded text-sm"
                    >
                      <p className="font-semibold text-amber-950">{item.name}</p>
                      <p className="text-xs text-amber-700 capitalize">{item.type}</p>
                    </div>
                  ))}
                </div>

                {/* Gas Estimate */}
                {gasEstimate && (
                  <div className="bg-amber-50 border-2 border-amber-800 p-3 rounded mb-4">
                    <p className="text-sm text-amber-950 mb-1">
                      <strong>Total Cost:</strong> {gasEstimate.totalCostEth} ETH
                    </p>
                    <p className="text-xs text-amber-700">
                      (Gas + Protocol Fee: {gasEstimate.protocolFeeEth} ETH)
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-100 border-2 border-red-600 p-3 rounded mb-4 text-red-800 text-sm">
                    {error}
                  </div>
                )}

                {/* Claim Button */}
                <PixelButton
                  onClick={handleClaim}
                  disabled={isClaiming || !gasEstimate}
                  className="w-full"
                  variant="success"
                >
                  {isClaiming ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Claiming...
                    </>
                  ) : (
                    'Claim Loot'
                  )}
                </PixelButton>
              </div>
            )}
          </div>
        )}
      </PixelBox>
    </div>
  );
};

