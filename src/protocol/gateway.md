---
title: Gateway
description: Nox Gateway Service
---

## Overview

The Gateway is a dual-purpose service that handles both encryption operations and database management for handles in the Nox protocol. It encrypts plaintext data using the ECIES (Elliptic Curve Integrated Encryption Scheme) algorithm and manages the storage of encrypted handles, working in conjunction with the [KMS](/protocol/kms) to secure confidential information.

## Core Functions

The Gateway serves two primary functions:

1. **Encryption Service**: Encrypts plaintext data using ECIES before storage
2. **Handle Management**: Manages database interactions for handles and their associated encrypted data

## Encryption Process

The Gateway performs ECIES encryption by:

1. **Retrieving the public key** from the KMS service
2. **Generating an ephemeral key pair** (`k`, `K = k * G`) where `k` is a random secret and `G` is the public generator point
3. **Deriving a shared secret** using `k * pubkey` (where `pubkey` is the KMS public key)
4. **Encrypting plaintext data** using AES256 with a key derived from the shared secret via a Key Derivation Function (KDF)
5. **Producing ciphertext** along with the ephemeral public key `K` and a nonce

### Encryption Flow

```
Plaintext Data
    │
    ▼
Generate ephemeral key k
    │
    ▼
Compute shared secret: k * pubkey_KMS
    │
    ▼
Derive AES256 key (KDF)
    │
    ▼
Encrypt plaintext → Ciphertext
    │
    ▼
Output: Ciphertext + K (ephemeral pubkey) + Nonce
```

## Database Operations

### Write Operations

The Gateway handles two types of write operations:

- **Handle Creation via SDK**: Users create handles through the SDK. Values submitted through this channel are unencrypted and will be encrypted by the Gateway before storage.
- **Runner Result Submission**: Runners submit computation results. Ideally, data associated with the handle should already be encrypted when submitted.

The Gateway writes new database entries for handles that don't already exist, storing the encrypted data along with metadata.

### Read Operations

Read operations are triggered by data access requests. These requests must be authorized by Access Control Lists (ACLs) on the Smart Contracts before the Gateway can retrieve and return the encrypted data. The Gateway may also trigger re-encryption operations under certain conditions.

## Database Schema

The Gateway manages a single database table with the following structure:

| Column | Constraint | Description |
|--------|------------|-------------|
| `Handle` | Unique | Primary key, the handle identifier used in Smart Contracts |
| `Owner` | | Ethereum address of the data owner |
| `Ciphertext` | | Encrypted value associated with the handle |
| `K` | Unique | Ephemeral public key used for decryption delegation. Enables generation of the material needed for symmetric public key derivation. **Note:** The properties of the chosen elliptic curve determine the number of possible distinct K values. |
| `Nonce` | | Nonce as suggested in the reference ECIES implementation |
| `createdAt` | | Timestamp of data creation |

## Architecture Components

The Gateway application consists of the following services:

| Service | Role |
|---------|------|
| **handlers** | REST endpoint handlers implementation |
| **crypto** | Encryption service for plaintext values (V0). A more specific service with structs may be considered for future versions |
| **backend** | Handle storage service, using PostgreSQL initially |
| **authorization / ACL / validation** | On-chain authorization verification, data type validation (skeleton to be completed later) |
| **client / api** | KMS interaction (public key retrieval, shared secret creation) |

## Integration with KMS

The Gateway requires the KMS public key to perform encryption. It reads this key from the KMS service before encrypting any data. The encrypted payload can then be delegated for decryption by authorized parties through the KMS delegation endpoint.

## Related Documentation

- [KMS](/protocol/kms) - Key Management Service that provides encryption keys
- [Runner](/protocol/runner) - TEE Runner Service that submits computation results
- [Global Architecture Overview](/protocol/global-architecture-overview) - System architecture
