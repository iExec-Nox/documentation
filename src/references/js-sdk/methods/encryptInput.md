---
title: encryptInput
description: Encrypt a value and create an on-chain handle
---

# encryptInput

Encrypts a plaintext value and registers it with the Handle Gateway. The latter
stores the encrypted data and returns a **handle** — a 32-byte on-chain
identifier — along with a **handleProof** that smart contracts can use to verify
the handle was created by a legitimate Handle Gateway.

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

::: warning Currently supported types

`encryptInput` currently accepts only the following types: `bool`, `uint16`,
`uint256`, `int16`, and `int256`. Support for additional types from the
`SolidityType` union will be added in future releases.

:::

## Usage

<template v-if="selectedChain === 421614">

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

</template>
<template v-else-if="selectedChain === 11155111">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);

const { handle, handleProof } = await handleClient.encryptInput(
  100_000_000n,
  'uint256',
  '0x123...abc' // applicationContract - the contract that will use this handle
);
```

</template>

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

<!-- prettier-ignore-start -->
<template v-if="selectedChain === 421614">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
declare const CONTRACT_ADDRESS: `0x${string}`;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
// Encrypt a boolean flag
await handleClient.encryptInput(true, 'bool', CONTRACT_ADDRESS); // [!code focus]

// Encrypt a token amount
await handleClient.encryptInput(1000n, 'uint256', CONTRACT_ADDRESS); // [!code focus]

// Encrypt an Ethereum address
await handleClient.encryptInput(
  // [!code focus]
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', // [!code focus]
  'address', // [!code focus]
  CONTRACT_ADDRESS // [!code focus]
); // [!code focus]
```

</template>
<template v-else-if="selectedChain === 11155111">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
declare const CONTRACT_ADDRESS: `0x${string}`;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
// Encrypt a boolean flag
await handleClient.encryptInput(true, 'bool', CONTRACT_ADDRESS); // [!code focus]

// Encrypt a token amount
await handleClient.encryptInput(1000n, 'uint256', CONTRACT_ADDRESS); // [!code focus]

// Encrypt an Ethereum address
await handleClient.encryptInput(
  // [!code focus]
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0', // [!code focus]
  'address', // [!code focus]
  CONTRACT_ADDRESS // [!code focus]
); // [!code focus]
```

</template>
<!-- prettier-ignore-end -->

### solidityType <Required />

**Type:** `SolidityType`

The Solidity type the value will be treated as on-chain. The type code is
embedded in the handle (byte 30) so the Handle Gateway and contracts know how to
interpret the encrypted data.

Supported types:

- **Boolean**: `bool`
- **Address**: `address` _(coming soon)_
- **Dynamic types**: `bytes` _(coming soon)_, `string` _(coming soon)_
- **Unsigned integers**: `uint8` _(coming soon)_, `uint16`, `uint24` _(coming
  soon)_, ... , `uint256`
- **Signed integers**: `int8` _(coming soon)_, `int16`, `int24` _(coming soon)_,
  ... , `int256`
- **Fixed-size bytes**: `bytes1` _(coming soon)_, `bytes2` _(coming soon)_, ...
  , `bytes32` _(coming soon)_

::: tip

Only `bool`, `uint16`, `uint256`, `int16`, and `int256` are currently supported
at runtime. The remaining types listed above will be available in future
releases.

:::

<template v-if="selectedChain === 421614">

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
await handleClient.encryptInput(true, 'bool', '0x123...abc'); // [!code focus]
await handleClient.encryptInput(42n, 'uint64', '0x123...abc'); // [!code focus]
await handleClient.encryptInput('Hello, Nox!', 'string', '0x123...abc'); // [!code focus]
```

</template>
<template v-else-if="selectedChain === 11155111">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
await handleClient.encryptInput(true, 'bool', '0x123...abc'); // [!code focus]
await handleClient.encryptInput(42n, 'uint64', '0x123...abc'); // [!code focus]
await handleClient.encryptInput('Hello, Nox!', 'string', '0x123...abc'); // [!code focus]
```

</template>

### applicationContract <Required />

**Type:** `string` (Ethereum address)

The address of the smart contract that will use this handle. The handle is bound
to this contract: only the application contract can validate the `handleProof`
on-chain. After successful validation, it receives transient access on the ACL
for this handle. The contract must then explicitly persist that access and grant
permissions to any address that needs to use or decrypt the handle.

<template v-if="selectedChain === 421614">

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
// The handle will be used by contract at 0x742d...bEb0
await handleClient.encryptInput(
  1000n,
  'uint256',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' // [!code focus]
);
```

</template>
<template v-else-if="selectedChain === 11155111">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
// The handle will be used by contract at 0x742d...bEb0
await handleClient.encryptInput(
  1000n,
  'uint256',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' // [!code focus]
);
```

</template>

## Return Value

```ts
{
  handle: Handle<T>;
  handleProof: `0x${string}`;
}
```

### handle

**Type:** `Handle<T>` (a `0x`-prefixed hex string, 32 bytes)

A deterministic identifier pointing to the encrypted data. The handle encodes
the chain ID (bytes 26–29), the Solidity type code (byte 30), and a protocol
version (byte 31). Handles are immutable — updating a value produces a new
handle.

### handleProof

**Type:** `string` (`0x`-prefixed hex string)

An EIP-712 signed proof from the Handle Gateway attesting that the handle was
created legitimately. Pass this proof alongside the handle when calling smart
contract functions that verify encrypted inputs.

<script setup>
import { computed } from 'vue';
import useUserStore from '@/stores/useUser.store';

const userStore = useUserStore();
const selectedChain = computed(() => userStore.chainId);
</script>
