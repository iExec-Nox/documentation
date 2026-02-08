---
title: Computation Primitives
description:
  Arithmetic, comparison, selection and token operations executed by the Runner
  on encrypted data
---

# Computation Primitives

This page describes all operations the [Runner](/protocol/runner) can execute on
encrypted data. Each operation takes encrypted input handles, decrypts them
inside the TEE, performs the computation, re-encrypts the results, and stores
them in the [Handle Gateway](/protocol/gateway).

All arithmetic uses **wrapping semantics**, matching Solidity's `unchecked`
behavior. On overflow or underflow, values wrap around the type boundary instead
of reverting.

## PlaintextToEncrypted

Encrypts a plaintext value into an encrypted handle. This is the only operation
with no input handles.

```solidity
function plaintextToEncrypted(euint256 value) returns (euint256);
```

| Inputs | Outputs | Description               |
| ------ | ------- | ------------------------- |
| 0      | 1       | Encrypt a plaintext value |

The Runner forwards the plaintext to the Handle Gateway via `POST /v0/secrets`,
which performs the ECIES encryption and stores the result.

## Core Arithmetic

Binary operations on two encrypted values of the same type. Each takes 2 input
handles and produces 1 output handle.

### Add

```solidity
function add(euint256 lhs, euint256 rhs) returns (euint256);
```

Wrapping addition. On overflow, the result wraps around the type boundary.

- **Unsigned:** `(a + b) mod 2^N`
- **Signed:** wraps from positive MAX to negative MIN on overflow

| Example (Uint8) | Result | Reason                  |
| --------------- | ------ | ----------------------- |
| `200 + 100`     | `44`   | Overflows, wraps around |
| `255 + 1`       | `0`    | Overflows to zero       |
| `100 + 50`      | `150`  | No overflow             |

| Example (Int8) | Result | Reason                       |
| -------------- | ------ | ---------------------------- |
| `100 + 100`    | `-56`  | Overflows, wraps to negative |
| `127 + 1`      | `-128` | Overflows to MIN             |
| `-50 + 30`     | `-20`  | No overflow                  |

### Sub

```solidity
function sub(euint256 lhs, euint256 rhs) returns (euint256);
```

Wrapping subtraction. On underflow, the result wraps around the type boundary.

- **Unsigned:** wraps from 0 to MAX when the result would be negative
- **Signed:** wraps from negative MIN to positive MAX on underflow

| Example (Uint8) | Result | Reason                   |
| --------------- | ------ | ------------------------ |
| `0 - 1`         | `255`  | Underflows, wraps to MAX |
| `10 - 200`      | `66`   | Underflows, wraps around |
| `100 - 30`      | `70`   | No underflow             |

| Example (Int8) | Result | Reason                        |
| -------------- | ------ | ----------------------------- |
| `-128 - 1`     | `127`  | Underflows, wraps to MAX      |
| `-100 - 100`   | `56`   | Underflows, wraps to positive |
| `50 - 30`      | `20`   | No underflow                  |

### Mul

```solidity
function mul(euint256 lhs, euint256 rhs) returns (euint256);
```

Wrapping multiplication. On overflow, the result wraps around the type boundary.

- **Unsigned:** `(a * b) mod 2^N`
- **Signed:** wraps on overflow, same modular behavior

| Example (Uint8) | Result | Reason                  |
| --------------- | ------ | ----------------------- |
| `3 * 100`       | `44`   | Overflows, wraps around |
| `16 * 16`       | `0`    | Overflows to zero       |
| `10 * 5`        | `50`   | No overflow             |

| Example (Int8) | Result | Reason                       |
| -------------- | ------ | ---------------------------- |
| `-1 * -128`    | `-128` | Overflows, wraps back to MIN |
| `10 * 20`      | `-56`  | Overflows, wraps to negative |
| `-5 * 3`       | `-15`  | No overflow                  |

### Div

```solidity
function div(euint256 lhs, euint256 rhs) returns (euint256);
```

Integer division, truncated toward zero. Division by zero does not revert, it
returns a deterministic value instead.

- **Unsigned:** division by zero returns `MAX` (all bits set)
- **Signed:** division by zero returns `-1`; `MIN / -1` wraps back to `MIN`

| Example (Uint8) | Result | Reason                 |
| --------------- | ------ | ---------------------- |
| `10 / 0`        | `255`  | Division by zero → MAX |
| `7 / 2`         | `3`    | Truncated toward zero  |
| `255 / 256`     | `0`    | Truncated toward zero  |

| Example (Int8) | Result | Reason                      |
| -------------- | ------ | --------------------------- |
| `10 / 0`       | `-1`   | Division by zero → -1       |
| `-128 / -1`    | `-128` | Overflow, wraps back to MIN |
| `7 / 2`        | `3`    | Truncated toward zero       |
| `-7 / 2`       | `-3`   | Truncated toward zero       |

## Safe Arithmetic

