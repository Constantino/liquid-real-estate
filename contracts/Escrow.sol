// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Escrow is ERC1155Holder, Ownable {
    // Mapping to store token prices (tokenId => price in MNT)
    mapping(uint256 => uint256) public tokenPrices;

    // Event emitted when a token is listed for sale
    event TokenListed(uint256 indexed tokenId, uint256 price);

    // Event emitted when a token is purchased
    event TokenPurchased(uint256 indexed tokenId, address buyer, uint256 price);

    // Event emitted when funds are withdrawn
    event FundsWithdrawn(address owner, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev List a token for sale with a specific price
     * @param tokenId The ID of the token to list
     * @param price The price in MNT for the token
     */
    function listToken(uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than 0");
        tokenPrices[tokenId] = price;
        emit TokenListed(tokenId, price);
    }

    /**
     * @dev Buy a token by sending MNT payment
     * @param tokenContract The address of the ERC1155 token contract
     * @param tokenId The ID of the token to purchase
     */
    function buyToken(address tokenContract, uint256 tokenId) external payable {
        uint256 price = tokenPrices[tokenId];
        require(price > 0, "Token not listed for sale");
        require(msg.value >= price, "Insufficient payment");

        // Transfer the token to the buyer
        IERC1155(tokenContract).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            1,
            ""
        );

        // Refund excess payment if any
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }

        emit TokenPurchased(tokenId, msg.sender, price);
    }

    /**
     * @dev Withdraw accumulated funds from the contract
     */
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        payable(owner()).transfer(balance);
        emit FundsWithdrawn(owner(), balance);
    }

    /**
     * @dev Get the price of a specific token
     * @param tokenId The ID of the token
     * @return The price in MNT
     */
    function getTokenPrice(uint256 tokenId) external view returns (uint256) {
        return tokenPrices[tokenId];
    }
}
