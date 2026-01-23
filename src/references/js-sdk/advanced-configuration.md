---
title: Advanced Configuration
description: Advanced configuration for Nox JS SDK
---

## Overview

The Nox JS SDK supports advanced configuration options for customizing Gateway URLs, smart contract addresses, and other protocol parameters.

## Configuration Options

### Basic Configuration

When creating a client, you can optionally provide a configuration object:

```typescript
import { createEthersHandleClient } from "@iexec/handles";

const config = {
  gatewayUrl: "https://gateway.nox.example.com",
  smartContractAddress: "0x...",
  chainId: 421614, // Arbitrum Sepolia
};

const handlesClient = createEthersHandleClient(signer, config);
```

### Configuration Type

```typescript
type HandleClientConfig = {
  gatewayUrl?: string;           // Gateway endpoint URL
  smartContractAddress?: string; // TEEComputeManager contract address
  chainId?: number;              // Chain ID for the network
  timeout?: number;              // Request timeout in milliseconds
  retries?: number;              // Number of retry attempts
};
```

## Gateway Configuration

### Custom Gateway URL

By default, the SDK uses the Gateway URL configured for your network. You can override this:

```typescript
const config = {
  gatewayUrl: "https://custom-gateway.example.com",
};

const handlesClient = createEthersHandleClient(signer, config);
```

### Gateway Endpoints

The SDK communicates with the Gateway using gRPC for optimal performance. The Gateway URL should point to the gRPC endpoint.

## Network Configuration

### Supported Networks

The SDK automatically detects the network from your provider/signer, but you can explicitly set it:

```typescript
const config = {
  chainId: 421614, // Arbitrum Sepolia
};

const handlesClient = createEthersHandleClient(signer, config);
```

Supported networks:
- **Arbitrum Sepolia** (chainId: 421614)
- **Arbitrum One** (chainId: 42161)
- **Hardhat Local** (chainId: 31337)

### Smart Contract Addresses

Contract addresses are automatically resolved based on the chain ID. To use custom addresses:

```typescript
const config = {
  smartContractAddress: "0xYourTEEComputeManagerAddress",
  aclAddress: "0xYourACLAddress", // Optional
  registryAddress: "0xYourRegistryAddress", // Optional
};

const handlesClient = createEthersHandleClient(signer, config);
```

## Request Configuration

### Timeout Settings

Configure request timeouts for Gateway communication:

```typescript
const config = {
  timeout: 30000, // 30 seconds
};

const handlesClient = createEthersHandleClient(signer, config);
```

### Retry Configuration

Configure automatic retries for failed requests:

```typescript
const config = {
  retries: 3, // Retry up to 3 times on failure
  retryDelay: 1000, // Wait 1 second between retries
};

const handlesClient = createEthersHandleClient(signer, config);
```

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

## Custom Signer Configuration

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

## Error Handling Configuration

### Custom Error Handlers

```typescript
const handlesClient = createEthersHandleClient(signer, {
  onError: (error, context) => {
    console.error("SDK Error:", error);
    console.error("Context:", context);
    // Custom error handling logic
  },
});
```

## Logging Configuration

### Enable Debug Logging

```typescript
const config = {
  debug: true, // Enable debug logging
  logLevel: "debug", // 'info', 'warn', 'error', 'debug'
};

const handlesClient = createEthersHandleClient(signer, config);
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
