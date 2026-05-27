---
title: Managing Public Decryption
description: Managing public decryption of handles with Nox
---

# Public Decryption

A handle can be made publicly decryptable, allowing anyone to decrypt its value
and use the handle as an input.

::: info

Anyone can get the decrypted value of a publicly decryptable handle with the
[`publicDecrypt` method of the SDK](/references/js-sdk/methods/publicDecrypt).

:::

## Checking Public Decryption

The Nox protocol smart contract provides a function to check if a specific
handle is publicly decryptable:

```solidity
function isPubliclyDecryptable(bytes32 handle) external view returns (bool);
```

**`isPubliclyDecryptable` ABI:**

```json
[
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "handle",
        "type": "bytes32"
      }
    ],
    "name": "isPubliclyDecryptable",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
```

::: code-group

```ts twoslash [ethers]
/**
 * `isPubliclyDecryptable` ABI fragment
 */
const NOX_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'handle',
        type: 'bytes32',
      },
    ],
    name: 'isPubliclyDecryptable',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
// ---cut---
import { BrowserProvider, Contract, type AbstractProvider } from 'ethers';

const provider: AbstractProvider = new BrowserProvider(
  (window as any).ethereum
) as AbstractProvider;

const handle = '0xHandle';

/**
 * Nox protocol contract address, depending on the network.
 *
 * See deployment page for more details.
 */
const NOX_CONTRACT_ADDRESS: `0x${string}` =
  '0xd464B198f06756a1d00be223634b85E0a731c229';

const noxContract = new Contract(
  NOX_CONTRACT_ADDRESS,
  NOX_CONTRACT_ABI,
  provider
);
const isPubliclyDecryptable: boolean = // [!code focus]
  await noxContract.isPubliclyDecryptable(handle); // [!code focus]
```

```ts twoslash [viem]
/**
 * `isPubliclyDecryptable` ABI fragment
 */
const NOX_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'handle',
        type: 'bytes32',
      },
    ],
    name: 'isPubliclyDecryptable',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
// ---cut---
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const handle = '0xHandle';

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

/**
 * Nox protocol contract address, depending on the network.
 *
 * See deployment page for more details.
 */
const NOX_CONTRACT_ADDRESS: `0x${string}` =
  '0xd464B198f06756a1d00be223634b85E0a731c229';

const isPubliclyDecryptable = await publicClient.readContract({
  // [!code focus]
  address: NOX_CONTRACT_ADDRESS, // [!code focus]
  abi: NOX_CONTRACT_ABI, // [!code focus]
  functionName: 'isPubliclyDecryptable', // [!code focus]
  args: [handle], // [!code focus]
}); // [!code focus]
```

:::

## Allowing Public Decryption

The Nox protocol smart contract provides a function for admins to make a handle
publicly decryptable:

::: info

Only allowed admins can make a handle publicly decryptable. (see
[Manage Admins](/guides/manage-handle-access/admins) guide for more details on
admins management).

:::

::: warning

Once a handle is made publicly decryptable, it cannot be reversed.

Anyone can decrypt and store the value once it is public. Revoking public access
would not erase copies already made.

:::

```solidity
function allowPublicDecryption(bytes32 handle) external;
```

**`allowPublicDecryption` ABI:**

```json
[
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "handle",
        "type": "bytes32"
      }
    ],
    "name": "allowPublicDecryption",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

::: code-group

```ts twoslash [ethers]
/**
 * `allowPublicDecryption` ABI fragment
 */
const NOX_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'handle',
        type: 'bytes32',
      },
    ],
    name: 'allowPublicDecryption',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
// ---cut---
import {
  BrowserProvider,
  Contract,
  type AbstractSigner,
  type Provider,
} from 'ethers';

const signer: BrowserProvider | AbstractSigner<Provider> = new BrowserProvider(
  (window as any).ethereum
);

const handle = '0xHandle';

/**
 * Nox protocol contract address, depending on the network.
 *
 * See deployment page for more details.
 */
const NOX_CONTRACT_ADDRESS: `0x${string}` =
  '0xd464B198f06756a1d00be223634b85E0a731c229';

const noxContract = new Contract(
  NOX_CONTRACT_ADDRESS,
  NOX_CONTRACT_ABI,
  signer
);
const tx = await noxContract.allowPublicDecryption(handle); // [!code focus]
await tx.wait(); // [!code focus]
```

```ts twoslash [viem]
/**
 * `allowPublicDecryption` ABI fragment
 */
const NOX_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'handle',
        type: 'bytes32',
      },
    ],
    name: 'allowPublicDecryption',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
// ---cut---
import {
  createWalletClient,
  http,
  custom,
  type WalletClient,
  type Chain,
} from 'viem';
import { arbitrumSepolia } from 'viem/chains';

/**
 * Current network.
 */
const CHAIN: Chain = arbitrumSepolia as Chain;

const handle = '0xHandle';

const walletClient: WalletClient = createWalletClient({
  transport: custom((window as any).ethereum),
  chain: CHAIN,
});

/**
 * Nox protocol contract address, depending on the network.
 *
 * See deployment page for more details.
 */
const NOX_CONTRACT_ADDRESS: `0x${string}` =
  '0xd464B198f06756a1d00be223634b85E0a731c229';

const [userAddress] = await walletClient.getAddresses();

await walletClient.writeContract({
  // [!code focus]
  account: userAddress, // [!code focus]
  chain: CHAIN, // [!code focus]
  address: NOX_CONTRACT_ADDRESS, // [!code focus]
  abi: NOX_CONTRACT_ABI, // [!code focus]
  functionName: 'allowPublicDecryption', // [!code focus]
  args: [handle], // [!code focus]
}); // [!code focus]
```

:::
