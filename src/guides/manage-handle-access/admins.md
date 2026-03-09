---
title: Managing Admins
description: Managing handles admins with Nox
---

# Admins

Admins are addresses that have the most permissions on a handle. Admins can:

- decrypt the handle
- use the handle as input to create new handles
- add other addresses as viewers for the handle
- allow other addresses to become admins for the handle
- make the handle publicly decryptable

## Checking Admins

The Nox protocol smart contract provides a function to check if a specific
address is an allowed admin for a given handle:

::: tip

`isAllowed` checks admin access specifically. To check viewer access, use
`isViewer` instead (see [Manage Viewers](/guides/manage-handle-access/viewers)).

:::

```solidity
function isAllowed(bytes32 handle, address account) external view returns (bool);
```

**`isAllowed` ABI:**

```json
[
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "handle",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isAllowed",
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

### with ethers

```ts twoslash
import { BrowserProvider, Contract, type AbstractProvider } from 'ethers';

const provider: AbstractProvider = new BrowserProvider(
  (window as any).ethereum
) as AbstractProvider;

const handle = '0xHandle';
const account = '0xAccountAddress';

/**
 * Nox protocol contract address, depending on the network.
 *
 * See deployment page for more details.
 */
const NOX_CONTRACT_ADDRESS: `0x${string}` =
  '0x5633472D35E18464CA24Ab974954fB3b1B122eA6';

/**
 * `isAllowed` ABI fragment
 */
const NOX_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'handle',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'isAllowed',
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
const noxContract = new Contract(
  NOX_CONTRACT_ADDRESS,
  NOX_CONTRACT_ABI,
  provider
);
const isAllowed: boolean = await noxContract.isAllowed(handle, account);
```

### with viem

```ts twoslash
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const handle = '0xHandle';
const account = '0xAccountAddress';

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
  '0x5633472D35E18464CA24Ab974954fB3b1B122eA6';

/**
 * `isAllowed` ABI fragment
 */
const NOX_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'handle',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'isAllowed',
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
const isAllowed = await publicClient.readContract({
  address: NOX_CONTRACT_ADDRESS,
  abi: NOX_CONTRACT_ABI,
  functionName: 'isAllowed',
  args: [handle, account],
});
```

## Allowing Admins

The Nox protocol smart contract provides a function for admins to allow a
specific address as an admin for a given handle:

::: info

Only allowed admins can allow new admins.

:::

::: warning

Once allowed, an admin cannot be revoked.

:::

```solidity
function allow(bytes32 handle, address account) external;
```

**`allow` ABI:**

```json
[
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "handle",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "allow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

### with ethers

```ts twoslash
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
const accountToAllow = '0xAccountAddress';

/**
 * Nox protocol contract address, depending on the network.
 *
 * See deployment page for more details.
 */
const NOX_CONTRACT_ADDRESS: `0x${string}` =
  '0x5633472D35E18464CA24Ab974954fB3b1B122eA6';

/**
 * `allow` ABI fragment
 */
const NOX_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'handle',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'allow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
// ---cut---
const noxContract = new Contract(
  NOX_CONTRACT_ADDRESS,
  NOX_CONTRACT_ABI,
  signer
);
const tx = await noxContract.allow(handle, accountToAllow);
await tx.wait();
```

### with viem

```ts twoslash
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
const accountToAllow = '0xAccountAddress';

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
  '0x5633472D35E18464CA24Ab974954fB3b1B122eA6';

/**
 * `allow` ABI fragment
 */
const NOX_CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'handle',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'allow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
// ---cut---
const [userAddress] = await walletClient.getAddresses();

await walletClient.writeContract({
  account: userAddress,
  chain: CHAIN,
  address: NOX_CONTRACT_ADDRESS,
  abi: NOX_CONTRACT_ABI,
  functionName: 'allow',
  args: [handle, accountToAllow],
});
```
