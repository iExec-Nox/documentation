---
title: Available Methods
description: Available methods in Nox Solidity Library
---

## Overview

The TEEPrimitive library provides methods for encryption, input verification, arithmetic operations, and utility functions. All methods are `internal` and must be called from within your contract.

## Configuration Methods

### `setTEEServices`

Configures the TEE service addresses for the library.

```solidity
function setTEEServices(TEEServicesConfig memory _config) internal
```

**Parameters:**

```solidity
struct TEEServicesConfig {
    address computeManager; // TEEComputeManager contract address
    address acl;            // ACL contract address
}
```

**Usage:**

Typically called automatically by `TEEChainConfig` constructor. For manual configuration, see [Advanced Configuration](/references/solidity-library/advanced-configuration).

## Trivial Encryption Methods

Create encrypted handles from plaintext values. These methods emit `TrivialEncrypt` events and return handles wrapped in encrypted types.

### `asEuint8` through `asEuint256`

```solidity
function asEuint8(uint8 value) internal returns (euint8)
function asEuint16(uint16 value) internal returns (euint16)
function asEuint32(uint32 value) internal returns (euint32)
function asEuint64(uint64 value) internal returns (euint64)
function asEuint128(uint128 value) internal returns (euint128)
function asEuint256(uint256 value) internal returns (euint256)
```

**Description:** Creates an encrypted handle for a public plaintext value. Useful for initializing counters, constants, or converting public values for use in confidential computations.

**Parameters:**
- `value`: The plaintext value to encrypt

**Returns:** Encrypted type wrapped around the generated handle

**Example:**

```solidity
// Initialize a counter to zero
euint256 counter = TEEPrimitive.asEuint256(0);

// Create an encrypted constant
euint64 maxValue = TEEPrimitive.asEuint64(1000);
```

**Gas Cost:** Low (emits event, no external call)

## Input Verification Methods

### `fromExternal`

Verifies an external handle (from SDK or another contract) and converts it to an internal encrypted type.

```solidity
function fromExternal(
    externalEuint256 inputHandle,
    bytes memory inputProof
) internal returns (euint256)
```

**Description:** 
- Verifies the EIP-712 proof signed by the Gateway
- Grants transient access permissions via ACL
- Converts external handle to internal encrypted type

**Parameters:**
- `inputHandle`: External handle (from SDK encryption)
- `inputProof`: EIP-712 proof signed by Gateway

**Returns:** Internal `euint256` that can be used in computations

**Example:**

```solidity
function deposit(externalEuint256 amountHandle, bytes memory inputProof) external {
    euint256 amount = TEEPrimitive.fromExternal(amountHandle, inputProof);
    balance = TEEPrimitive.add(balance, amount);
}
```

**Gas Cost:** Medium (on-chain verification, ACL update)

**Errors:**
- Reverts if proof is invalid
- Reverts if Gateway signature doesn't match Registry

## Arithmetic Operations

Perform confidential computations on encrypted values. These operations emit events that trigger off-chain TEE execution.

### `add`

Adds two encrypted values.

```solidity
function add(euint256 a, euint256 b) internal returns (euint256)
```

**Description:** 
- Adds two encrypted integers without decrypting
- Emits `Add` event for off-chain TEE processing
- Returns handle to result (computation happens asynchronously)
- Defaults uninitialized values to 0

**Parameters:**
- `a`: First encrypted value
- `b`: Second encrypted value

**Returns:** Handle to encrypted result

**Example:**

```solidity
euint256 sum = TEEPrimitive.add(balance, amount);
```

**Gas Cost:** Low (event emission only)

### `sub`

Subtracts two encrypted values.

```solidity
function sub(euint256 a, euint256 b) internal returns (euint256)
```

**Description:** 
- Subtracts `b` from `a` without decrypting
- Emits `Sub` event for off-chain TEE processing
- Returns handle to result
- Defaults uninitialized values to 0

**Parameters:**
- `a`: Minuend (value to subtract from)
- `b`: Subtrahend (value to subtract)

**Returns:** Handle to encrypted result

**Example:**

```solidity
euint256 difference = TEEPrimitive.sub(balance, amount);
```

**Gas Cost:** Low (event emission only)

### Additional Operations

More arithmetic operations are available (TBD):
- `mul` - Multiplication
- `div` - Division
- `mod` - Modulo
- `select` - Conditional selection
- And more...

## Utility Methods

### `isInitialized`

Checks if an encrypted value has been initialized.

```solidity
function isInitialized(euint256 v) internal pure returns (bool)
```

**Description:** 
- Returns `true` if the handle is not zero
- Useful for checking if state variables have been set

**Parameters:**
- `v`: Encrypted value to check

**Returns:** `true` if initialized, `false` otherwise

**Example:**

```solidity
require(TEEPrimitive.isInitialized(balance), "Balance not initialized");
```

**Gas Cost:** Negligible (pure function)

## Type System

### Internal Types

Used for values created and used within your contract:

- `euint8`, `euint16`, `euint32`, `euint64`, `euint128`, `euint256`

### External Types

Used for handles received from outside (SDK, other contracts):

- `externalEuint8`, `externalEuint16`, `externalEuint32`, `externalEuint64`, `externalEuint128`, `externalEuint256`

### Type Conversion

External types must be converted to internal types before use:

```solidity
// ❌ Wrong - can't use external type directly
euint256 result = TEEPrimitive.add(externalAmount, balance);

// ✅ Correct - convert first
euint256 amount = TEEPrimitive.fromExternal(externalAmount, proof);
euint256 result = TEEPrimitive.add(amount, balance);
```

## Method Categories

### Zero Gas Operations

These methods only emit events and don't require external calls:
- `asEuintX` - Trivial encryption
- `add`, `sub` - Arithmetic operations

### Gas-Consuming Operations

These methods interact with on-chain contracts:
- `fromExternal` - Verifies proof and updates ACL

## Best Practices

### 1. Check Initialization

Always verify encrypted values are initialized:

```solidity
require(TEEPrimitive.isInitialized(balance), "Balance not set");
```

### 2. Grant Permissions

After creating or modifying handles, grant appropriate permissions:

```solidity
// Grant to caller
acl.allowThis(euint256.unwrap(result));

// Grant to specific address
acl.allow(euint256.unwrap(result), recipient);
```

### 3. Choose Appropriate Types

Use the smallest type that fits your data range:

```solidity
euint64 smallValue;  // For values < 2^64
euint256 largeValue; // For full uint256 range
```

### 4. Handle External Inputs

Always verify external handles before use:

```solidity
euint256 verified = TEEPrimitive.fromExternal(externalHandle, proof);
// Now safe to use in computations
```

## Related

- [Getting Started](/references/solidity-library/getting-started) - Basic usage examples
- [Advanced Configuration](/references/solidity-library/advanced-configuration) - Custom setup
- [Nox Smart Contracts](/protocol/nox-smart-contracts) - Protocol contracts
