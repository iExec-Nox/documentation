---
title: DeFi Capital Allocator
description:
  Deploy treasury strategies across DeFi without broadcasting position size or
  exposing strategy to front-running.
---

# DeFi Capital Allocator

## The problem: transparency destroys competitive advantage

Professional capital allocators — hedge funds, DAOs, family offices,
institutional treasuries — face a structural problem when deploying strategies
on-chain: every move is visible before execution completes.

When a fund moves $50M into a yield strategy, the market front-runs the
position. When it unwinds exposure, sophisticated bots extract value through
sandwich attacks or by fading the strategy. At scale, on-chain transparency
becomes a liability rather than an asset.

## The Nox solution

By wrapping treasury assets into Confidential Tokens
([cERC-20 / ERC-7984](/guides/build-confidential-tokens/intro)), allocators gain
selective privacy over balances and transaction amounts. Balances and
transaction amounts remain encrypted on-chain, readable only by the token holder
and explicitly authorized parties.

This allows funds to:

- Deploy capital across DeFi protocols (lending, LP positions, derivatives)
  without broadcasting position size
- Execute rebalancing and unwinding without market front-running
- Maintain full on-chain verifiability and audit trails through selective
  disclosure to auditors, LPs, or compliance officers
- Preserve alpha by controlling exactly who sees what and when

The protocol enables privacy where it matters (strategy protection, execution
quality) while maintaining transparency where it is required (regulatory
reporting, investor updates).

## Further reading

- [Confidential Tokens (ERC-7984)](/guides/build-confidential-tokens/intro)
- [Access Control](/guides/manage-handle-access/intro)
- [Architecture Overview](/protocol/global-architecture-overview)
- [← Back to Use Cases](/getting-started/use-cases)
