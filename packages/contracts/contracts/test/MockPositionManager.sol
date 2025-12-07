
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockPositionManager is ERC721 {
    constructor() ERC721("UniV3Pos", "POS") {}

    struct MintParams {
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        address recipient;
        uint256 deadline;
    }

    struct IncreaseLiquidityParams {
        uint256 tokenId;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        uint256 deadline;
    }

    struct CollectParams {
        uint256 tokenId;
        address recipient;
        uint128 amount0Max;
        uint128 amount1Max;
    }

    struct DecreaseLiquidityParams {
        uint256 tokenId;
        uint128 liquidity;
        uint256 amount0Min;
        uint256 amount1Min;
        uint256 deadline;
    }

    uint256 public nextTokenId = 1;

    function mint(MintParams calldata params) external payable returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) {
        tokenId = nextTokenId++;
        _mint(params.recipient, tokenId);
        
        // Return dummy values
        liquidity = 1000 ether; // Large mock liquidity
        amount0 = params.amount0Desired;
        amount1 = params.amount1Desired;
    }

    function decreaseLiquidity(DecreaseLiquidityParams calldata params) external payable returns (uint256 amount0, uint256 amount1) {
        amount0 = uint256(params.liquidity); 
        amount1 = uint256(params.liquidity) * 2;
    }

    function increaseLiquidity(IncreaseLiquidityParams calldata params) external payable returns (uint128 liquidity, uint256 amount0, uint256 amount1) {
        liquidity = 500 ether;
        amount0 = params.amount0Desired;
        amount1 = params.amount1Desired;
    }

    function collect(CollectParams calldata params) external payable returns (uint256 amount0, uint256 amount1) {
        amount0 = 1 ether; // Mock fee
        amount1 = 5 ether; // Mock fee
    }

    function burn(uint256 tokenId) external payable {
        _burn(tokenId);
    }
    
    function positions(uint256 tokenId) external view returns (uint96 nonce, address operator, address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1) {
        return (0, address(0), address(0), address(0), 10000, -100, 100, 1000 ether, 0, 0, 0, 0);
    }
}
