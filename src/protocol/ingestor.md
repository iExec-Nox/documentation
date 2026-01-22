---
title: Ingestor
description: Data Ingestor Service
---

## Overview

The Ingestor is a blockchain monitoring service that continuously watches the blockchain for specific events and forwards computation requests to the message queue for processing by the [Orchestrator](/protocol/runner). It runs as a dedicated service (Rust + Alloy) within a Trusted Execution Environment (TEE) and plays a critical role in bridging on-chain events with off-chain computation infrastructure.

## Core Functions

The Ingestor serves as the event detection layer of the Nox protocol:

1. **Blockchain Monitoring**: Continuously monitors all transactions in every block
2. **Event Detection**: Identifies and processes relevant blockchain events
3. **Request Forwarding**: Signs and forwards computation requests to the message queue

## Blockchain Monitoring

The Ingestor performs continuous blockchain monitoring:

- **Real-time Block Processing**: Analyzes every transaction in every new block as it arrives
- **Optimistic Processing**: Processes blocks optimistically without waiting for confirmations, enabling low-latency event detection
- **Event Detection**: Identifies specific events including:
  - `ComputeRequested` events emitted by the TEEComputeManager
  - `TrivialEncrypt` events
  - Other protocol-relevant events

## Event Processing

When an event is detected, the Ingestor:

1. **Parses Event Metadata**: Extracts relevant information from the detected event:
   - Input handles (encrypted data references)
   - Output handles (where results should be stored)
   - Computation primitive (the operation to perform)

2. **Signs Payload**: Creates a signed payload using its enclave private key, ensuring authenticity and integrity

3. **Queues Request**: Pushes the signed request into the message queue for processing by the Orchestrator

## Chain Reorganization Handling

The Ingestor manages blockchain reorganizations (reorgs):

- **Orphan Handle Cleanup**: Regularly purges orphaned handles from the database when chain reorganizations occur
- **Work Table Maintenance**: Maintains a work table to track ongoing computations and handle state transitions

## Multi-Instance Architecture

Multiple Ingestor instances can coexist in the network:

- **Horizontal Scaling**: Enables distributed event detection across multiple nodes
- **Redundancy**: Provides fault tolerance and high availability
- **Load Distribution**: Distributes the monitoring workload across instances

## Message Queue Integration

The Ingestor communicates with the message queue:

- **Decoupled Architecture**: Separates event detection from computation processing
- **Buffering**: Absorbs traffic spikes and ensures ordered request processing
- **Reliability**: Provides a reliable buffer between blockchain events and computation execution

The Orchestrator verifies each message's signature using the Ingestor's public key registered in the Registry before processing requests.

## TEE Execution

The Ingestor runs within a TEE:

- **Attestation**: Must be registered and attested in the Registry before participating in the network
- **Security**: Executes in a hardware-isolated environment, protecting its signing keys
- **Integrity**: Ensures that event detection and payload signing occur in a trusted environment

## Integration Points

The Ingestor integrates with several protocol components:

- **Smart Contracts**: Monitors events from TEEComputeManager and other protocol contracts
- **Message Queue**: Forwards signed computation requests for processing
- **Registry**: Uses Registry for component authentication and signature verification
- **Database**: Maintains work tables and handles orphan cleanup

## Related Documentation

- [Runner](/protocol/runner) - TEE Runner Service that executes computations
- [Gateway](/protocol/gateway) - Handle Gateway that manages encrypted data storage
- [Global Architecture Overview](/protocol/global-architecture-overview) - System architecture and workflow
