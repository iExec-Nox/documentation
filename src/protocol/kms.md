---
title: KMS
description: Key Management Service for distributed key management and proxy re-encryption
---

# Key Management Service (KMS)

The Key Management Service (KMS) is a distributed cryptographic key management system that generates and manages the public-private key pair used for ciphertext generation and decryption delegation.

## Overview

The KMS is responsible for:

- **Key Generation**: Creating the master key pair for system-wide encryption
- **Key Distribution**: Managing threshold cryptography with secret shares
- **Proxy Re-Encryption**: Transforming ciphertexts from one key to another without decryption
- **Key Publication**: Publishing the threshold public key on-chain for user encryption

## ECIES Algorithm

The KMS uses the **ECIES (Elliptic Curve Integrated Encryption Scheme)** algorithm:

- `pubkey = G * privkey` where G is a public constant generator point on the elliptic curve
- Plaintext is encrypted using an AES256 key derived from a shared secret `k * pubkey`, where k is a random ephemeral secret key
- An ephemeral public key `K = k * G` is required for delegation
- Decryption delegation generates the shared secret using `K * privkey`

### Encryption Process

1. Random ephemeral key `k` is generated
2. Shared secret `k * pubkey` is computed
3. AES256 key is derived from the shared secret using KDF
4. Plaintext is encrypted with the AES256 key
5. Ephemeral public key `K = k * G` is included with the ciphertext

### Decryption Process

1. Recipient uses their private key with ephemeral public key `K`
2. Shared secret `K * privkey` is computed
3. AES256 key is derived from the shared secret
4. Ciphertext is decrypted using the AES256 key

## Threshold Cryptography

### Long-Term Vision

The KMS implements **distributed key management** using threshold cryptography:

- **Secret Sharing**: The private key is split into n shares using Shamir's Secret Sharing
- **Threshold Requirement**: A quorum of t out of n nodes is required to perform operations
- **No Single Point of Failure**: No single node can decrypt data alone
- **DKG Protocol**: Distributed Key Generation protocol creates the key pair collectively

### Current Implementation (MVP)

- **Centralized KMS**: Single node for MVP phase
- **TEE Storage**: Private key stored in memory within TEE
- **Keypass Backup**: Key backup mechanism for V0

::: info Future Evolution
The system will evolve to a fully distributed threshold KMS where multiple nodes hold secret shares, requiring collaboration to perform proxy re-encryption operations.
:::

## Key Management Operations

### Key Generation

- Generates and maintains the master key pair (encryption/decryption)
- Publishes the public key on-chain in the Registry
- Stores the private key in TEE memory (secure enclave)

### Public Key Publication

The threshold public key is published on-chain, allowing all users to encrypt their data so it can only be decrypted by the distributed KMS network. This approach eliminates single points of failure.

## Proxy Re-Encryption

Proxy re-encryption allows transforming ciphertexts from one key to another **without decrypting the data**:

### Process

1. **Request**: KMS Manager receives signed request from Runner or Gateway
2. **Verification**: Signature is verified via Registry on-chain
3. **Transformation**: Ciphertext encrypted under KMS public key is re-encrypted under target public key
4. **Response**: Signed response returned with re-encrypted ciphertext

### Use Cases

- **Runner Assignment**: Re-encrypt data for specific Runner's public key
- **User Decryption**: Re-encrypt data for user's ephemeral public key
- **Forward Secrecy**: Each Runner can only decrypt data assigned to them

::: warning Security
The KMS never decrypts data. All transformations remain in the encrypted domain, maintaining confidentiality throughout the process.
:::

## API Operations

### Read Operations

- **`/health`**: Monitor KMS health status
- **Public Key Retrieval**: Gateway retrieves KMS public key for ECIES encryption

### Write Operations

- **`/delegate`**: Generate shared secret (`K * privkey`) encrypted with requester's RSA-OAEP 2048 public key
  - User/Runner generates RSA-OAEP 2048 keypair (public exponent 65537)
  - Public key exported in SPKI format, encoded as hex string (without leading `0x`)
  - Shared secret encrypted under this public key

## KMS Manager

The **KMS Manager** coordinates threshold protocol operations:

- **Centralized Coordinator**: Runs in a TEE, acts as single entry point to KMS nodes
- **Connection Simplification**: Avoids Runners establishing N individual connections
- **Share Collection**: Coordinates collection of transformation shares from KMS nodes
- **Request Routing**: Routes proxy re-encryption requests to appropriate KMS nodes

## Security Model

### Trust Foundation

- **TEE Execution**: KMS nodes run in Trusted Execution Environments
- **Remote Attestation**: All nodes must provide valid remote attestation
- **On-chain Registry**: Node registration and public key storage on blockchain
- **Signature Verification**: All requests verified via Registry-stored public keys

### Key Protection

- **In-Memory Storage**: Private keys stored only in TEE memory
- **No Persistent Storage**: Keys never written to disk in plaintext
- **Threshold Distribution**: Long-term vision eliminates single key storage

## Integration

The KMS integrates with other protocol components:

- **Handle Gateway**: Retrieves public key for encryption, coordinates proxy re-encryption
- **Runners**: Receives re-encrypted data for assigned computations
- **KMS Manager**: Coordinates threshold operations
- **Registry**: Publishes public key and node attestations

## Learn More

- [Global Architecture Overview](/protocol/global-architecture-overview) - Understand KMS role in the system
- [Gateway](/protocol/gateway) - How Gateway interacts with KMS
- [Runner](/protocol/runner) - How Runners use KMS for data access
