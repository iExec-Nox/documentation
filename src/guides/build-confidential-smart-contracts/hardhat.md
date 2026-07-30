---
title: Hardhat
description:
  Build and test confidential smart contracts with the Nox Hardhat plugin
---

# Hardhat Plugin

![Hardhat x Nox](../../assets/images/hardhat-x-nox.png)

## Prerequisites

- **Node.js** 22 or higher
- **Docker** installed and running locally (the offchain stack runs in Docker
  containers)
- A **Hardhat 3** project using either the
  [`@nomicfoundation/hardhat-toolbox-viem`](https://hardhat.org/plugins/nomicfoundation-hardhat-toolbox-viem)
  toolbox (Viem) or the
  [`@nomicfoundation/hardhat-ethers`](https://hardhat.org/plugins/nomicfoundation-hardhat-ethers)
  plugin (Ethers). The plugin auto-detects whichever one your project enables.

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

`hardhat` is a required peer dependency. On top of it you must install **one**
of the two integrations, depending on your stack: the Viem toolbox
(`@nomicfoundation/hardhat-toolbox-viem`) or the Ethers plugin
(`@nomicfoundation/hardhat-ethers`). Install the one your project uses, you
don't need both.

## Configuration

Register the plugin in your `hardhat.config.ts`, alongside your Viem toolbox or
Ethers plugin. Your default network must use the `op` chain type:

::: code-group

```ts [Viem]
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

```ts [Ethers]
import hardhatEthersPlugin from '@nomicfoundation/hardhat-ethers';
import { defineConfig } from 'hardhat/config';
import noxPlugin from '@iexec-nox/nox-hardhat-plugin';

export default defineConfig({
  plugins: [hardhatEthersPlugin, noxPlugin],
  solidity: '0.8.35',
  networks: {
    default: {
      type: 'edr-simulated',
      chainType: 'op',
    },
  },
});
```

:::

That is all the configuration required.

### Plugin options

By default the plugin boots a local offchain stack for whichever network you
connect to. If you'd rather point it at an already-running stack (for example a
shared staging deployment), add a `nox` block to that network's entry under
`networks` in your config:

```ts
import { defineConfig } from 'hardhat/config';

export default defineConfig({
  // ...
  networks: {
    staging: {
      type: 'http',
      url: 'https://staging.example.com',
      nox: {
        noxComputeAddress: '0x...',
        handleGatewayUrl: 'https://staging-gateway.example.com',
      },
    },
  },
});
```

The `nox` block is only valid on `http`-type network entries. When it's present,
`nox.connect()` skips booting a local stack and talks to the
`noxComputeAddress`/`handleGatewayUrl` you provided instead.

## Running tests

The plugin no longer overrides the built-in `test` task, so `hardhat test` runs
your test suite as-is: it won't boot the offchain stack on its own. Call
`nox.connect(connection)` yourself in a setup step before your tests run, using
a `NetworkConnection` obtained from Hardhat:

```ts
import { before, describe, it } from 'node:test';
import { network } from 'hardhat';
import { nox } from '@iexec-nox/nox-hardhat-plugin';

describe('MyConfidentialToken', () => {
  before(async () => {
    const connection = await network.getOrCreate('default');
    await nox.connect(connection);
  });

  it('resolves a publicly decryptable total supply', async () => {
    // ...
  });
});
```

The first call to `nox.connect()` pulls the offchain service images from
DockerHub and may take a while; subsequent runs reuse existing images.

<!-- prettier-ignore -->
::: tip
The offchain services run in Docker. Make sure the Docker daemon is started
before running your tests, otherwise the stack setup will fail.
:::

## Writing a test

The plugin exposes a `nox` helper. Call `nox.connect(connection)` with a Hardhat
`NetworkConnection` to boot (or attach to) the offchain stack; it resolves to an
object exposing a pre-configured
[Handle SDK](/references/js-sdk/getting-started) client so your tests can
encrypt and decrypt without any manual setup. Get `viem`/`ethers` from the
`connection` you passed in, not from `nox.connect()`'s return value.

::: code-group

```ts [Viem]
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import { network } from 'hardhat';
import { nox } from '@iexec-nox/nox-hardhat-plugin';

describe('MyConfidentialToken', () => {
  it('resolves a publicly decryptable total supply', async () => {
    const connection = await network.getOrCreate('default');
    const { viem } = connection;
    const { publicDecrypt } = await nox.connect(connection);

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
    const { value } = await publicDecrypt(handle);
    assert.equal(value, 1000n);
  });
});
```

```ts [Ethers]
import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import { network } from 'hardhat';
import { nox } from '@iexec-nox/nox-hardhat-plugin';

describe('MyConfidentialToken', () => {
  it('resolves a publicly decryptable total supply', async () => {
    const connection = await network.getOrCreate('default');
    const { ethers } = connection;
    const { publicDecrypt } = await nox.connect(connection);

    // Deploy a confidential contract with the standard Ethers helpers.
    const token = await ethers.deployContract('MyConfidentialToken', [
      'My Confidential Token',
      'MCT',
      'ipfs://example',
      1000n,
    ]);

    // Read an encrypted handle from the contract.
    const handle = (await token.confidentialTotalSupply()) as `0x${string}`;

    // Ask the Nox stack to decrypt it and assert on the cleartext value.
    const { value } = await publicDecrypt(handle);
    assert.equal(value, 1000n);
  });
});
```

:::

## The `nox` API

`nox.connect(connection: NetworkConnection): Promise<NoxConnection>` boots (or
attaches to) the offchain stack for the given Hardhat `NetworkConnection` and
resolves to a `NoxConnection` object with the following members:

| Member                                                   | Description                                                                                                                 |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `noxComputeAddress`                                      | The address of the `NoxCompute` contract for this connection.                                                               |
| `handleGatewayUrl`                                       | The URL of the Handle Gateway backing this connection.                                                                      |
| `encryptInput(value, solidityType, applicationContract)` | Encrypts a plaintext value for a given contract and returns a `{ handle, handleProof }` pair to forward to a contract call. |
| `decrypt(handle)`                                        | Decrypts an ACL-protected handle and returns its cleartext `value` (signs an EIP-712 authorization, no gas).                |
| `publicDecrypt(handle)`                                  | Decrypts a publicly decryptable handle and returns its `value` plus a `decryptionProof`.                                    |

`connection.viem`/`connection.ethers`, along with `connection.provider` and
`connection.close()`, remain on the `NetworkConnection` you passed in — they are
not part of the `NoxConnection` returned by `nox.connect()`.

## Next steps

- [Create a confidential ERC-7984 token](/guides/build-confidential-tokens/erc7984-token)
- [Nox JS SDK reference](/references/js-sdk/getting-started)
- [Solidity library reference](/references/solidity-library/getting-started)
