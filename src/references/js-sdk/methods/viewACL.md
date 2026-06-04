---
title: viewACL
description: View the Access Control List of a handle
---

# viewACL

Retrieves the **Access Control List (ACL)** for a handle. The ACL describes who
can interact with the encrypted data: whether it is publicly decryptable, which
addresses have admin permissions, and which addresses have viewer permissions.

This method queries the protocol's subgraph, not the blockchain directly, so it
is fast and does not require gas.

## Usage

<template v-if="selectedChain === 421614">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
import type { Handle } from '@iexec-nox/handle';
declare const handle: Handle<'uint256'>;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);

const { isPublic, admins, viewers } = await handleClient.viewACL(handle);
```

</template>
<template v-else-if="selectedChain === 11155111">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
import type { Handle } from '@iexec-nox/handle';
declare const handle: Handle<'uint256'>;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);

const { isPublic, admins, viewers } = await handleClient.viewACL(handle);
```

</template>

## Parameters

### handle <Required />

**Type:** `Handle<T>` (a `0x`-prefixed hex string, 32 bytes)

The handle whose ACL you want to inspect.

<template v-if="selectedChain === 421614">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
import type { Handle } from '@iexec-nox/handle';
declare const handle: Handle<'uint256'>;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
const acl = await handleClient.viewACL(handle); // [!code focus]
```

</template>
<template v-else-if="selectedChain === 11155111">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
import type { Handle } from '@iexec-nox/handle';
declare const handle: Handle<'uint256'>;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
const acl = await handleClient.viewACL(handle); // [!code focus]
```

</template>

## Return Value

```ts twoslash
import type { ACL } from '@iexec-nox/handle';
```

```ts
{
  isPublic: boolean;
  admins: string[];
  viewers: string[];
}
```

### isPublic

**Type:** `boolean`

`true` if the handle is publicly decryptable, meaning anyone can call
[`publicDecrypt`](/references/js-sdk/methods/publicDecrypt) on it. `false` if
decryption is restricted to authorized addresses only.

### admins

**Type:** `string[]`

List of Ethereum addresses that have **admin** permissions on this handle.
Admins can grant and revoke viewer access to other addresses.

### viewers

**Type:** `string[]`

List of Ethereum addresses that have **viewer** permissions on this handle.
Viewers can call [`decrypt`](/references/js-sdk/methods/decrypt) to retrieve the
plaintext value.

<template v-if="selectedChain === 421614">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
import type { Handle, SolidityType } from '@iexec-nox/handle';
declare const handle: Handle<SolidityType>;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
const { isPublic, admins, viewers } = await handleClient.viewACL(handle);

if (isPublic) {
  console.log('Handle is publicly decryptable');
} else {
  console.log('Admins:', admins);
  console.log('Viewers:', viewers);
}
```

</template>
<template v-else-if="selectedChain === 11155111">

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
import type { Handle, SolidityType } from '@iexec-nox/handle';
declare const handle: Handle<SolidityType>;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
const { isPublic, admins, viewers } = await handleClient.viewACL(handle);

if (isPublic) {
  console.log('Handle is publicly decryptable');
} else {
  console.log('Admins:', admins);
  console.log('Viewers:', viewers);
}
```

</template>

<script setup>
import { computed } from 'vue';
import useUserStore from '@/stores/useUser.store';

const userStore = useUserStore();
const selectedChain = computed(() => userStore.chainId);
</script>
