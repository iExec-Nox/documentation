---
title: Advanced Configuration
description: Advanced configuration for Nox JS SDK
---

# Advanced Configuration

You can customize the SDK by passing a configuration object when creating the
client. These options are for advanced use cases — you won't need them for
standard usage on supported networks.

## Usage

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const signer = new BrowserProvider(window.ethereum);

const handleClient = await createEthersHandleClient(signer, {
  gatewayUrl: 'https://gateway.custom.example.com',
  smartContractAddress: '0xYourContractAddress',
});
```

## Parameters

```ts twoslash
import type { HandleClientConfig } from '@iexec-nox/handle';
```

### gatewayUrl <Optional />

**Type:** `string` (base URL without path or query parameters)

The Gateway endpoint URL. The SDK communicates with the Gateway for encryption
and decryption operations.

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const signer = new BrowserProvider(window.ethereum);

const handleClient = await createEthersHandleClient(signer, {
  gatewayUrl: 'https://gateway.custom.example.com', // [!code focus]
});
```

If not provided, the default Gateway URL for the detected network will be used.

### smartContractAddress <Optional />

**Type:** `string` (Ethereum address)

The address of the Nox protocol contract used for handle verification.

```ts twoslash
declare global {
  interface Window {
    ethereum: any;
  }
}
// ---cut---
import { createEthersHandleClient } from '@iexec-nox/handle';
import { BrowserProvider } from 'ethers';

const signer = new BrowserProvider(window.ethereum);

const handleClient = await createEthersHandleClient(signer, {
  smartContractAddress: '0xYourTEEComputeManagerAddress', // [!code focus]
});
```

If not provided, the default contract address for the detected network will be
used.

## Supported Networks

The SDK automatically resolves configuration for supported networks based on the
chain ID detected from your provider:

| Network          | Chain ID |
| ---------------- | -------- |
| Arbitrum Sepolia | 421614   |

To use an unsupported chain, you must provide both `gatewayUrl` and
`smartContractAddress`.

## Advanced Usage Examples

::: code-group

```ts twoslash [Ethers.js]
declare const RPC_URL: string;
declare const PRIVATE_KEY: string;
declare const GATEWAY_URL: `https://${string}`;
declare const CONTRACT_ADDRESS: `0x${string}`;
// ---cut---
import { createEthersHandleClient } from '@iexec-nox/handle';
import { JsonRpcProvider, Wallet } from 'ethers';

const provider = new JsonRpcProvider(RPC_URL);
const signer = new Wallet(PRIVATE_KEY, provider);

const handleClient = await createEthersHandleClient(signer, {
  gatewayUrl: GATEWAY_URL,
  smartContractAddress: CONTRACT_ADDRESS,
});
```

```ts twoslash [Viem]
declare const RPC_URL: string;
declare const PRIVATE_KEY: `0x${string}`;
declare const GATEWAY_URL: `https://${string}`;
declare const CONTRACT_ADDRESS: `0x${string}`;
// ---cut---
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const walletClient = createWalletClient({
  account: privateKeyToAccount(PRIVATE_KEY),
  transport: http(RPC_URL),
});

const handleClient = await createViemHandleClient(walletClient, {
  gatewayUrl: GATEWAY_URL,
  smartContractAddress: CONTRACT_ADDRESS,
});
```

:::
