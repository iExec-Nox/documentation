---
title: Hello World
description: Build your first confidential smart contract with Nox
---

<script setup>
import piggyBankCode from '../contracts/ConfidentialPiggyBank.sol?raw';
</script>

# Hello World

Build your first confidential smart contract using Nox. This example demonstrates how to create a piggy bank that keeps your savings private using TEE-based encryption.

## Try it in Remix

You can experiment with the contract directly in your browser using Remix IDE:

<ClientOnly>
  <RemixEmbed :code="piggyBankCode" />
</ClientOnly>

## Understanding the Code

### 1. Inherit from TEEChainConfig

```solidity
contract ConfidentialPiggyBank is TEEChainConfig {
```

`TEEChainConfig` automatically configures the correct TEE service addresses based on the network you're deploying to (Arbitrum Sepolia, Arbitrum One, etc.).

### 2. Encrypted State Variables

```solidity
euint256 private balance;
```

The `euint256` type represents an encrypted unsigned 256-bit integer. The actual value is stored as an encrypted handle - observers can see the handle exists but cannot read the value. Your piggy bank balance remains completely private.

### 3. Working with Encrypted Inputs

```solidity
function deposit(
    externalEuint256 inputHandle,
    bytes calldata inputProof
) external {
    euint256 depositAmount = TEEPrimitive.fromExternal(inputHandle, inputProof);
    // ...
}
```

When users want to pass encrypted values to your contract:
1. They use the SDK to encrypt the value off-chain, receiving a `handle` and `inputProof`
2. The contract verifies the proof using `TEEPrimitive.fromExternal()`
3. The verified handle can now be used in computations

### 4. Confidential Computations

```solidity
balance = TEEPrimitive.add(balance, depositAmount);
```

All arithmetic operations happen inside the TEE (Trusted Execution Environment). The TEE:
- Decrypts the operands
- Performs the computation
- Re-encrypts the result
- Returns a new handle

The plaintext values are **never exposed on-chain**.

### 5. Encrypted Comparisons

```solidity
ebool canWithdraw = TEEPrimitive.le(withdrawAmount, balance);
balance = TEEPrimitive.select(canWithdraw, newBalance, balance);
```

You can perform comparisons on encrypted values:
- `le()` checks if one encrypted value is less than or equal to another
- `select()` conditionally chooses between two encrypted values based on an encrypted boolean
- This allows secure logic without revealing the actual values

### 6. Managing Permissions

```solidity
acl.allowThis(euint256.unwrap(balance));
acl.allow(euint256.unwrap(balance), viewer);
```

The ACL (Access Control List) manages who can access encrypted values:
- `allowThis()` - Grants the contract access to the handle
- `allow(handle, address)` - Grants a specific address access
- By default, only the handle creator has access

## Interacting from the Frontend

Use the Nox SDK to interact with your confidential piggy bank:

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

// 2. Encrypt a deposit amount
const { handle, inputProof } = await handleClient.encryptInput(100n, 'uint256');

// 3. Deposit into the piggy bank
const tx = await contract.deposit(handle, inputProof);

// 4. Grant yourself view access and decrypt the balance
await contract.grantViewAccess(walletClient.account.address);
const { value } = await handleClient.decrypt(balanceHandle);
console.log('Piggy bank balance:', value);
```

## Next Steps

- [Deploy to Testnet](/guides/deploy-contract) - Deploy your first confidential contract
- [SDK Reference](/references/js-sdk) - Complete SDK documentation
- [TEEPrimitive Library](/references/tee-primitive) - All available encrypted operations
