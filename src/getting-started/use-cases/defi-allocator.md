---
title: DeFi Capital Allocator
description:
  Deploy treasury strategies across DeFi without broadcasting position size or
  exposing strategy to front-running.
---

# DeFi Capital Allocator

## The problem: transparency destroys competitive advantage

Professional capital allocators (hedge funds, DAOs, family offices,
institutional treasuries) face a structural problem when deploying strategies
on-chain: every move is visible before execution completes.

When a fund moves $50M into a yield strategy, the market front-runs the
position. When it unwinds exposure, bots extract value through sandwich attacks
or by fading the strategy. At scale, on-chain transparency becomes a liability
rather than an asset.

## The Nox solution

Wrapping treasury assets into Confidential Tokens
([cERC-20 / ERC-7984](/guides/build-confidential-tokens/intro)) gives allocators
selective privacy over balances and transaction amounts, readable only by the
token holder and the parties they explicitly authorize.

Funds can then deploy capital across lending, LP positions, and derivatives
without broadcasting position size, rebalance and unwind without market
front-running, and preserve alpha by controlling exactly who sees what and when.
Full on-chain history stays intact, so auditors, LPs, or compliance officers
read what they are granted through selective disclosure. Strategy and execution
stay private while regulatory reporting and investor updates remain available to
the parties that need them.

## Further reading

- [Confidential Tokens (ERC-7984)](/guides/build-confidential-tokens/intro)
- [Access Control](/guides/manage-handle-access/intro)
- [Architecture Overview](/protocol/global-architecture-overview)
- [← Back to Use Cases](/getting-started/use-cases)
