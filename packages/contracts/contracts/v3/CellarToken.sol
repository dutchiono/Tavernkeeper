
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CellarToken (CLP)
 * @notice Fungible ERC20 token representing a share of the Uniswap V3 Position held by TheCellar.
 * @dev Minted/Burned only by TheCellar contract.
 */
contract CellarToken is ERC20, Ownable {
    constructor() ERC20("Cellar LP Token", "CLP") Ownable(msg.sender) {}

    /**
     * @notice Mints new tokens. Only callable by owner (TheCellar).
     * @param to The address to receive the tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Burns tokens. Only callable by owner (TheCellar).
     * @param from The address to burn tokens from.
     * @param amount The amount of tokens to burn.
     */
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
