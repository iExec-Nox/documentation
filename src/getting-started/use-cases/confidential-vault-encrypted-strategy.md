---
title: 'Confidential Vault: Encrypted Strategy'
description:
  A vault that keeps the manager's strategy encrypted end to end. Allocation
  weights, rebalancing triggers, and per-vault intents stay private; only
  aggregate net orders hit the chain, while NAV, TVL, and APY stay public.
---

# Confidential Vault: Encrypted Strategy

The Confidential Vault turns the vault manager's strategy into a private input.
Allocation weights, rebalancing triggers, and per-vault contributions stay
encrypted end to end. Only aggregate net orders reach the chain, while NAV, TVL,
and APY stay publicly visible.

## The problem: public vaults leak the strategy, not just the positions

On-chain vaults expose the one thing a manager cannot afford to reveal: the
strategy itself. Allocation weights are readable on any block explorer,
rebalancing triggers are inferable from on-chain timing, and the per-vault
attribution of every trade is traceable.

The result is predictable. Competitors replicate the playbook, bots front-run
the next move, and the alpha that justified the strategy disappears before the
next rebalance settles. Keeping the strategy confidential is the prerequisite to
deploying at scale.

## The Nox solution: encrypt the strategy, publish the performance

Performance stays publicly visible to preserve trust; the strategy stays
confidential. Allocation weights, rebalancing triggers, and per-vault intents
are protected from competitors, copy-traders, and MEV bots, while NAV, TVL, and
APY remain visible for LPs, indexers, and compliance.

Concretely, the vault gives you:

| Capability                       | Description                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Encrypted allocation intents     | Allocation weights are submitted on-chain as encrypted handles, validated and aggregated, never decrypted alone. |
| Confidential rebalancing logic   | The timing and triggers of capital movements never appear on-chain, so there is no leakage by inference.         |
| Cross-vault netting inside a TEE | Intents from every active vault are aggregated into one batch per epoch, hiding per-vault attribution.           |
| Public performance               | NAV, TVL, and APY are published for LPs, indexers, and analytics platforms; the strategy underneath stays hidden.|

## How it works

Four roles interact with the vault:

- **Vault manager (strategist)** generates the allocation strategy off-chain and
  submits it on-chain as an encrypted intent. The chain stores unreadable bytes,
  and the strategy is never decrypted individually.
- **Liquidity provider** deposits and receives standard ERC-20 share tokens,
  tracking performance through the published NAV and APY. Composability with the
  rest of DeFi is preserved by design.
- **Nox protocol engine (inside the TEE)** aggregates the encrypted intents from
  every active vault at each epoch, computes the net order per destination, and
  triggers one batch trade per protocol. Inputs and intermediate values never
  leave the enclave.
- **Auditor / regulator** is granted scoped, revocable read access through the
  on-chain ACL, and sees exactly what compliance requires, nothing more. No
  party, including iExec, has unilateral access.

## Confidentiality by aggregation

Privacy here does not rest on a cryptographic assumption that could one day
weaken. It rests on a structural property: as soon as multiple vaults run
multiple assets, the information published on-chain is mathematically
insufficient to reconstruct any individual strategy.

The more vaults active on the protocol, the stronger the guarantee. Every new
vault increases the protection of every existing one, so privacy compounds with
adoption.

## Further reading

- [Confidential Vault: Encrypted Positions](/getting-started/use-cases/confidential-vault)
- [Access Control](/guides/manage-handle-access/intro)
- [Architecture Overview](/protocol/global-architecture-overview)
- [← Back to Use Cases](/getting-started/use-cases)
