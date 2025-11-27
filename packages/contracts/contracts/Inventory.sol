// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Inventory is Initializable, ERC1155Upgradeable, ERC1155URIStorageUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    address public feeRecipient;

    event FeeCollected(address indexed payer, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _feeRecipient) public initializer {
        __ERC1155_init("");
        __ERC1155URIStorage_init();
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        require(_feeRecipient != address(0), "Inventory: invalid fee recipient");
        feeRecipient = _feeRecipient;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setFeeRecipient(address _feeRecipient) public onlyOwner {
        require(_feeRecipient != address(0), "Inventory: invalid fee recipient");
        feeRecipient = _feeRecipient;
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        payable
        onlyOwner
    {
        _collectFee();
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        payable
        onlyOwner
    {
        _collectFee();
        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @notice Claim loot with fee collection
     * This function allows transferring items and collecting fees in a single transaction
     * Use this instead of safeBatchTransferFrom when fees need to be collected
     */
    function claimLootWithFee(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public payable {
        _collectFee();
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function _collectFee() internal {
        if (msg.value > 0 && feeRecipient != address(0)) {
            (bool success, ) = feeRecipient.call{value: msg.value}("");
            require(success, "Inventory: fee transfer failed");
            emit FeeCollected(msg.sender, msg.value);
        }
    }

    function uri(uint256 tokenId) public view override(ERC1155Upgradeable, ERC1155URIStorageUpgradeable) returns (string memory) {
        return super.uri(tokenId);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
