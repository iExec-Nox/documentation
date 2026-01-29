---
title: encryptInput
description: Encrypt input data for confidential computation
---

# encryptInput

The `encryptInput` method encrypts a plaintext value and creates a handle that
references the encrypted data. The returned `inputProof` can be used to verify
the handle on-chain in smart contracts.

## Usage

```ts
import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const ethersClient = new BrowserProvider(window.ethereum);
// ---cut---
const handleClient = await createEthersHandleClient(ethersClient);

const { handle, inputProof } = await handleClient.encryptInput(
  100_000_000n,
  'uint256'
);
```

## Parameters

```ts
import type { SolidityType } from '@iexec-nox/handle';
```

### value _Required_

**Type:** `boolean | string | bigint`

The plaintext value to encrypt. The expected JavaScript type depends on the
`solidityType` parameter:

- `bool` &rarr; `boolean`
- `string` &rarr; `string`
- `address`, `bytes`, `bytesN` &rarr; `string` (hex-encoded with `0x` prefix)
- `uintN`, `intN` &rarr; `bigint`

```ts
import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const handleClient = await createEthersHandleClient(
  new BrowserProvider(window.ethereum)
);
// ---cut---
// boolean
await handleClient.encryptInput(true, 'bool');

// bigint
await handleClient.encryptInput(1000n, 'uint256');

// address (hex string)
await handleClient.encryptInput(
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
  'address'
);
```

### solidityType _Required_

**Type:** `SolidityType`

The Solidity type of the value to encrypt.

Supported types:

- **Boolean**: `bool`
- **Address**: `address`
- **Dynamic types**: `bytes`, `string`
- **Unsigned integers**: `uint8`, `uint16`, `uint24`, ... , `uint256`
- **Signed integers**: `int8`, `int16`, `int24`, ... , `int256`
- **Fixed-size bytes**: `bytes1`, `bytes2`, ... , `bytes32`

```ts
import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const handleClient = await createEthersHandleClient(
  new BrowserProvider(window.ethereum)
);
// ---cut---
await handleClient.encryptInput(true, 'bool');
await handleClient.encryptInput(42n, 'uint64');
await handleClient.encryptInput('Hello, Nox!', 'string');
```

## Return Value

```ts
import type { Handle, HexString } from '@iexec-nox/handle';
```

```ts
import type { Handle, HexString, SolidityType } from '@iexec-nox/handle';
// ---cut---
type EncryptInputResult<T extends SolidityType> = {
  handle: Handle<T>;
  inputProof: HexString;
};
```

### handle

**Type:** `Handle<T>` (a `0x`-prefixed hex string, 32 bytes)

The deterministic handle identifier referencing the encrypted data on-chain.

### inputProof

**Type:** `HexString`

An EIP-712 signed proof from the Gateway. Use this proof when calling smart
contract functions that need to verify the handle was created by a legitimate
Gateway.

```ts
import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const handleClient = await createEthersHandleClient(
  new BrowserProvider(window.ethereum)
);
declare const contract: {
  verifyInput: (
    handle: string,
    inputProof: string
  ) => Promise<{ wait: () => Promise<void> }>;
};
// ---cut---
const { handle, inputProof } = await handleClient.encryptInput(
  1000n,
  'uint256'
);

// Use in smart contract call
const tx = await contract.verifyInput(handle, inputProof);
await tx.wait();
```
