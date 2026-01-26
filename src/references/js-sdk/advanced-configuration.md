---
title: Advanced Configuration
description: Advanced configuration for Nox JS SDK
---

The `createEthersHandleClient` and `createViemHandleClient` constructors accept configuration options object. As these options are very specific, you won't need to use them for a standard usage of `@iexec/handles`.

## Parameters

```typescript
import { type HandleClientConfig } from "@iexec/handles";
```

### gatewayUrl

The Gateway endpoint URL for gRPC communication. The SDK communicates with the Gateway using gRPC for optimal performance.

```typescript
const handlesClient = createEthersHandleClient(signer, {
  gatewayUrl: "https://gateway.nox.example.com",
});
```

If not provided, the default Gateway URL provided by iExec will be used for your network.

### smartContractAddress

The Ethereum contract address for the TEEComputeManager contract.

```typescript
const handlesClient = createEthersHandleClient(signer, {
  smartContractAddress: "0xYourTEEComputeManagerAddress",
});
```

If not provided, the default contract address provided by iExec will be used based on the chain ID.

### chainId

The chain ID for the network. The SDK automatically detects the network from your provider/signer, but you can explicitly set it.

```typescript
const handlesClient = createEthersHandleClient(signer, {
  chainId: 421614, // Arbitrum Sepolia
});
```

Supported networks:
- **Arbitrum Sepolia** (chainId: 421614)
- **Arbitrum One** (chainId: 42161)
- **Hardhat Local** (chainId: 31337)

If not provided, the chain ID will be automatically detected from your provider/signer.

### timeout

Request timeout in milliseconds for Gateway communication.

```typescript
const handlesClient = createEthersHandleClient(signer, {
  timeout: 30000, // 30 seconds
});
```

If not provided, the default timeout provided by iExec will be used.

### retries

Number of retry attempts for failed requests.

```typescript
const handlesClient = createEthersHandleClient(signer, {
  retries: 3, // Retry up to 3 times on failure
});
```

If not provided, the default retry configuration provided by iExec will be used.

### retryDelay

Delay in milliseconds between retry attempts.

```typescript
const handlesClient = createEthersHandleClient(signer, {
  retries: 3,
  retryDelay: 1000, // Wait 1 second between retries
});
```

If not provided, the default retry delay provided by iExec will be used.

### aclAddress

The Ethereum contract address for the ACL (Access Control List) contract. Optional.

```typescript
const handlesClient = createEthersHandleClient(signer, {
  aclAddress: "0xYourACLAddress",
});
```

If not provided, the default ACL contract address provided by iExec will be used based on the chain ID.

### registryAddress

The Ethereum contract address for the Registry contract. Optional.

```typescript
const handlesClient = createEthersHandleClient(signer, {
  registryAddress: "0xYourRegistryAddress",
});
```

If not provided, the default Registry contract address provided by iExec will be used based on the chain ID.

## Environment Variables

You can configure the SDK using environment variables:

```bash
# .env file
NOX_GATEWAY_URL=https://gateway.nox.example.com
NOX_CHAIN_ID=421614
NOX_TIMEOUT=30000
```

```typescript
// SDK will automatically read from environment
const handlesClient = createEthersHandleClient(signer);
```

## Advanced Usage Examples

### Ethers.js Advanced Setup

```typescript
import { createEthersHandleClient } from "@iexec/handles";
import { ethers } from "ethers";

// Custom provider configuration
const provider = new ethers.JsonRpcProvider({
  url: RPC_URL,
  timeout: 30000,
});

// Custom signer with options
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const config = {
  gatewayUrl: GATEWAY_URL,
  chainId: 421614,
};

const handlesClient = createEthersHandleClient(signer, config);
```

### Viem Advanced Setup

```typescript
import { createViemHandleClient } from "@iexec/handles";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrumSepolia } from "viem/chains";

const account = privateKeyToAccount(PRIVATE_KEY);

const walletClient = createWalletClient({
  account,
  chain: arbitrumSepolia,
  transport: http({
    timeout: 30000,
  }),
});

const config = {
  gatewayUrl: GATEWAY_URL,
};

const handlesClient = createViemHandleClient(walletClient, config);
```

## Best Practices

### Configuration Management

```typescript
// config.ts
export const getNoxConfig = (chainId: number) => {
  const configs = {
    421614: { // Arbitrum Sepolia
      gatewayUrl: "https://gateway-sepolia.nox.example.com",
      chainId: 421614,
    },
    42161: { // Arbitrum One
      gatewayUrl: "https://gateway-mainnet.nox.example.com",
      chainId: 42161,
    },
    31337: { // Hardhat Local
      gatewayUrl: "http://localhost:8080",
      chainId: 31337,
    },
  };
  
  return configs[chainId] || configs[421614]; // Default to Sepolia
};

// Usage
const chainId = await signer.getChainId();
const config = getNoxConfig(chainId);
const handlesClient = createEthersHandleClient(signer, config);
```

### Type Safety

```typescript
import type { HandleClientConfig } from "@iexec/handles";

const config: HandleClientConfig = {
  gatewayUrl: process.env.NOX_GATEWAY_URL,
  chainId: Number(process.env.NOX_CHAIN_ID),
  timeout: 30000,
};

const handlesClient = createEthersHandleClient(signer, config);
```

## Related

- [Getting Started](/references/js-sdk/getting-started) - Basic setup and usage
- [Gateway](/protocol/gateway) - Gateway service configuration
- [Nox Smart Contracts](/protocol/nox-smart-contracts) - Contract addresses by network
