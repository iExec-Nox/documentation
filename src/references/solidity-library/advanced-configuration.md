---
title: Advanced Configuration
description: Advanced configuration for Nox Solidity Library
---

## Overview

While `TEEChainConfig` provides automatic network configuration, you may need custom setup for unsupported networks, testing, or specific deployment scenarios.

## Manual Configuration

### Without TEEChainConfig

If you can't use `TEEChainConfig` (e.g., unsupported network), configure manually:

```solidity
import {TEEPrimitive} from "@iexec/nox-solidity";

contract MyContract {
    TEEComputeManager internal immutable teeManager;
    ACL internal immutable acl;

    constructor(
        address _teeComputeManager,
        address _acl
    ) {
        teeManager = TEEComputeManager(_teeComputeManager);
        acl = ACL(_acl);
        
        // Configure the library
        TEEPrimitive.TEEServicesConfig memory config = TEEPrimitive.TEEServicesConfig({
            computeManager: _teeComputeManager,
            acl: _acl
        });
        TEEPrimitive.setTEEServices(config);
    }
}
```

## Custom Network Configuration

### Extending TEEChainConfig

Add support for additional networks by extending `TEEChainConfig`:

```solidity
import {TEEChainConfig} from "@iexec/nox-solidity";

abstract contract CustomTEEChainConfig is TEEChainConfig {
    function _getTEEServicesConfig() 
        private 
        view 
        override 
        returns (TEEPrimitive.TEEServicesConfig memory) 
    {
        if (block.chainid == 31337) {
            // Hardhat Local
            return TEEPrimitive.TEEServicesConfig({
                computeManager: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512,
                acl: 0x5FbDB2315678afecb367f032d93F642f64180aa3
            });
        } else if (block.chainid == 421614) {
            // Arbitrum Sepolia
            return TEEPrimitive.TEEServicesConfig({
                computeManager: 0x9f1d71A870D586235caadbB3C29735f028bC7336,
                acl: 0x3E577D754bF662F1Ad0d20F62A0E99139C3C3B62
            });
        } else if (block.chainid == 42161) {
            // Arbitrum One
            return TEEPrimitive.TEEServicesConfig({
                computeManager: 0xc6AaDC4043aD1feB1e1d59F1F05553f8c696C7FD,
                acl: 0x8f1cfF5Cf6a1838fEb5077D5786955a04A1a44Db
            });
        } else if (block.chainid == YOUR_CHAIN_ID) {
            // Your custom network
            return TEEPrimitive.TEEServicesConfig({
                computeManager: YOUR_COMPUTE_MANAGER_ADDRESS,
                acl: YOUR_ACL_ADDRESS
            });
        } else {
            revert TEEProtocolUnsupported();
        }
    }
}

// Use in your contract
contract MyContract is CustomTEEChainConfig {
    // Your contract code
}
```

## Storage Configuration

### ERC-7201 Compatible Storage

The library uses a fixed storage slot (ERC-7201) to prevent storage collisions:

```solidity
bytes32 private constant TEE_SERVICES_CONFIG_SLOT =
    keccak256("confidential.math.tee.services.config");
```

This ensures your contract's storage variables won't conflict with the library's configuration.

### Storage Structure

```solidity
struct TEEServicesConfig {
    address computeManager; // TEEComputeManager contract
    address acl;            // ACL contract
}
```

## Testing Configuration

### Hardhat Setup

For local testing with Hardhat:

```solidity
// contracts/TestConfig.sol
import {TEEChainConfig} from "@iexec/nox-solidity";

abstract contract TestTEEChainConfig is TEEChainConfig {
    function _getTEEServicesConfig() 
        private 
        view 
        override 
        returns (TEEPrimitive.TEEServicesConfig memory) 
    {
        // Use deployed test contracts
        return TEEPrimitive.TEEServicesConfig({
            computeManager: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512,
            acl: 0x5FbDB2315678afecb367f032d93F642f64180aa3
        });
    }
}
```

### Foundry Setup

