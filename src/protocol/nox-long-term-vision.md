---
title: Nox Long-Term Vision
description: The long-term vision and roadmap for Nox protocol, including evolution of encryption algorithms, trust models, and strategic direction
---

# Nox Long-Term Vision

## Vision Statement

Nox aims to become the **standard for privacy** in DeFi and Real World Assets (RWA), combining **performance, security, and compliance**.

Like HTTPS made secure connections invisible, Nox makes privacy the default for on-chain transactions and computations.

## Mission

Our mission is built on four core pillars:

- **Privacy**: Enable users to protect their transactions and balances while maintaining full composability
- **Interoperability**: Compatible with existing blockchains (Ethereum, Polygon, Solana, and more)
- **Compliance**: Facilitate audit and regulatory compliance (MiCA, GDPR, FATF) through selective disclosure
- **Accessibility**: Provide simple tools for developers and institutions to integrate confidential operations

## Strategic Direction

### Core Products

Nox provides a unified infrastructure enabling the creation, exchange, and management of digital assets confidentially. The protocol supports multiple products:

1. **Confidential Tokens** - Encrypt balances and amounts while maintaining compatibility with existing ERC-20 ecosystem
2. **Confidential Stablecoins** - Enable private payments and treasury operations (cEUR/cUSD) without amount disclosure
3. **Advanced DeFi Primitives** - Support complex operations (division, exponentiation, logarithm, square root) that are impossible or extremely costly in pure FHE
4. **Private Payment Services** - Automate recurring flows (payroll, invoices) while preserving confidentiality and compliance

### Competitive Positioning

Nox differentiates itself from competitors by:

- **Performance**: TEE-based execution enables operations impossible in FHE at reasonable cost
- **Programmability**: Support for advanced primitives enables sophisticated financial products
- **Decentralization**: Distributed KMS eliminates single points of failure
- **Compliance**: Fine-grained ACL and selective disclosure meet regulatory requirements

## Evolution of Encryption Algorithms

### Short-Term Approach

The protocol integrates from its design the ability to evolve encryption algorithms through **metadata** that explicitly identifies the version and encryption algorithm used. Ciphertexts remain strictly private and secure, regardless of future evolutions, ensuring their security even if the encryption algorithm is compromised.

### Long-Term Vision

The system will implement complete **encryption algorithm migration** logic without breaking compatibility or invalidating existing data, in compliance with **ANSSI recommendations**. This evolution capability is centralized in the Handle Gateway TEE, allowing algorithm updates (schemes, key sizes, primitives) without client-side modifications, eliminating breaking changes in the SDK.

::: info Algorithm Evolution
The Handle Gateway, running in a TEE, retrieves the threshold public key from the blockchain and encrypts data under this key, generating the ciphertext. This approach centralizes cryptographic logic in the Handle Gateway TEE, enabling encryption algorithm evolution without requiring SDK changes.
:::

## Trust Model Evolution

### Short-Term Foundation

The protocol's trust model relies exclusively on **TEEs (TDX)** and **remote attestation** mechanisms, without redundant computation or distributed consensus.

**Protocol auditability** (the ability to reveal certain data in a controlled manner) covers trust and state consistency issues, guaranteeing data validity even in case of enclave or ciphertext compromise.

### Long-Term Vision

The trust model remains durably anchored on **TEEs**, **proof of cloud**, and **remote attestation**, constituting the **security foundation** for all confidential operations of the cDeFi protocol. Over time, certain **third-party entities** (or dedicated protocol roles) may contribute to the **reproducibility** and **verifiability** of certain confidential computations already performed.

## Architecture Evolution

### Current Architecture

The protocol is built on a modular architecture with:

- **Runners** - Execute confidential computations in TEEs
- **KMS** - Distributed key management with threshold cryptography
- **Orchestrator** - Decentralized network coordinating computation requests
- **Handle Gateway** - Entry point for handle encryption/decryption
- **Ingestor** - Blockchain event monitoring and detection

### Future Enhancements

- **Multi-chain Support**: Extend beyond Ethereum to support multiple blockchains
- **Advanced Primitives**: Enable complex mathematical operations for sophisticated DeFi products
- **Enhanced Compliance**: Build-in regulatory reporting and audit capabilities
- **Performance Optimization**: Continuous improvements to throughput and latency

## Roadmap Phases

### MVP (V0) - Foundations

**Objective**: Validate end-to-end encryption/decryption flow

- SDK client for encryption/decryption requests
- Handle Gateway TEE for data encryption and storage
- Centralized KMS (single node) for proxy re-encryption
- Smart contracts for handle verification and ACL management

### V0.1 - Blockchain Listening & Queue

**Objective**: Introduce blockchain event monitoring and asynchronous processing

- Ingestor TEE for continuous blockchain listening
- Message queue for request buffering
- Basic Runner with mocked primitives

### V0.2 - Orchestrator & Primitives

**Objective**: Full confidential computation with orchestrator and runner

- Complete Orchestrator/Runner implementation
- Real computation primitives for ERC-7984
- Upgradable smart contracts (UUPS pattern)
- gRPC communication with enclave signatures

### Future Versions

- **V1+**: Advanced primitives, multi-chain support, enhanced compliance features
- **V2+**: Performance optimizations, additional use cases, ecosystem expansion
- **V3+**: Long-term sustainability, governance improvements, protocol maturity

## Long-Term Goals

### Technical Excellence

- **Algorithm Evolution**: Seamless migration of encryption algorithms without breaking changes
- **Performance**: Match or exceed competitor performance metrics
- **Security**: Regular security audits and continuous monitoring
- **Reliability**: 99%+ uptime with robust failover mechanisms

### Ecosystem Growth

- **Developer Experience**: Best-in-class DX with plug-and-play integration
- **Standard Adoption**: Become the de facto standard for confidential DeFi
- **Partnerships**: Integration with major DeFi protocols and institutions
- **Community**: Active developer and user community

### Regulatory Compliance

- **Selective Disclosure**: Built-in mechanisms for regulatory reporting
- **Auditability**: Cryptographic proofs for transaction validity
- **Standards Alignment**: Compliance with MiCA, GDPR, FATF requirements
- **Institutional Ready**: Tools and features for enterprise adoption

## Conclusion

Nox represents a fundamental shift toward making privacy the default in decentralized finance. By combining the security of TEEs, the flexibility of threshold cryptography, and the composability of on-chain primitives, Nox enables a new generation of confidential DeFi applications.

The long-term vision is to create a privacy layer that is as invisible and essential as HTTPS became for web security—enabling users and institutions to transact confidently while maintaining full control over their data and compliance requirements.

## Next Steps

- [Global Architecture Overview](/protocol/global-architecture-overview) - Understand the complete system architecture
- [KMS Documentation](/protocol/kms) - Learn about distributed key management
- [Getting Started](/overview/hello-world) - Start building with Nox
