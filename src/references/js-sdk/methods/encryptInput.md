---
title: encryptInput
description: Encrypt input data for confidential computation
---

## Overview

The `encryptInput` method encrypts a plaintext value and creates a handle that references the encrypted data. This is the primary way to create encrypted data handles in the Nox protocol.

## Syntax

```typescript
encryptInput(
  value: number | bigint | string | boolean,
  solidityType: SolidityType
): Promise<EncryptInputResult>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `number \| bigint \| string \| boolean` | The plaintext value to encrypt. Must match the specified Solidity type. |
| `solidityType` | `SolidityType` | The Solidity type of the value (e.g., `"uint256"`, `"address"`, `"bool"`). |

## Returns

```typescript
type EncryptInputResult = {
  handle: string;      // bytes32 - The handle identifier
  inputProof: string;  // bytes - EIP-712 proof signed by Gateway
};
```

## Description

`encryptInput` performs the following operations:

1. **Connects to Gateway**: Establishes a secure TLS connection with the Gateway TEE
2. **Sends Plaintext**: Transmits the plaintext value, owner address, data type, and chain ID
3. **Receives Handle**: Gets back a deterministic handle and an EIP-712 signed proof
4. **Verifies Proof**: Validates the Gateway signature on the proof

The Gateway encrypts the data under the KMS public key, generates a deterministic handle, stores the ciphertext off-chain, and returns a signed proof that can be verified on-chain.

## Example

### Basic Usage

```typescript
import { createEthersHandleClient } from "@iexec/handles";

const handlesClient = createEthersHandleClient(signer);

// Encrypt a uint256 value
const { handle, inputProof } = await handlesClient.encryptInput(
  100_000_000n,
  "uint256"
);

console.log("Handle:", handle);
// Output: 0x7a3b5c8d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8
```

### Different Types

```typescript
// Encrypt an address
const { handle: addressHandle } = await handlesClient.encryptInput(
  "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "address"
);

// Encrypt a boolean
const { handle: boolHandle } = await handlesClient.encryptInput(
  true,
  "bool"
);

// Encrypt a string
const { handle: stringHandle } = await handlesClient.encryptInput(
  "Hello, Nox!",
  "string"
);

// Encrypt bytes
const { handle: bytesHandle } = await handlesClient.encryptInput(
  "0x1234abcd",
  "bytes"
);
```

### Using in Smart Contracts

The `inputProof` can be used to verify the handle on-chain:

```typescript
// Encrypt the value
const { handle, inputProof } = await handlesClient.encryptInput(
  1000n,
  "uint256"
);

// Use in smart contract call
const tx = await contract.verifyInput(handle, inputProof);
await tx.wait();
```

## Supported Types

The method supports all standard Solidity types:

- **Unsigned Integers**: `uint8`, `uint16`, `uint24`, `uint32`, `uint40`, `uint48`, `uint56`, `uint64`, `uint72`, `uint80`, `uint88`, `uint96`, `uint104`, `uint112`, `uint120`, `uint128`, `uint136`, `uint144`, `uint152`, `uint160`, `uint168`, `uint176`, `uint184`, `uint192`, `uint200`, `uint208`, `uint216`, `uint224`, `uint232`, `uint240`, `uint248`, `uint256`
- **Signed Integers**: `int8` through `int256` (same sizes as uint)
- **Fixed-size Bytes**: `bytes1` through `bytes32`
- **Dynamic Types**: `bytes`, `string`
- **Other**: `bool`, `address`

## Security Considerations

- **No Signatures Required**: Encryption uses TLS only, no wallet signature needed
- **Gateway Verification**: The `inputProof` is signed by the Gateway TEE and can be verified on-chain
- **Owner Address**: The handle owner is set to the signer's address automatically
- **Deterministic Handles**: Same input produces the same handle (useful for idempotency)

## Error Handling

```typescript
try {
  const { handle, inputProof } = await handlesClient.encryptInput(
    value,
    "uint256"
  );
} catch (error) {
  if (error.message.includes("Gateway connection")) {
    console.error("Failed to connect to Gateway");
  } else if (error.message.includes("invalid type")) {
    console.error("Unsupported Solidity type");
  } else {
    console.error("Encryption failed:", error);
  }
}
```

## Related

- [decrypt](/references/js-sdk/methods/decrypt) - Decrypt handles
- [viewACL](/references/js-sdk/methods/viewACL) - View handle permissions
- [Gateway](/protocol/gateway) - Gateway service documentation
