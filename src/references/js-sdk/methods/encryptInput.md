---
title: encryptInput
description: Encrypt a value and create an on-chain handle
---

# encryptInput

Encrypts a plaintext value and registers it with the Handle Gateway. The latter
stores the encrypted data and returns a **handle** — a 32-byte on-chain
identifier — along with a **handleProof** that smart contracts can use to verify
the handle was created by a legitimate Handle Gateway.

## Signature

```ts
encryptInput(
  value: boolean | bigint,
  solidityType: SolidityType,
  applicationContract: string // 0x-prefixed Ethereum address
): Promise<{ handle: Handle<T>; handleProof: `0x${string}` }>;
```

::: warning Positional arguments — not an options object

`encryptInput` takes **three positional arguments** in this exact order:
`value`, `solidityType`, then `applicationContract`. It is **not** an options
object — do not pass `{ value, solidityType, applicationContract }`.

```ts
// ✅ Correct — positional
const { handle, handleProof } = await handleClient.encryptInput(
  42n,
  'uint256',
  applicationContract
);

// ❌ Wrong — options object is not supported
await handleClient.encryptInput({
  value: 42n,
  solidityType: 'uint256' /* … */,
});
```

:::

### What happens under the hood

1. The SDK encodes the value according to the given Solidity type.
2. It sends the encoded value plus the caller's address to the Handle Gateway
   over an attested HTTPS connection (the TLS certificate is bound to the
   enclave's remote attestation report).
3. The Handle Gateway — **running inside an Intel TDX enclave** — encrypts the
   value using ECIES with the KMS public key and stores the ciphertext in AWS
   S3. The plaintext never leaves the TEE memory.
4. The Gateway returns a deterministic handle and a signed EIP-712 proof.

The handle can then be passed to a smart contract alongside the `handleProof`
for on-chain verification. From that point, the contract works with the handle
without ever seeing the plaintext.

See [Handle Gateway](/protocol/handle-gateway) for the full encryption protocol.

::: warning Supported types

`encryptInput` accepts only **five** Solidity types: `bool`, `uint16`,
`uint256`, `int16`, and `int256`. Any other type (`address`, `bytes32`, `uint8`,
`uint32`, `uint64`, `uint128`, `int8`, `int32`, `string`, …) throws a
`TypeError` **before** any network request is made.

See [solidityType](#soliditytype) below for the full list and the reason behind
the restriction.

:::

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

const { handle, handleProof } = await handleClient.encryptInput(
  100_000_000n,
  'uint256',
  '0x123...abc' // applicationContract - the contract that will use this handle
);
```

## Parameters

### value <Required />

**Type:** `boolean | bigint`

The plaintext value to encrypt. The expected JavaScript type depends on the
`solidityType` parameter:

| Solidity type                          | JavaScript type | Example |
| -------------------------------------- | --------------- | ------- |
| `bool`                                 | `boolean`       | `true`  |
| `uint16`, `uint256`, `int16`, `int256` | `bigint`        | `1000n` |

<!-- prettier-ignore-start -->
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
declare const CONTRACT_ADDRESS: `0x${string}`;
// ---cut---
// Encrypt a boolean flag
await handleClient.encryptInput(true, 'bool', CONTRACT_ADDRESS); // [!code focus]

// Encrypt a token amount
await handleClient.encryptInput(1000n, 'uint256', CONTRACT_ADDRESS); // [!code focus]

// Encrypt a signed integer
await handleClient.encryptInput(-42n, 'int256', CONTRACT_ADDRESS); // [!code focus]
```
<!-- prettier-ignore-end -->

### solidityType <Required />

**Type:** `SolidityType`

The Solidity type the value will be treated as on-chain. The type code is
embedded in the handle (byte 30) so the Handle Gateway and contracts know how to
interpret the encrypted data.

Only the following **five** types are supported for encryption:

| `solidityType` | Value type | Notes                    |
| -------------- | ---------- | ------------------------ |
| `'bool'`       | `boolean`  | `true` / `false`         |
| `'uint16'`     | `bigint`   | `0n` … `65535n`          |
| `'uint256'`    | `bigint`   | unsigned, up to 256 bits |
| `'int16'`      | `bigint`   | `-32768n` … `32767n`     |
| `'int256'`     | `bigint`   | signed, up to 256 bits   |

::: danger Unsupported types throw before any network call

`address`, `bytes`, `bytes32` (and any `bytesN`), `string`, and every integer
width other than the four above — `uint8`, `uint24`, `uint32`, `uint64`,
`uint128`, `int8`, `int24`, `int32`, `int128`, … — are **not** supported.
Passing one throws synchronously:

```text
TypeError: Unsupported Solidity type for encryption: uint64.
Nox protocol only supports: bool, uint16, uint256, int16, int256
```

The restriction comes from the **Nox Runner** (the Rust TEE component), not the
SDK. The SDK simply mirrors the Runner's allow-list and fails fast — your
`encryptInput` call rejects before it ever reaches the network.

:::

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
await handleClient.encryptInput(true, 'bool', '0x123...abc'); // [!code focus]
await handleClient.encryptInput(1000n, 'uint16', '0x123...abc'); // [!code focus]
await handleClient.encryptInput(-7n, 'int256', '0x123...abc'); // [!code focus]
```

#### Typing your variables with `SolidityType`

`SolidityType` is exported from the package, so you can type your own variables
and helpers instead of hard-coding string literals:

```ts twoslash
import { type SolidityType } from '@iexec-nox/handle';
// ---cut---
const amountType: SolidityType = 'uint256';
const flagType: SolidityType = 'bool';
```

### applicationContract <Required />

**Type:** `string` (Ethereum address)

The address of the smart contract that will use this handle. The handle is bound
to this contract: only the application contract can validate the `handleProof`
on-chain. After successful validation, it receives transient access on the ACL
for this handle. The contract must then explicitly persist that access and grant
permissions to any address that needs to use or decrypt the handle.

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
// The handle will be used by contract at 0x742d...bEb0
await handleClient.encryptInput(
  1000n,
  'uint256',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' // [!code focus]
);
```

## Return Value

```ts
{
  handle: Handle<T>;
  handleProof: `0x${string}`;
}
```

Destructure the result to get both values:

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
declare const CONTRACT_ADDRESS: `0x${string}`;
// ---cut---
const { handle, handleProof } = await handleClient.encryptInput(
  42n,
  'uint256',
  CONTRACT_ADDRESS
);
```

### handle

**Type:** `Handle<T>` (a `0x`-prefixed hex string, 32 bytes)

A deterministic identifier pointing to the encrypted data. The handle encodes
the chain ID (bytes 26–29), the Solidity type code (byte 30), and a protocol
version (byte 31). Handles are immutable — updating a value produces a new
handle.

### handleProof

**Type:** `` `0x${string}` `` — a `0x`-prefixed hex string of **137 bytes**
(`0x` followed by 274 hex characters)

An EIP-712 signed proof from the Handle Gateway attesting that the handle was
created legitimately. Pass this proof alongside the handle when calling smart
contract functions that verify encrypted inputs (for example
[`fromExternal`](/references/solidity-library/methods/core-primitives/fromExternal)).