Same operations as core arithmetic, but returning two handles:
`(success: Bool, result: same_type)`. The `result` is **always** the wrapping
value (identical to the core variant). The `success` flag is `true` when no
overflow/underflow occurred. Each takes 2 input handles and produces 2 output
handles.

### SafeAdd

```solidity
function safeAdd(euint256 lhs, euint256 rhs) returns (ebool, euint256);
```

Wrapping addition with overflow detection.

- **Unsigned:** `success = false` when `a + b > MAX`
- **Signed:** `success = false` when the result crosses the type boundary

| Example (Uint8)     | success | result | Reason           |
| ------------------- | ------- | ------ | ---------------- |
| `SafeAdd(200, 100)` | `false` | `44`   | Overflow         |
| `SafeAdd(255, 1)`   | `false` | `0`    | Overflow to zero |
| `SafeAdd(100, 50)`  | `true`  | `150`  | No overflow      |

| Example (Int8)     | success | result | Reason          |
| ------------------ | ------- | ------ | --------------- |
| `SafeAdd(127, 1)`  | `false` | `-128` | Overflow to MIN |
| `SafeAdd(-50, 30)` | `true`  | `-20`  | No overflow     |

### SafeSub

```solidity
function safeSub(euint256 lhs, euint256 rhs) returns (ebool, euint256);
```

Wrapping subtraction with underflow detection.

- **Unsigned:** `success = false` when `a - b < 0`
- **Signed:** `success = false` when the result crosses the type boundary

| Example (Uint8)  | success | result | Reason           |
| ---------------- | ------- | ------ | ---------------- |
| `SafeSub(0, 1)`  | `false` | `255`  | Underflow to MAX |
| `SafeSub(3, 10)` | `false` | `249`  | Underflow        |
| `SafeSub(10, 3)` | `true`  | `7`    | No underflow     |

| Example (Int8)     | success | result | Reason           |
| ------------------ | ------- | ------ | ---------------- |
| `SafeSub(-128, 1)` | `false` | `127`  | Underflow to MAX |
| `SafeSub(50, 30)`  | `true`  | `20`   | No underflow     |

### SafeMul

```solidity
function safeMul(euint256 lhs, euint256 rhs) returns (ebool, euint256);
```

Wrapping multiplication with overflow detection.

- **Unsigned:** `success = false` when `a * b > MAX`
- **Signed:** `success = false` when the result crosses the type boundary

| Example (Uint8)   | success | result | Reason           |
| ----------------- | ------- | ------ | ---------------- |
| `SafeMul(3, 100)` | `false` | `44`   | Overflow         |
| `SafeMul(16, 16)` | `false` | `0`    | Overflow to zero |
| `SafeMul(10, 5)`  | `true`  | `50`   | No overflow      |

| Example (Int8)      | success | result | Reason          |
| ------------------- | ------- | ------ | --------------- |
| `SafeMul(-1, -128)` | `false` | `-128` | Overflow to MIN |
| `SafeMul(10, 20)`   | `false` | `-56`  | Overflow        |
| `SafeMul(-5, 3)`    | `true`  | `-15`  | No overflow     |

### SafeDiv

```solidity
function safeDiv(euint256 lhs, euint256 rhs) returns (ebool, euint256);
```

Integer division with error detection. The result is the same as core Div.

- **Unsigned:** `success = false` when dividing by zero
- **Signed:** `success = false` when dividing by zero or `MIN / -1`

| Example (Uint8)  | success | result | Reason            |
| ---------------- | ------- | ------ | ----------------- |
| `SafeDiv(10, 0)` | `false` | `255`  | Division by zero  |
| `SafeDiv(7, 2)`  | `true`  | `3`    | Truncated to zero |

| Example (Int8)      | success | result | Reason            |
| ------------------- | ------- | ------ | ----------------- |
| `SafeDiv(10, 0)`    | `false` | `-1`   | Division by zero  |
| `SafeDiv(-128, -1)` | `false` | `-128` | Signed overflow   |
| `SafeDiv(-7, 2)`    | `true`  | `-3`   | Truncated to zero |

## Comparisons

Compare two encrypted values and return an encrypted boolean. Each takes 2 input
handles and produces 1 Bool output handle. Comparison semantics depend on the
type: unsigned for `UintN`, signed for `IntN`.

### Eq

```solidity
function eq(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a == b`.

| Example (Uint8) | Result  | Reason           |
| --------------- | ------- | ---------------- |
| `Eq(42, 42)`    | `true`  | Equal values     |
| `Eq(0, 255)`    | `false` | Different values |

### Ne

```solidity
function ne(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a != b`.

| Example (Uint8) | Result  | Reason           |
| --------------- | ------- | ---------------- |
| `Ne(42, 42)`    | `false` | Equal values     |
| `Ne(0, 255)`    | `true`  | Different values |

### Lt

```solidity
function lt(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a < b`.

