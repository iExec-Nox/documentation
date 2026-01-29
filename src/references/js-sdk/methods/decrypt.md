---
title: decrypt
description: Decrypt confidential data from a handle
---

# decrypt

The `decrypt` method retrieves the plaintext value from an encrypted handle. It
uses proxy re-encryption to securely decrypt data: the connected wallet must be
allowed to view the data and provide an EIP-712 `DataAccessAuthorization`
signature.

## Usage

```ts
import { createEthersHandleClient } from '@iexec-nox/handle';
import type { Handle } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const ethersClient = new BrowserProvider(window.ethereum);
declare const handle: Handle<'uint256'>;
// ---cut---
const handleClient = await createEthersHandleClient(ethersClient);

const { value, solidityType } = await handleClient.decrypt(handle);
```

## Parameters

### handle _Required_

**Type:** `Handle<T>` (a `0x`-prefixed hex string, 32 bytes)

The handle to decrypt. The handle must have been created on the same chain as
the one the client is connected to.

```ts
import { createEthersHandleClient } from '@iexec-nox/handle';
import type { Handle } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const handleClient = await createEthersHandleClient(
  new BrowserProvider(window.ethereum)
);
declare const handle: Handle<'uint256'>;
// ---cut---
const { value, solidityType } = await handleClient.decrypt(handle);
```

::: tip Gasless operation Decryption uses EIP-712 signatures for authentication
and doesn't require gas. The signature proves identity without on-chain
transactions. :::

## Return Value

```ts
import type { SolidityType } from '@iexec-nox/handle';

type JsValue<T extends SolidityType> = boolean | string | bigint;
// ---cut---
type DecryptResult<T extends SolidityType> = {
  value: JsValue<T>;
  solidityType: T;
};
```

### value

**Type:** `boolean | string | bigint`

The decrypted plaintext value. The JavaScript type depends on the Solidity type
encoded in the handle:

- `bool` &rarr; `boolean`
- `string` &rarr; `string`
- `address`, `bytes`, `bytesN` &rarr; `string` (hex-encoded with `0x` prefix)
- `uintN`, `intN` &rarr; `bigint`

### solidityType

**Type:** `SolidityType`

The Solidity type of the decrypted value (e.g. `"uint256"`, `"bool"`,
`"address"`).

```ts
import { createEthersHandleClient } from '@iexec-nox/handle';
import type { Handle } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const handleClient = await createEthersHandleClient(
  new BrowserProvider(window.ethereum)
);
declare const handle: Handle<'uint256'>;
// ---cut---
const { value, solidityType } = await handleClient.decrypt(handle);

console.log('Decrypted value:', value);
console.log('Solidity type:', solidityType);
```
