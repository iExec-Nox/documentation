---
title: decrypt
description: Decrypt confidential data
---

## Overview

The `decrypt` method retrieves the plaintext value from an encrypted handle. It
uses proxy re-encryption to securely decrypt data without exposing it to the
Gateway or KMS.

## Syntax

```typescript
decrypt(
  handle: string | string[]
): Promise<HandleViewResult>
```

## Parameters

```typescript
// No additional imports needed - handle is a string or string array
```

### handle

**Type:** `string | string[]`

The handle(s) to decrypt. Can be a single handle or an array of handles.

```typescript
// Single handle
const { value, solidityType } = await handlesClient.decrypt(handle);

// Multiple handles
const results = await handlesClient.decrypt([handle1, handle2, handle3]);
```

## Returns

```typescript
type HandleViewResult<T> = {
  value: T; // Decrypted value (type inferred from handle)
  solidityType: string; // Solidity type of the value
};
```

For array inputs, returns an array of results.

## Example

::: code-group

```typescript [Basic Usage]
import { createEthersHandleClient } from '@iexec/handles';

const handlesClient = createEthersHandleClient(signer);

// Decrypt a single handle
const { value, solidityType } = await handlesClient.decrypt(handle);

console.log('Decrypted value:', value);
console.log('Type:', solidityType);
```

```typescript [Decrypting Multiple Handles]
// Decrypt multiple handles at once
const handles = [handle1, handle2, handle3];
const results = await handlesClient.decrypt(handles);

results.forEach((result, index) => {
  console.log(`Handle ${index}:`, result.value);
  console.log(`Type:`, result.solidityType);
});
```

```typescript [Type-Safe Usage]
// TypeScript will infer the type based on the handle
const { value } = await handlesClient.decrypt(balanceHandle);
// value is typed as bigint for uint256 handles

// Use in calculations
const total = value + 1000n;
```

```typescript [Error Handling]
try {
  const { value } = await handlesClient.decrypt(handle);
} catch (error) {
  if (error.message.includes('not authorized')) {
    console.error("You don't have permission to decrypt this handle");
  } else if (error.message.includes('expired')) {
    console.error('Decryption request expired');
  } else if (error.message.includes('signature')) {
    console.error('Invalid Gateway signature');
  } else {
    console.error('Decryption failed:', error);
  }
}
```

:::

## Description

`decrypt` performs the following operations:

1. **Generates Ephemeral Key Pair**: Creates a temporary public/private key pair
   for this decryption operation
2. **Signs EIP-712 Payload**: Constructs and signs an EIP-712 payload
   containing:
   - Handle to decrypt
   - Ephemeral public key
   - Timestamp (anti-replay protection)
   - Chain ID
3. **Requests Re-encryption**: Sends signed request to Gateway via gRPC
4. **Gateway Verifies**: Gateway verifies signature, checks ACL permissions, and
   coordinates with KMS
5. **Proxy Re-encryption**: KMS re-encrypts ciphertext under ephemeral public
   key (without decrypting)
6. **Client Decryption**: SDK decrypts the re-encrypted ciphertext using
   ephemeral private key
7. **Cleanup**: Ephemeral private key is cleared from memory

::: info Gasless Operation Decryption uses EIP-712 signatures for authentication
and doesn't require gas. The signature proves identity without on-chain
transactions. :::

## EIP-712 Payload Structure

The SDK automatically constructs and signs this payload:

```typescript
{
  handle: bytes32,           // Handle to decrypt
  tempPubKey: bytes,         // Ephemeral public key
  timestamp: uint256,        // Current timestamp (anti-replay)
  chainId: uint256,          // Blockchain chain ID
  notBefore?: uint256,       // Optional: Key validity start
  expiresAt?: uint256        // Optional: Key validity end
}
```

## Security Features

### Ephemeral Keys

Each decryption uses a unique ephemeral key pair:

- **Forward Secrecy**: Even if a key is compromised, it only affects that single
  decryption
- **One-Time Use**: Keys are generated per request and cleared after use
- **No Key Reuse**: Prevents correlation attacks

### Permission Verification

- **On-Chain ACL Check**: Gateway verifies permissions via smart contract before
  processing
- **No Information Leakage**: Unauthorized requests are rejected without
  revealing handle existence
- **Owner/Viewer Support**: Both owners and viewers (via ACL) can decrypt

### Signature Verification

- **Gateway Signature**: SDK verifies Gateway signature on response using
  Registry
- **KMS Signature**: Gateway verifies KMS signature before forwarding
- **Tamper Detection**: Invalid signatures cause immediate rejection

## Performance Considerations

- **Batch Decryption**: Decrypt multiple handles in a single call for better
  performance
- **Caching**: Consider caching decrypted values when appropriate
- **Network Latency**: First decryption may be slower due to Gateway/KMS
  coordination

## Use Cases

### Reading Confidential Balances

```typescript
// Get handle from smart contract
const handle = await tokenContract.confidentialBalanceOf(userAddress);

// Decrypt the balance
const { value: balance } = await handlesClient.decrypt(handle);
console.log(`User balance: ${balance}`);
```

### Auditing with Permissions

```typescript
// Owner grants viewer permission on-chain
await aclContract.addViewer(handle, auditorAddress);

// Auditor can now decrypt
const auditorClient = createEthersHandleClient(auditorSigner);
const { value } = await auditorClient.decrypt(handle);
```

## Related

- [encryptInput](/references/js-sdk/methods/encryptInput) - Create encrypted
  handles
- [viewACL](/references/js-sdk/methods/viewACL) - Check decryption permissions
- [Gateway](/protocol/gateway) - Gateway service documentation
- [KMS](/protocol/kms) - Key Management Service documentation