| Example (Uint8) | Result  | Reason              |
| --------------- | ------- | ------------------- |
| `Lt(10, 200)`   | `true`  | 10 < 200 (unsigned) |
| `Lt(200, 10)`   | `false` | 200 < 10 is false   |

| Example (Int8)  | Result  | Reason              |
| --------------- | ------- | ------------------- |
| `Lt(-56, 10)`   | `true`  | -56 < 10 (signed)   |
| `Lt(127, -128)` | `false` | 127 < -128 is false |

### Le

```solidity
function le(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a <= b`.

| Example (Uint8) | Result  | Reason             |
| --------------- | ------- | ------------------ |
| `Le(10, 10)`    | `true`  | Equal values       |
| `Le(200, 10)`   | `false` | 200 <= 10 is false |

### Gt

```solidity
function gt(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a > b`.

| Example (Uint8) | Result  | Reason              |
| --------------- | ------- | ------------------- |
| `Gt(200, 10)`   | `true`  | 200 > 10 (unsigned) |
| `Gt(10, 200)`   | `false` | 10 > 200 is false   |

| Example (Int8)  | Result  | Reason              |
| --------------- | ------- | ------------------- |
| `Gt(10, -56)`   | `true`  | 10 > -56 (signed)   |
| `Gt(-128, 127)` | `false` | -128 > 127 is false |

### Ge

```solidity
function ge(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a >= b`.

| Example (Uint8) | Result  | Reason             |
| --------------- | ------- | ------------------ |
| `Ge(10, 10)`    | `true`  | Equal values       |
| `Ge(10, 200)`   | `false` | 10 >= 200 is false |

## Select

Conditional selection based on an encrypted boolean. No computation is performed
on the values. Takes 3 input handles and produces 1 output handle.

```solidity
function select(ebool cond, euint256 ifTrue, euint256 ifFalse) returns (euint256);
```

Returns `ifTrue` when `cond` is `true`, `ifFalse` otherwise.

| Example                  | Result | Reason             |
| ------------------------ | ------ | ------------------ |
| `Select(true, 42, 100)`  | `42`   | Condition is true  |
| `Select(false, 42, 100)` | `100`  | Condition is false |

## Token Operations

High-level operations designed for confidential token contracts. They **never
revert**: if the requested amount exceeds the available balance, the operation
silently limits to what is available. This prevents leaking balance information
through transaction success/failure.

### Transfer

Moves tokens between two balances, capped at the sender's available balance.

```solidity
function transfer(address from, address to, euint256 amount)
    returns (euint256 newBalanceFrom, euint256 newBalanceTo, euint256 transferredAmount);
```

| Input       | Output            |
| ----------- | ----------------- |
| amount      | newBalanceFrom    |
| balanceFrom | newBalanceTo      |
| balanceTo   | transferredAmount |

The actual transferred amount is `min(amount, balanceFrom)`. If the sender has
insufficient balance, only what is available is moved.

| Example                              | transferredAmount | newBalanceFrom | newBalanceTo |
| ------------------------------------ | ----------------- | -------------- | ------------ |
| Transfer 50, balance 100, receiver 0 | 50                | 50             | 50           |
| Transfer 100, balance 60, receiver 0 | 60                | 0              | 60           |

### Mint

Creates new tokens, increasing a balance and total supply. Additions use
wrapping semantics.

```solidity
function mint(euint256 amount, euint256 balanceTo, euint256 totalSupply)
    returns (euint256 newBalanceTo, euint256 newTotalSupply);
```

| Input       | Output         |
| ----------- | -------------- |
| amount      | newBalanceTo   |
| balanceTo   | newTotalSupply |
| totalSupply |                |

| Example                           | newBalanceTo | newTotalSupply |
| --------------------------------- | ------------ | -------------- |
| Mint 50, balance 200, supply 1000 | 250          | 1050           |

### Burn

Destroys tokens, decreasing a balance and total supply. The burnt amount is
capped at the holder's available balance.

```solidity
function burn(euint256 amount, euint256 balanceFrom, euint256 totalSupply)
    returns (euint256 newBalanceFrom, euint256 newTotalSupply, euint256 burntAmount);
```

| Input       | Output         |
| ----------- | -------------- |
| amount      | newBalanceFrom |
| balanceFrom | newTotalSupply |
| totalSupply | burntAmount    |

| Example                           | burntAmount | newBalanceFrom | newTotalSupply |
| --------------------------------- | ----------- | -------------- | -------------- |
| Burn 50, balance 100, supply 1000 | 50          | 50             | 950            |
| Burn 100, balance 60, supply 1000 | 60          | 0              | 940            |

## Learn More

- [Runner](/protocol/runner) - Executes these operations inside Intel TDX
- [Nox Smart Contracts](/protocol/nox-smart-contracts) - Solidity interface
  (TEEPrimitives library)
- [Gateway](/protocol/gateway) - Handle storage and encryption
