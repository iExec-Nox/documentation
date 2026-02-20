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

Each primitive is exposed to smart contract developers via the
[Nox Solidity Library](/protocol/nox-smart-contracts#nox-library). Computations
are triggered on-chain (by emitting an event) but executed **asynchronously
off-chain** by a Runner: the transaction completes immediately, and the
encrypted result becomes available in the Gateway once the Runner has processed
the event.

All arithmetic uses **wrapping semantics**, matching Solidity's `unchecked`
behavior. On overflow or underflow, values wrap around the type boundary instead
of reverting.

![Confidential Functions by Nox](/confidential-primtive.png)

## Core Primitives

### PlaintextToEncrypted

Encrypts a plaintext value into an encrypted handle. This is the only operation
with no input handles.

```solidity
function plaintextToEncrypted(bytes32 value) returns (euint256);
```

| Inputs | Outputs | Description               |
| ------ | ------- | ------------------------- |
| 0      | 1       | Encrypt a plaintext value |

The Runner forwards the plaintext to the Handle Gateway via `POST /v0/secrets`,
which performs the ECIES encryption and stores the result.

### Arithmetic

Binary operations on two encrypted values of the same type. Each takes 2 input
handles and produces 1 output handle.

#### Add

```solidity
function add(euint256 lhs, euint256 rhs) returns (euint256);
```

Wrapping addition. On overflow, the result wraps around the type boundary.

- **Unsigned:** `(a + b) mod 2^N`
- **Signed:** `(a + b) mod 2^N`, interpreted in two's complement. For example on
  Int8, adding past `127` continues from `-128`

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

#### Sub

```solidity
function sub(euint256 lhs, euint256 rhs) returns (euint256);
```

Wrapping subtraction. On underflow, the result wraps around the type boundary.

- **Unsigned:** when the result would be negative, it wraps around through MAX.
  For example on Uint8, `0 - 1` gives `255`
- **Signed:** when the result goes below MIN, it wraps around through MAX. For
  example on Int8, `-128 - 1` gives `127`

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

#### Mul

```solidity
function mul(euint256 lhs, euint256 rhs) returns (euint256);
```

Wrapping multiplication. On overflow, the result wraps around the type boundary.

- **Unsigned:** `(a * b) mod 2^N`
- **Signed:** `(a * b) mod 2^N`, interpreted in two's complement. Same modular
  arithmetic as unsigned, but the result is reinterpreted as a signed value

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

#### Div

```solidity
function div(euint256 lhs, euint256 rhs) returns (euint256);
```

Integer division, truncated toward zero. Division by zero does not revert, it
returns the maximum representable value of the type (saturates toward
+infinity).

- **Unsigned:** returns `2^N - 1` (MAX_U). For example on Uint8, `10 / 0` gives
  `255`
- **Signed:** returns `2^(N-1) - 1` (MAX_I). For example on Int8, `10 / 0` gives
  `127`. Additionally, `MIN / -1` wraps back to `MIN` because the true result
  (`128`) exceeds MAX_I (`127`)

| Example (Uint8) | Result | Reason                          |
| --------------- | ------ | ------------------------------- |
| `10 / 0`        | `255`  | Division by zero, returns MAX_U |
| `7 / 2`         | `3`    | Truncated toward zero           |
| `1 / 2`         | `0`    | Truncated toward zero           |
| `0 / 5`         | `0`    | Zero numerator                  |

| Example (Int8) | Result | Reason                          |
| -------------- | ------ | ------------------------------- |
| `10 / 0`       | `127`  | Division by zero, returns MAX_I |
| `-128 / -1`    | `-128` | Overflow, wraps back to MIN     |
| `7 / 2`        | `3`    | Truncated toward zero           |
| `-7 / 2`       | `-3`   | Truncated toward zero           |

### Safe Arithmetic

Same operations as core arithmetic, but returning two handles:
`(success: Bool, result: same_type)`. When `success` is `false`, the `result` is
always `0`. The `success` flag signals **arithmetic errors only** (overflow,
underflow, or division by zero for SafeDiv). Type compatibility between operands
is enforced on-chain by `NoxCompute` before the event reaches the Runner. If a
user bypasses the SDK and submits a value that does not match the declared type
directly to the Gateway, the Runner forcefully casts it according to the same
type rules defined in
[TypeUtils.sol](https://github.com/iExec-Nox/nox-contracts/blob/main/contracts/shared/TypeUtils.sol#L8).
Each takes 2 input handles and produces 2 output handles.

#### SafeAdd

```solidity
function safeAdd(euint256 lhs, euint256 rhs) returns (ebool, euint256);
```

Addition with overflow detection. Returns `0` on overflow.

- **Unsigned:** `success = false` when `a + b > MAX`
- **Signed:** `success = false` when the result exceeds MAX or goes below MIN
  (e.g. on Int8, `127 + 1` or `-128 + (-1)`)

| Example (Uint8)     | success | result | Reason      |
| ------------------- | ------- | ------ | ----------- |
| `SafeAdd(200, 100)` | `false` | `0`    | Overflow    |
| `SafeAdd(255, 1)`   | `false` | `0`    | Overflow    |
| `SafeAdd(200, 55)`  | `true`  | `255`  | No overflow |
| `SafeAdd(100, 50)`  | `true`  | `150`  | No overflow |
| `SafeAdd(0, 0)`     | `true`  | `0`    | No overflow |

| Example (Int8)      | success | result | Reason            |
| ------------------- | ------- | ------ | ----------------- |
| `SafeAdd(127, 1)`   | `false` | `0`    | Positive overflow |
| `SafeAdd(-128, -1)` | `false` | `0`    | Negative overflow |
| `SafeAdd(100, 20)`  | `true`  | `120`  | No overflow       |
| `SafeAdd(-50, -50)` | `true`  | `-100` | No overflow       |

#### SafeSub

```solidity
function safeSub(euint256 lhs, euint256 rhs) returns (ebool, euint256);
```

Subtraction with underflow detection. Returns `0` on underflow.

- **Unsigned:** `success = false` when `a - b < 0`
- **Signed:** `success = false` when the result exceeds MAX or goes below MIN
  (e.g. on Int8, `127 - (-1)` overflows, `-128 - 1` underflows)

| Example (Uint8)    | success | result | Reason       |
| ------------------ | ------- | ------ | ------------ |
| `SafeSub(0, 1)`    | `false` | `0`    | Underflow    |
| `SafeSub(50, 100)` | `false` | `0`    | Underflow    |
| `SafeSub(100, 50)` | `true`  | `50`   | No underflow |
| `SafeSub(0, 0)`    | `true`  | `0`    | No underflow |

| Example (Int8)     | success | result | Reason                          |
| ------------------ | ------- | ------ | ------------------------------- |
| `SafeSub(-128, 1)` | `false` | `0`    | Signed underflow                |
| `SafeSub(127, -1)` | `false` | `0`    | Equivalent to 127 + 1, overflow |
| `SafeSub(0, 0)`    | `true`  | `0`    | No underflow                    |

#### SafeMul

```solidity
function safeMul(euint256 lhs, euint256 rhs) returns (ebool, euint256);
```

Multiplication with overflow detection. Returns `0` on overflow.

- **Unsigned:** `success = false` when `a * b > MAX`
- **Signed:** `success = false` when the result exceeds MAX or goes below MIN
  (e.g. on Int8, `127 * 2` overflows, `-128 * -1` also overflows because
  `128 > 127`)

| Example (Uint8)   | success | result | Reason                |
| ----------------- | ------- | ------ | --------------------- |
| `SafeMul(16, 16)` | `false` | `0`    | Overflow              |
| `SafeMul(15, 17)` | `false` | `0`    | Overflow              |
| `SafeMul(15, 16)` | `true`  | `240`  | No overflow           |
| `SafeMul(0, x)`   | `true`  | `0`    | Zero is absorbing     |
| `SafeMul(1, x)`   | `true`  | `x`    | Identity, no overflow |

| Example (Int8)      | success | result | Reason               |
| ------------------- | ------- | ------ | -------------------- |
| `SafeMul(-128, -1)` | `false` | `0`    | Overflow (128 > MAX) |
| `SafeMul(127, 2)`   | `false` | `0`    | Overflow             |
| `SafeMul(64, 2)`    | `false` | `0`    | Overflow (128 > MAX) |
| `SafeMul(-1, -1)`   | `true`  | `1`    | No overflow          |
| `SafeMul(63, 2)`    | `true`  | `126`  | No overflow          |

#### SafeDiv

```solidity
function safeDiv(euint256 lhs, euint256 rhs) returns (ebool, euint256);
```

Integer division with error detection. Returns `0` on division by zero or signed
overflow.

- **Unsigned:** `success = false` when dividing by zero
- **Signed:** `success = false` when dividing by zero or `MIN / -1`

| Example (Uint8)   | success | result | Reason                |
| ----------------- | ------- | ------ | --------------------- |
| `SafeDiv(255, 0)` | `false` | `0`    | Division by zero      |
| `SafeDiv(0, 0)`   | `false` | `0`    | Division by zero      |
| `SafeDiv(100, 3)` | `true`  | `33`   | Normal division       |
| `SafeDiv(1, 2)`   | `true`  | `0`    | Truncated toward zero |
| `SafeDiv(0, 5)`   | `true`  | `0`    | Zero numerator        |

| Example (Int8)      | success | result | Reason                            |
| ------------------- | ------- | ------ | --------------------------------- |
| `SafeDiv(100, 0)`   | `false` | `0`    | Division by zero                  |
| `SafeDiv(0, 0)`     | `false` | `0`    | Division by zero                  |
| `SafeDiv(-128, -1)` | `false` | `0`    | Signed overflow (MIN / -1)        |
| `SafeDiv(-7, 2)`    | `true`  | `-3`   | Truncated toward zero (not floor) |
| `SafeDiv(50, 5)`    | `true`  | `10`   | Normal division                   |

### Comparisons

Compare two encrypted values and return an encrypted boolean. Each takes 2 input
handles and produces 1 Bool output handle. Comparison semantics depend on the
type: unsigned for `UintN`, signed for `IntN`.

#### Eq

```solidity
function eq(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a == b`.

| Example (Uint8) | Result  | Reason           |
| --------------- | ------- | ---------------- |
| `Eq(42, 42)`    | `true`  | Equal values     |
| `Eq(0, 255)`    | `false` | Different values |

#### Ne

```solidity
function ne(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a != b`.

| Example (Uint8) | Result  | Reason           |
| --------------- | ------- | ---------------- |
| `Ne(42, 42)`    | `false` | Equal values     |
| `Ne(0, 255)`    | `true`  | Different values |

#### Lt

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

#### Le

```solidity
function le(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a <= b`.

| Example (Uint8) | Result  | Reason             |
| --------------- | ------- | ------------------ |
| `Le(10, 10)`    | `true`  | Equal values       |
| `Le(200, 10)`   | `false` | 200 <= 10 is false |

#### Gt

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

#### Ge

```solidity
function ge(euint256 lhs, euint256 rhs) returns (ebool);
```

Returns `true` when `a >= b`.

| Example (Uint8) | Result  | Reason             |
| --------------- | ------- | ------------------ |
| `Ge(10, 10)`    | `true`  | Equal values       |
| `Ge(10, 200)`   | `false` | 10 >= 200 is false |

### Select

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

## Advanced Functions

High-level operations designed for confidential token contracts. They **never
revert** and follow **all-or-nothing** semantics: if the requested amount
exceeds the available balance or an arithmetic overflow occurs, **nothing
changes**. The previous ciphertexts are reassigned to the new output handles and
`success` is set to `false`. This prevents leaking balance information through
transaction success/failure (which would create a binary oracle).

### Transfer

Moves tokens between two balances. All-or-nothing: if `amount > balanceFrom`,
nothing is transferred.

Overflow of `balanceTo` is impossible because the total supply is bounded by
`MAX_U`, so `balanceTo + amount <= totalSupply <= MAX_U` is guaranteed.

```solidity
function transfer(euint256 amount, euint256 balanceFrom, euint256 balanceTo)
    returns (ebool success, euint256 newBalanceFrom, euint256 newBalanceTo);
```

| Input       | Output         |
| ----------- | -------------- |
| amount      | success        |
| balanceFrom | newBalanceFrom |
| balanceTo   | newBalanceTo   |

**Behavior:**

```
if amount > balanceFrom:
    success        = false
    newBalanceFrom = balanceFrom    // ciphertext reassigned to new handle
    newBalanceTo   = balanceTo      // ciphertext reassigned to new handle
else:
    success        = true
    newBalanceFrom = balanceFrom - amount
    newBalanceTo   = balanceTo + amount
```

| balanceFrom | balanceTo | amount | success | newBalanceFrom | newBalanceTo | Reason                                |
| ----------- | --------- | ------ | ------- | -------------- | ------------ | ------------------------------------- |
| 1000        | 500       | 300    | `true`  | 700            | 800          | Normal transfer                       |
| 1000        | 500       | 1000   | `true`  | 0              | 1500         | Full balance transferred              |
| 1000        | 500       | 2000   | `false` | 1000           | 500          | Amount > balance, nothing transferred |
| 0           | 500       | 100    | `false` | 0              | 500          | Insufficient balance                  |
| 100         | 500       | 0      | `true`  | 100            | 500          | Zero amount, no-op                    |

### Mint

Creates new tokens, increasing a balance and total supply. All-or-nothing: if
either addition overflows, nothing is minted.

```solidity
function mint(euint256 amount, euint256 balanceTo, euint256 totalSupply)
    returns (ebool success, euint256 newBalanceTo, euint256 newTotalSupply);
```

| Input       | Output         |
| ----------- | -------------- |
| amount      | success        |
| balanceTo   | newBalanceTo   |
| totalSupply | newTotalSupply |

**Behavior:**

```
if overflow(balanceTo + amount) or overflow(totalSupply + amount):
    success        = false
    newBalanceTo   = balanceTo      // unchanged
    newTotalSupply = totalSupply    // unchanged
else:
    success        = true
    newBalanceTo   = balanceTo + amount
    newTotalSupply = totalSupply + amount
```

| balanceTo | amount | totalSupply | success | newBalanceTo | newTotalSupply | Reason            |
| --------- | ------ | ----------- | ------- | ------------ | -------------- | ----------------- |
| 500       | 300    | 10000       | `true`  | 800          | 10300          | Normal mint       |
| 0         | 1000   | 0           | `true`  | 1000         | 1000           | Mint on empty     |
| 500       | 0      | 10000       | `true`  | 500          | 10000          | Zero amount no-op |

### Burn

Destroys tokens, decreasing a balance and total supply. All-or-nothing: if
`amount > balanceFrom` or `totalSupply - amount` underflows, nothing is burned.

```solidity
function burn(euint256 amount, euint256 balanceFrom, euint256 totalSupply)
    returns (ebool success, euint256 newBalanceFrom, euint256 newTotalSupply);
```

| Input       | Output         |
| ----------- | -------------- |
| amount      | success        |
| balanceFrom | newBalanceFrom |
| totalSupply | newTotalSupply |

**Behavior:**

```
if amount > balanceFrom or underflow(totalSupply - amount):
    success        = false
    newBalanceFrom = balanceFrom    // ciphertext reassigned to new handle
    newTotalSupply = totalSupply    // ciphertext reassigned to new handle
else:
    success        = true
    newBalanceFrom = balanceFrom - amount
    newTotalSupply = totalSupply - amount
```

| balanceFrom | amount | totalSupply | success | newBalanceFrom | newTotalSupply | Reason                           |
| ----------- | ------ | ----------- | ------- | -------------- | -------------- | -------------------------------- |
| 100         | 50     | 1000        | `true`  | 50             | 950            | Normal burn                      |
| 1000        | 1000   | 10000       | `true`  | 0              | 9000           | Full balance burned              |
| 60          | 100    | 1000        | `false` | 60             | 1000           | Amount > balance, nothing burned |
| 0           | 100    | 1000        | `false` | 0              | 1000           | Insufficient balance             |
| 100         | 0      | 1000        | `true`  | 100            | 1000           | Zero amount, no-op               |

## Learn More

- [Runner](/protocol/runner) - Executes these operations inside Intel TDX
- [Nox Smart Contracts](/protocol/nox-smart-contracts) - Solidity interface (Nox
  library)
- [Gateway](/protocol/gateway) - Handle storage and encryption
