// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";

contract Inventory is ERC1155, ERC1155URIStorage, Ownable {
    address public feeRecipient;

    event FeeCollected(address indexed payer, uint256 amount);

    constructor(address _feeRecipient) ERC1155("") Ownable(msg.sender) {
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

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public payable override {
        _collectFee();
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function _collectFee() internal {
        if (msg.value > 0 && feeRecipient != address(0)) {
            (bool success, ) = feeRecipient.call{value: msg.value}("");
            require(success, "Inventory: fee transfer failed");
            emit FeeCollected(msg.sender, msg.value);
        }
    }

    function uri(uint256 tokenId) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(tokenId);
    }
}
