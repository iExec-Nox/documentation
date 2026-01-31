---
title: encryptInput
description: Encrypt a value and create an on-chain handle
---

# encryptInput

Encrypts a plaintext value and registers it with the Handle Gateway. The Gateway
stores the encrypted data and returns a **handle** — a 32-byte on-chain
identifier — along with an **inputProof** that smart contracts can use to verify
the handle was created by a legitimate Gateway.

### What happens under the hood

1. The SDK encodes the value according to the given Solidity type.
2. It sends the encoded value plus the caller's address to the Gateway.
3. The Gateway encrypts and stores the data, then returns a deterministic handle
   and a signed EIP-712 proof.

The handle can then be passed to a smart contract alongside the `inputProof` for
on-chain verification. From that point, the contract works with the handle
without ever seeing the plaintext.

## Usage

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);

const { handle, inputProof } = await handleClient.encryptInput(
  100_000_000n,
  'uint256'
);
```

## Parameters

```ts twoslash
import type { SolidityType } from '@iexec-nox/handle';
```

### value <Required />

**Type:** `boolean | string | bigint`

The plaintext value to encrypt. The expected JavaScript type depends on the
`solidityType` parameter:

| Solidity type                | JavaScript type | Example                                |
| ---------------------------- | --------------- | -------------------------------------- |
| `bool`                       | `boolean`       | `true`                                 |
| `string`                     | `string`        | `"Hello, Nox!"`                        |
| `address`, `bytes`, `bytesN` | `string`        | `"0x742d…bEb0"` (hex with `0x` prefix) |
| `uintN`, `intN`              | `bigint`        | `1000n`                                |

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
// ---cut---
// Encrypt a boolean flag
await handleClient.encryptInput(true, 'bool'); // [!code focus]

// Encrypt a token amount
await handleClient.encryptInput(1000n, 'uint256'); // [!code focus]

// Encrypt an Ethereum address
await handleClient.encryptInput( // [!code focus]
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', // [!code focus]
  'address' // [!code focus]
); // [!code focus]
```

### solidityType <Required />

**Type:** `SolidityType`

The Solidity type the value will be treated as on-chain. The type code is
embedded in the handle (byte 30) so the Gateway and contracts know how to
interpret the encrypted data.

Supported types:

- **Boolean**: `bool`
- **Address**: `address`
- **Dynamic types**: `bytes`, `string`
- **Unsigned integers**: `uint8`, `uint16`, `uint24`, ... , `uint256`
- **Signed integers**: `int8`, `int16`, `int24`, ... , `int256`
- **Fixed-size bytes**: `bytes1`, `bytes2`, ... , `bytes32`

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
// ---cut---
await handleClient.encryptInput(true, 'bool'); // [!code focus]
await handleClient.encryptInput(42n, 'uint64'); // [!code focus]
await handleClient.encryptInput('Hello, Nox!', 'string'); // [!code focus]
```

## Return Value

```ts twoslash
import { type EncryptInputResult } from '@iexec-nox/handle';
```

### handle

**Type:** `Handle<T>` (a `0x`-prefixed hex string, 32 bytes)

A deterministic identifier pointing to the encrypted data. The handle encodes
the chain ID (bytes 26–29), the Solidity type code (byte 30), and a protocol
version (byte 31). Handles are immutable — updating a value produces a new
handle.

### inputProof

**Type:** `string` (`0x`-prefixed hex string)

An EIP-712 signed proof from the Gateway attesting that the handle was created
legitimately. Pass this proof alongside the handle when calling smart contract
functions that verify encrypted inputs.
