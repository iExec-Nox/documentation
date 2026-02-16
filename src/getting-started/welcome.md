---
title: Welcome
description: Welcome to Nox Protocol - Composable Privacy for DeFi
---

# Your Toolkit to Build Privacy Apps

## Welcome to Nox

Nox is the first truly on-chain composable privacy layer for DeFi. Just as HTTPS
made secure connections invisible and seamless, Nox makes privacy the default
for blockchain applications.

With Nox, you can build confidential smart contracts and tokens that protect
sensitive data while remaining fully composable with existing DeFi protocols.
Your contracts can process encrypted inputs, execute computations privately, and
maintain confidentiality—all without breaking composability.

## Why Nox?

- **Native Composability**: Privacy that doesn't break DeFi composability
- **Developer-Friendly**: Familiar Solidity syntax with privacy primitives
- **No Special Wallets**: Works with standard Ethereum wallets and tools
- **Multichain**: Deploy on multiple blockchain networks
- **Production-Ready**: Built for real-world DeFi applications

## How Nox works

Nox enables confidential DeFi through a distributed architecture built on three
core concepts:

1. **Handles**: When you encrypt data using the JS SDK, Nox creates a unique
   32-byte identifier called a handle. Think of handles as secure pointers—your
   smart contracts reference confidential values through these handles without
   exposing the underlying encrypted data, which is stored securely off-chain.

2. **Access Control Lists (ACL)**: Each handle is protected by an ACL that
   manages permissions on-chain. By default, only you can access your data, but
   you can grant view permissions to specific addresses, smart contracts, or
   auditors. This enables **selective disclosure**—maintaining privacy while
   allowing authorized parties to verify transactions when needed.

3. **Trusted Execution Environments (TEE)**: When your smart contract needs to
   process confidential data, the computation happens inside Intel TDX-based TEE
   enclaves. These hardware-protected environments ensure that even
   infrastructure providers cannot access the plaintext data during execution.

## The Nox toolkit

**Solidity Library:** Add privacy to your contracts using familiar Solidity
syntax—no specialized wallets or off-chain steps required.

**JS SDK:** Encrypt sensitive inputs and handle decryption with a
developer-friendly TypeScript SDK.

**Confidential Smart Contracts:** Build smart contracts that process encrypted
data on-chain while maintaining privacy.

**Confidential Tokens:** Create ERC-7984 compliant confidential tokens with
hidden balances and private transfers. Wrap existing ERC-20 tokens or build
native confidential assets that maintain full DeFi compatibility.

## Real-world Use Cases

With Nox, you can build a wide range of privacy-preserving applications that
seamlessly integrate with the broader DeFi ecosystem:

- **Yield with Confidential Vault** — Build yield-generating vaults that protect
  strategy positions and capital allocations from copy-trading and MEV
- **cRWA with Confidential Tokenized Equity** — Enable confidential tokenized
  equity on-chain, protecting investor positions and allocations while
  maintaining regulatory compliance
- **Confidential Value Transfers** — Create private payment systems and
  confidential transfers that hide transaction amounts while remaining
  verifiable
- **Privacy-Preserving DeFi Primitives** — Build lending, borrowing, and other
  DeFi primitives that process sensitive data without exposing it publicly
- **Tokens with Hidden Balances & Amounts** — Create ERC-7984 compliant tokens
  where balances and transaction amounts are hidden from public view
- **Selective Disclosure Workflows** — Implement audit and compliance workflows
  where users control exactly who can access their data, enabling regulatory
  requirements without sacrificing privacy
- **Institutional-Grade DeFi & RWAs** — Enable institutional adoption by
  removing transparency blockers, making DeFi and RWA products ready for
  discretion-sensitive capital

The next chapters guide you through our **Hello World journey**. This quick
start teaches you everything about Nox. You'll learn **protecting sensitive
data** and **building and deploying confidential smart contracts**.

## Start Building

Ready to get started? Here's what to explore next:

- **Quick Start:** Follow our [Hello World guide](/getting-started/hello-world)
  to deploy your first confidential contract in minutes
- **Explore Use Cases:** Browse
  [real-world examples](/getting-started/use-cases) to see what you can build
  with Nox

## Support

Need help building with Nox? We're here to support you:

- **Discord Community** — Connect with other builders, ask questions, and get
  real-time support on our
  [Discord server](https://discord.com/invite/5TewNUnJHN)
- **Get Support** — Visit our [support page](/getting-started/support) for
  additional resources and help
