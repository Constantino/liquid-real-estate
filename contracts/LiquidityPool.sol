// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidityPool is Ownable {
    // MXNB token address
    address public constant MXNB_TOKEN =
        0x82B9e52b26A2954E113F94Ff26647754d5a4247D;

    // Mapping to track user investments
    mapping(address => uint256) public userInvestments;
    uint256 public totalInvested;

    event Invested(address indexed investor, uint256 amount);
    event Withdrawn(address indexed investor, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Invest MXNB tokens into the pool
     * @param amount Amount of MXNB tokens to invest
     */
    function invest(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer MXNB tokens from user to this contract
        require(
            IERC20(MXNB_TOKEN).transferFrom(msg.sender, address(this), amount),
            "MXNB transfer failed"
        );

        // Update investment tracking
        userInvestments[msg.sender] += amount;
        totalInvested += amount;

        emit Invested(msg.sender, amount);
    }

    /**
     * @dev Withdraw MXNB tokens from the pool
     * @param amount Amount of MXNB tokens to withdraw
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(
            userInvestments[msg.sender] >= amount,
            "Insufficient investment balance"
        );

        // Update investment tracking
        userInvestments[msg.sender] -= amount;
        totalInvested -= amount;

        // Transfer MXNB tokens back to user
        require(
            IERC20(MXNB_TOKEN).transfer(msg.sender, amount),
            "MXNB transfer failed"
        );

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @dev Get user's investment balance
     * @param user Address of the user
     * @return User's investment balance
     */
    function getInvestmentBalance(
        address user
    ) external view returns (uint256) {
        return userInvestments[user];
    }
}
