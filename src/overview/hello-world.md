---
title: Hello World
description: Build your first confidential smart contract with Nox
---

<script setup>
const counterCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { TEEChainConfig } from '@iexec-nox/tee-contracts/TEEChainConfig.sol';
import { TEEPrimitive, euint256, externalEuint256 } from '@iexec-nox/tee-contracts/TEEPrimitive.sol';

/**
 * @title ConfidentialCounter
 * @notice A simple counter that stores its value encrypted.
 * @dev The counter value is never exposed on-chain - only encrypted handles are visible.
 */
contract ConfidentialCounter is TEEChainConfig {
    /// @notice The encrypted counter value
    euint256 public counter;

    /// @notice Event emitted when counter is incremented
    event CounterIncremented(address indexed user);

    /**
     * @notice Increment the counter by an encrypted amount
     * @param inputHandle The encrypted increment value (created via SDK)
     * @param inputProof The proof that the handle is valid
     */
    function increment(
        externalEuint256 inputHandle,
        bytes calldata inputProof
    ) external {
        // Verify the input handle and convert to internal type
        euint256 incrementValue = TEEPrimitive.fromExternal(inputHandle, inputProof);

        // Add the encrypted increment to the encrypted counter
        // This computation happens inside the TEE - values are never exposed
        counter = TEEPrimitive.add(counter, incrementValue);

        // Allow the contract to access the new counter value
        acl.allowThis(euint256.unwrap(counter));

        emit CounterIncremented(msg.sender);
    }

    /**
     * @notice Reset the counter to zero
     */
    function reset() external {
        // Create an encrypted zero value
        counter = TEEPrimitive.asEuint256(0);
        acl.allowThis(euint256.unwrap(counter));
    }
}`;
</script>

# Hello World

Build your first confidential smart contract using Nox. This example demonstrates how to create a simple counter that keeps its value private using TEE-based encryption.

## Try it in Remix

You can experiment with the contract directly in your browser using Remix IDE:

<ClientOnly>
  <RemixEmbed
    title="ConfidentialCounter.sol"
    :show-embed="false"
    height="650px"
    :code="counterCode"
  />
</ClientOnly>

## Understanding the Code

### 1. Inherit from TEEChainConfig

```solidity
contract ConfidentialCounter is TEEChainConfig {
```

`TEEChainConfig` automatically configures the correct TEE service addresses based on the network you're deploying to (Arbitrum Sepolia, Arbitrum One, etc.).

### 2. Encrypted State Variables

```solidity
euint256 public counter;
```

The `euint256` type represents an encrypted unsigned 256-bit integer. The actual value is stored as an encrypted handle - observers can see the handle exists but cannot read the value.

### 3. Working with Encrypted Inputs

```solidity
function increment(
    externalEuint256 inputHandle,
    bytes calldata inputProof
) external {
    euint256 incrementValue = TEEPrimitive.fromExternal(inputHandle, inputProof);
    // ...
}
```

When users want to pass encrypted values to your contract:
1. They use the SDK to encrypt the value off-chain, receiving a `handle` and `inputProof`
2. The contract verifies the proof using `TEEPrimitive.fromExternal()`
3. The verified handle can now be used in computations

### 4. Confidential Computations

```solidity
counter = TEEPrimitive.add(counter, incrementValue);
```

All arithmetic operations happen inside the TEE (Trusted Execution Environment). The TEE:
- Decrypts the operands
- Performs the computation
- Re-encrypts the result
- Returns a new handle

The plaintext values are **never exposed on-chain**.

### 5. Managing Permissions

```solidity
acl.allowThis(euint256.unwrap(counter));
```

The ACL (Access Control List) manages who can access encrypted values:
- `allowThis()` - Grants the contract access to the handle
- `allow(handle, address)` - Grants a specific address access
- By default, only the handle creator has access

## Interacting from the Frontend

Use the Nox SDK to interact with your confidential contract:

```typescript
import { createViemHandleClient } from '@iexec-nox/handles';
import { createWalletClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

// 1. Setup the client
const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: http(),
});

const handleClient = createViemHandleClient(walletClient);

// 2. Encrypt a value
const { handle, inputProof } = await handleClient.encryptInput(42n, 'uint256');

// 3. Call the contract with the encrypted value
const tx = await contract.increment(handle, inputProof);

// 4. Decrypt the result (requires permission)
const { value } = await handleClient.decrypt(counterHandle);
console.log('Counter value:', value);
```

## Next Steps

- [Deploy to Testnet](/guides/deploy-contract) - Deploy your first confidential contract
- [SDK Reference](/references/js-sdk) - Complete SDK documentation
- [TEEPrimitive Library](/references/tee-primitive) - All available encrypted operations
