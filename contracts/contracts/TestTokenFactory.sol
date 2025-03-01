// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFactory is Ownable {
    // Array to store deployed tokens
    address[] public deployedTokens;

    // Event emitted when a new token is created
    event TokenCreated(address tokenAddress, string name, string symbol);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Creates a new token with the provided parameters
     * @param name The name of the token
     * @param symbol The symbol of the token
     * @param decimals The number of decimals for the token
     * @param initialSupply The initial supply to mint to the sender
     * @return The address of the newly created token
     */
    function createToken(
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 initialSupply
    ) public returns (address) {
        Token newToken = new Token(
            name,
            symbol,
            decimals,
            initialSupply,
            msg.sender
        );
        address tokenAddress = address(newToken);

        deployedTokens.push(tokenAddress);
        emit TokenCreated(tokenAddress, name, symbol);

        return tokenAddress;
    }

    /**
     * @dev Returns the count of deployed tokens
     * @return The total number of tokens deployed through this factory
     */
    function getDeployedTokensCount() public view returns (uint256) {
        return deployedTokens.length;
    }

    /**
     * @dev Returns a list of all deployed token addresses
     * @return An array of all token addresses
     */
    function getAllDeployedTokens() public view returns (address[] memory) {
        return deployedTokens;
    }
}