```solidity
// src/TestConfig.sol
import {TEEChainConfig} from "@iexec/nox-solidity";

abstract contract TestTEEChainConfig is TEEChainConfig {
    function _getTEEServicesConfig() 
        private 
        view 
        override 
        returns (TEEPrimitive.TEEServicesConfig memory) 
    {
        // Use foundry's vm.addr() or deployed addresses
        return TEEPrimitive.TEEServicesConfig({
            computeManager: address(0x1234...),
            acl: address(0x5678...)
        });
    }
}
```

## Upgradeable Contracts

### UUPS Pattern

For upgradeable contracts using UUPS:

```solidity
import {TEEPrimitive} from "@iexec/nox-solidity";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract UpgradeableContract is UUPSUpgradeable {
    TEEComputeManager internal teeManager;
    ACL internal acl;

    function initialize(
        address _teeComputeManager,
        address _acl
    ) external initializer {
        __UUPSUpgradeable_init();
        
        teeManager = TEEComputeManager(_teeComputeManager);
        acl = ACL(_acl);
        
        TEEPrimitive.TEEServicesConfig memory config = TEEPrimitive.TEEServicesConfig({
            computeManager: _teeComputeManager,
            acl: _acl
        });
        TEEPrimitive.setTEEServices(config);
    }
}
```

## Environment-Specific Configuration

### Using Environment Variables

Configure addresses via environment variables in your deployment scripts:

```javascript
// hardhat.config.js
require('dotenv').config();

module.exports = {
  networks: {
    sepolia: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      teeComputeManager: process.env.TEE_COMPUTE_MANAGER,
      acl: process.env.ACL_ADDRESS,
    }
  }
};
```

```solidity
// Deploy with addresses from config
constructor() {
    address computeManager = 0x...; // From deployment
    address aclAddress = 0x...;      // From deployment
    
    TEEPrimitive.TEEServicesConfig memory config = TEEPrimitive.TEEServicesConfig({
        computeManager: computeManager,
        acl: aclAddress
    });
    TEEPrimitive.setTEEServices(config);
}
```

## Error Handling

### Custom Error Messages

Handle unsupported networks gracefully:

```solidity
error UnsupportedNetwork(uint256 chainId);

function _getTEEServicesConfig() 
    private 
    view 
    returns (TEEPrimitive.TEEServicesConfig memory) 
{
    if (block.chainid == 421614) {
        // Arbitrum Sepolia config
        return TEEPrimitive.TEEServicesConfig({...});
    }
    
    revert UnsupportedNetwork(block.chainid);
}
```

## Best Practices

### 1. Immutable Configuration

Store configuration addresses as `immutable` to save gas:

```solidity
TEEComputeManager internal immutable teeManager;
ACL internal immutable acl;
```

### 2. Validate Addresses

Always validate addresses in constructor:

```solidity
constructor(address _computeManager, address _acl) {
    require(_computeManager != address(0), "Invalid compute manager");
    require(_acl != address(0), "Invalid ACL");
    // ...
}
```

### 3. Network Detection

Use `block.chainid` for network detection:

```solidity
if (block.chainid == 421614) {
    // Sepolia config
}
```

### 4. Configuration Events

Emit events when configuration changes (for upgradeable contracts):

```solidity
event TEEServicesConfigured(
    address indexed computeManager,
    address indexed acl
);
```

## Troubleshooting

### Storage Collisions

If you encounter storage issues, ensure you're not using the same storage slot:

```solidity
// ❌ Don't use the library's slot
bytes32 constant CONFIG_SLOT = keccak256("confidential.math.tee.services.config");

// ✅ Use a different slot
bytes32 constant MY_CONFIG_SLOT = keccak256("my.contract.config");
```

### Network Not Supported

If your network isn't supported:
1. Deploy TEEComputeManager and ACL contracts
2. Use manual configuration
3. Or extend `TEEChainConfig` with your network

## Related

- [Getting Started](/references/solidity-library/getting-started) - Basic setup
- [Available Methods](/references/solidity-library/methods/available-methods) - API reference
- [Nox Smart Contracts](/protocol/nox-smart-contracts) - Protocol contracts
