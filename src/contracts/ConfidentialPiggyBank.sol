// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Piggy bank with a private balance.
// Nobody can see how much is inside, only the owner can withdraw.

import {Nox, euint256, externalEuint256, ebool} from "@iexec-nox/nox-protocol-contracts/contracts/sdk/Nox.sol";
contract ConfidentialPiggyBank {
    euint256 private balance;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    /// @notice Deposit an encrypted amount
    function deposit(externalEuint256 inputHandle, bytes calldata inputProof) external {
        euint256 amount = Nox.fromExternal(inputHandle, inputProof);
        balance = Nox.add(balance, amount);
        Nox.allowThis(balance);
    }

    /// @notice Withdraw an encrypted amount (owner only)
    function withdraw(externalEuint256 inputHandle, bytes calldata inputProof) external {
        require(msg.sender == owner);
        euint256 amount = Nox.fromExternal(inputHandle, inputProof);

        (ebool ok, euint256 newBalance) = Nox.safeSub(balance, amount);
        balance = Nox.select(ok, newBalance, balance);
        Nox.allowThis(balance);
    }

    /// @notice Get the encrypted handle (not the actual balance)
    function getBalanceHandle() external view returns (bytes32) {
        return euint256.unwrap(balance);
    }
}
