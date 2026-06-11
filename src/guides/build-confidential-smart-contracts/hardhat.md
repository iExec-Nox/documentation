---
title: Hardhat
description:
  Build and test confidential smart contracts with the Nox Hardhat plugin
---

# Hardhat Plugin

## Prerequisites

- **Node.js** 22 or higher
- **Docker** installed and running locally (the offchain stack runs in
  containers)
- A **Hardhat 3** project using the
  [`@nomicfoundation/hardhat-toolbox-viem`](https://hardhat.org/plugins/nomicfoundation-hardhat-toolbox-viem)
  toolbox

## Installation

::: code-group

```sh [pnpm]
pnpm add -D @iexec-nox/nox-hardhat-plugin
```

```sh [npm]
npm install --save-dev @iexec-nox/nox-hardhat-plugin
```

```sh [yarn]
yarn add -D @iexec-nox/nox-hardhat-plugin
```

:::

`hardhat` and `@nomicfoundation/hardhat-toolbox-viem` are peer dependencies, so
make sure both are installed in your project.

## Configuration

Register the plugin in your `hardhat.config.ts`. It must be listed alongside the
Viem toolbox, and your default network must use the `op` chain type:

```ts
import hardhatToolboxViemPlugin from '@nomicfoundation/hardhat-toolbox-viem';
import { defineConfig } from 'hardhat/config';
import noxPlugin from '@iexec-nox/nox-hardhat-plugin';

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin, noxPlugin],
  solidity: '0.8.35',
  networks: {
    default: {
      type: 'edr-simulated',
      chainType: 'op',
    },
  },
});
```

That is all the configuration required.

### Plugin options

All options live under the `nox` key in your config:

| Option             | Type      | Default | Description                                                                                                                                                                                      |
| ------------------ | --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `skipTestOverride` | `boolean` | `false` | When `true`, `hardhat test` runs the original Hardhat action without booting the offchain stack or etching `NoxCompute`. Useful for pure TypeScript tests or to target an already-running stack. |

```ts
import { defineConfig } from 'hardhat/config';

export default defineConfig({
  // ...
  nox: {
    skipTestOverride: true,
  },
});
```

## Running tests

With the plugin configured, run your test suite as usual:

```sh
pnpm hardhat test
```

The first run pulls the offchain service images and may take a while; later runs
reuse the cached images.

<!-- prettier-ignore -->
::: tip
The offchain services run in Docker. Make sure the Docker daemon is started
before running your tests, otherwise the stack setup will fail.
:::

## Writing a test

The plugin exposes a `nox` helper that wraps a Viem network connection together
with a pre-configured [Handle SDK](/references/js-sdk/getting-started) client,
so your tests can encrypt and decrypt without any manual setup.

```ts
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { nox } from '@iexec-nox/nox-hardhat-plugin';

describe('MyConfidentialToken', () => {
  it('resolves a publicly decryptable total supply', async () => {
    const { viem } = await nox.connect();

    // Deploy a confidential contract with the standard Viem helpers.
    const token = await viem.deployContract('MyConfidentialToken', [
      'My Confidential Token',
      'MCT',
      'ipfs://example',
      1000n,
    ]);

    // Read an encrypted handle from the contract.
    const handle =
      (await token.read.confidentialTotalSupply()) as `0x${string}`;

    // Ask the Nox stack to decrypt it and assert on the cleartext value.
    const { value } = await nox.publicDecrypt(handle);
    assert.equal(value, 1000n);
  });
});
```

### Encrypting an input

To pass an encrypted value into a contract call, encrypt it first and forward
the resulting `handle` and `handleProof`:

```ts
import { nox } from '@iexec-nox/nox-hardhat-plugin';

const { viem } = await nox.connect();
const [walletClient] = await viem.getWalletClients();

const { handle, handleProof } = await nox.encryptInput(
  42n,
  'uint256',
  walletClient.account.address
);
```

## The `nox` API

| Member                                                   | Description                                                                                                                 |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --- |
| `connect()`                                              | Opens a connection to the local stack and returns a Viem `NetworkConnection` augmented with a ready-to-use `handleClient`.  |
| `encryptInput(value, solidityType, applicationContract)` | Encrypts a plaintext value for a given contract and returns a `{ handle, handleProof }` pair to forward to a contract call. |
| `decrypt(handle)`                                        | Decrypts an ACL-protected handle and returns its cleartext `value` (signs an EIP-712 authorization, no gas).                |
| `publicDecrypt(handle)`                                  | Decrypts a publicly decryptable handle and returns its `value` plus a `decryptionProof`.                                    |     |

## Next steps

- [Create a confidential ERC-7984 token](/guides/build-confidential-tokens/erc7984-token)
- [Nox JS SDK reference](/references/js-sdk/getting-started)
- [Solidity library reference](/references/solidity-library/getting-started)
