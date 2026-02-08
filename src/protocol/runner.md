---
title: Runner
description:
  TEE Runner Service for executing confidential computations in trusted
  execution environments
---

# Runner

Runners are workers that execute confidential computations in Trusted Execution
Environments (TEEs). They provide valid remote attestation and publish results
directly on-chain.

## Overview

Runners are responsible for:

- **Executing Confidential Computations**: Processing encrypted data within
  hardware-backed TEE enclaves
- **Remote Attestation**: Providing cryptographic proof of authentic TEE
  execution
- **Result Publication**: Publishing computation results on-chain
- **Data Security**: Ensuring data remains encrypted except within the secure
  TEE

## Key Characteristics

- **TEE Execution**: All computations run in hardware-backed enclaves (Intel
  TDX, AMD SEV, ARM TrustZone)
- **Diverse Infrastructure**: Support for multiple cloud providers and TEE
  technologies reduces single points of failure
- **Proxy Re-Encryption**: Data is re-encrypted specifically for each assigned
  Runner using their public key
- **Forward Secrecy**: Even if a TEE is compromised, it can only decrypt data
  assigned to it after compromise

## Workflow

### 1. Registration

- Generates a signature keypair within the TEE enclave
- Registers in the on-chain Registry with TEE attestation
- Publishes public key for proxy re-encryption
- Signals availability to the Orchestrator

### 2. Task Assignment

- Receives signed computation requests from the Orchestrator
- Verifies Orchestrator signature via Registry on-chain
- Extracts computation metadata:
  - Input handles (encrypted data references)
  - Output handles (where results will be stored)
  - Computation primitive to execute

### 3. Data Retrieval

- Generates ephemeral keypair for this specific task
- Sends signed request to Handle Gateway for input handles
- Gateway coordinates with KMS for proxy re-encryption to Runner's ephemeral
  public key
- Verifies Gateway signature on response
- Decrypts ciphertexts using ephemeral private key

### 4. Computation Execution

- Executes the specified computation primitive on decrypted data
- Plaintext data exists only in isolated TEE memory
- Performs operations such as:
  - Addition, subtraction, multiplication
  - Division, exponentiation, logarithm (advanced primitives)
  - Transfer operations for confidential tokens

### 5. Result Submission

- Encrypts computation results under KMS threshold public key
- Signs results with Runner's enclave private key
- Submits signed results to Orchestrator
- Orchestrator forwards to Handle Gateway for storage

## Handle Requirements

For a typical **transfer operation**, a computation requires 5 handles:

**Input Handles (3):**

- 2 handles for initial balances
- 1 handle for transfer amount

**Output Handles (2):**

- 2 handles for final balances (must not exist in database)

::: info Handle Validation

Output handles must not exist in the database before computation. The Runner
submits new ciphertexts that will be associated with these handles.

:::

## Security Model

### Remote Attestation

- **TEE Verification**: Proves code runs in authentic hardware enclave
- **Code Integrity**: Verifies exact code version via MRENCLAVE/MRSIGNER hash
- **Key Generation**: Confirms public keys are generated within TEE
- **Periodic Refresh**: Attestations must be refreshed periodically

### Data Protection

- **Encrypted in Transit**: All data encrypted during transmission
- **Decrypted Only in TEE**: Plaintext exists only in isolated enclave memory
- **Ephemeral Keys**: Task-specific keys prevent cross-task data access
- **No Persistent Storage**: Plaintext never written to disk

### Legitimacy Validation

- **Registry Verification**: Handle Gateway verifies Runner legitimacy via
  Registry
- **Signature Verification**: All requests verified using Registry-stored public
  keys
- **Access Control**: ACL checks ensure Runner has permission to access handles

## Communication

Runners communicate via **gRPC** with signed messages:

- **Orchestrator ↔ Runner**: Task assignment and result submission
- **Runner ↔ Handle Gateway**: Data retrieval requests
- **Runner ↔ KMS Manager**: Proxy re-encryption coordination (via Gateway)

All messages are signed with the Runner's enclave private key and verified
on-chain via the Registry.

## Computation Primitives

Runners execute various computation primitives:

- **Basic Operations**: `add()`, `sub()`, `trivialEncrypt()`
- **Advanced Operations**: `div()`, `exp()`, `log()`, `sqrt()`, `mod()` (for
  sophisticated DeFi products)
- **Token Operations**: Transfer, balance updates, swaps

::: tip Performance

TEE-based execution enables operations that are impossible or extremely costly
in pure FHE, making complex DeFi products feasible.

:::

## Integration Points

- **Orchestrator**: Receives task assignments and submits results
- **Handle Gateway**: Retrieves encrypted input data and stores encrypted
  results
- **KMS**: Coordinates proxy re-encryption for data access
- **Registry**: Registers Runner and publishes attestation

## Learn More

- [Global Architecture Overview](/protocol/global-architecture-overview) -
  Understand Runner role in the system
- [KMS](/protocol/kms) - How Runners interact with key management
- [Gateway](/protocol/gateway) - Data retrieval and storage
