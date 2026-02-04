// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { TEEChainConfig } from '@iexec-nox/tee-contracts/TEEChainConfig.sol';
import { TEEPrimitive, euint256, externalEuint256, ebool } from '@iexec-nox/tee-contracts/TEEPrimitive.sol';

/**
 * @title ConfidentialPiggyBank
 * @notice A piggy bank that keeps your savings private using TEE encryption.
 * @dev The balance is never exposed on-chain - only encrypted handles are visible.
 */
contract ConfidentialPiggyBank is TEEChainConfig {
    /// @notice The encrypted balance of the piggy bank
    euint256 private balance;

    /// @notice The owner of the piggy bank
    address public owner;

    /// @notice Event emitted when funds are deposited
    event Deposited(address indexed depositor);

    /// @notice Event emitted when funds are withdrawn
    event Withdrawn(address indexed owner);

    /// @notice Event emitted when the piggy bank is broken (emptied)
    event PiggyBankBroken(address indexed owner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Initialize balance to encrypted zero
        balance = TEEPrimitive.asEuint256(0);
        acl.allowThis(euint256.unwrap(balance));
    }

    /**
     * @notice Deposit funds into the piggy bank
     * @param inputHandle The encrypted deposit amount (created via SDK)
     * @param inputProof The proof that the handle is valid
     */
    function deposit(
        externalEuint256 inputHandle,
        bytes calldata inputProof
    ) external {
        // Verify the input handle and convert to internal type
        euint256 depositAmount = TEEPrimitive.fromExternal(inputHandle, inputProof);

        // Add the encrypted deposit to the encrypted balance
        // This computation happens inside the TEE - values are never exposed
        balance = TEEPrimitive.add(balance, depositAmount);

        // Allow the contract to access the new balance
        acl.allowThis(euint256.unwrap(balance));

        emit Deposited(msg.sender);
    }

    /**
     * @notice Withdraw funds from the piggy bank
     * @param inputHandle The encrypted withdrawal amount (created via SDK)
     * @param inputProof The proof that the handle is valid
     */
    function withdraw(
        externalEuint256 inputHandle,
        bytes calldata inputProof
    ) external onlyOwner {
        // Verify the input handle and convert to internal type
        euint256 withdrawAmount = TEEPrimitive.fromExternal(inputHandle, inputProof);

        // Check if withdrawal amount is less than or equal to balance
        ebool canWithdraw = TEEPrimitive.le(withdrawAmount, balance);

        // Conditionally subtract: if canWithdraw is true, subtract; otherwise keep balance
        euint256 newBalance = TEEPrimitive.sub(balance, withdrawAmount);
        balance = TEEPrimitive.select(canWithdraw, newBalance, balance);

        // Allow the contract to access the new balance
        acl.allowThis(euint256.unwrap(balance));

        emit Withdrawn(msg.sender);
    }

    /**
     * @notice Break the piggy bank and reset balance to zero
     * @dev Only the owner can break their piggy bank
     */
    function breakPiggyBank() external onlyOwner {
        // Reset balance to encrypted zero
        balance = TEEPrimitive.asEuint256(0);
        acl.allowThis(euint256.unwrap(balance));

        emit PiggyBankBroken(msg.sender);
    }

    /**
     * @notice Grant an address permission to view the balance
     * @param viewer The address to grant view permission to
     */
    function grantViewAccess(address viewer) external onlyOwner {
        acl.allow(euint256.unwrap(balance), viewer);
    }
}
