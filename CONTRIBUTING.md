# Contributing Guide - Nox Documentation

Welcome to the Nox documentation contribution guide! This guide explains how to
effectively participate in the development and improvement of the documentation.

## 📋 Prerequisites

- **Node.js**: Version 24 or higher
- **npm**: Comes bundled with Node.js
- **Git**: For version control

## 🚀 Quick Start

### 1. Initial Setup

1. **Fork the repository**:
   [![fork-button](/src/public/fork-button.png)](https://github.com/iExec-Nox/documentation/fork)

2. **Clone your fork**:

   ```bash
   git clone https://github.com/iExec-Nox/documentation.git
   cd documentation
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

### 2. Contribution Workflow

1. **Create a branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

3. **Test locally**:

   ```bash
   npm run dev
   ```

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## 🧱 Component Usage Guide

### Container - VitePress Native Containers (Recommended)

**We recommend using VitePress native container syntax** instead of the Vue
component for better compatibility and simplicity.

#### Preferred Usage (VitePress Native)

```markdown
::: info Your informational content here... :::

::: tip Helpful tips and suggestions... :::

::: warning Important warnings and cautions... :::

::: danger Critical warnings and error messages... :::
```

#### Alternative Usage (Vue Component)

The `Container` component extends VitePress default containers with additional
styling, but should only be used when you need specific custom behavior:

```vue
<Container variant="success" title="Success">
Your content here...
</Container>

<Container variant="info" title="Information">
Informational content...
</Container>

<Container variant="danger" title="Warning">
Warning message...
</Container>
```

#### Available Variants

- `success`: Success style with green border
- `info`: Informational style (default)
- `danger`: Warning style with red border

### Banner - Stylized Page Headers

The `Banner` component is perfect for creating attractive page headers with
gradient styling.

#### Usage

```vue
<Banner>

## Your Section Title

Description of your section with elegant styling.

</Banner>
```

#### Features

- Automatic gradient background
- Rounded borders
- Optimized for h2 titles
- Responsive and accessible

### CardWithBorder - Cards with Border

Use this component to create cards with defined borders and soft backgrounds.

#### Usage

```vue
<CardWithBorder>

### Card Title

Your card content with border. Ideal for highlighting important information.

- Point 1
- Point 2
- Point 3

</CardWithBorder>
```

#### Features

- Defined border with theme colors
- Soft background
- Generous padding (2rem)
- Rounded corners

### CardWithoutBorder - Borderless Cards

For more subtle cards without visible borders.

#### Usage

```vue
<CardWithoutBorder>

### Card Content

This card has no border but maintains a soft background for readability.

</CardWithoutBorder>
```

#### Features

- No visible border
- Soft background to contrast with page
- Moderate padding (1.5rem)
- Minimalist style

## 📝 Component Best Practices

### 1. When to Use Each Component

- **VitePress Containers** (`::: info`, `::: tip`, etc.): **Preferred** for
  notes, warnings, and informational messages
- **Banner**: For important section headers
- **CardWithBorder**: To highlight important content
- **CardWithoutBorder**: To group content subtly
- **Container Component**: Only when you need the specific "success" variant not
  available in VitePress native containers

### 2. Combined Usage Example

````markdown
<Banner>

## Installation Guide

</Banner>

::: info Prerequisites Make sure you have Node.js installed before continuing.
:::

<CardWithBorder>

### Step 1: Installation

\```bash npm install \```

</CardWithBorder>

<CardWithoutBorder>

### Step 2: Configuration

Create your `.env` file based on `.env.example`.

</CardWithoutBorder>

::: tip Success! Your installation is now complete! :::
````

## 🔗 Multi-chain Content

Nox documentation is **multi-chain**. The list of supported networks lives in
`src/utils/chain.utils.ts` (`getSupportedChains()` / `getChainById()`), and the
reader picks the active chain with the `ChainSelector` in the navbar. The
selected chain is stored in the Pinia store `src/stores/useUser.store.ts` and
exposed through `getCurrentChainId()`.

Because of this, any content that differs from one chain to another must adapt
to the reader's selection instead of hard-coding a single chain. There are two
patterns for this:

- **Pattern A — value injection**: for chain-specific _values_ in prose (chain
  name, chain id, contract address, RPC URL, native currency symbol).
- **Pattern B — template fork**: for chain-divergent _code blocks_ (imports,
  twoslash type-checked snippets).

### Adding a new chain

When Nox is deployed to a new network, add it in one place and the rest of the
docs follow.

1. **Add one entry to `getSupportedChains()`** in `src/utils/chain.utils.ts`
   with all required fields from the `Chain` interface:

   ```ts
   {
     id: myChain.id,
     name: 'My Chain',
     icon: myChainLogo, // imported from @/assets/icons/…
     nativeCurrency: myChain.nativeCurrency,
     rpcUrls: myChain.rpcUrls,
     blockExplorers: myChain.blockExplorers,
     chainName: 'my-chain-testnet',
     noxComputeAddress: '0x…', // the NoxCompute contract on this chain
     gatewayUrl: 'https://…', // the Handle Gateway URL
     subgraphUrl: 'https://…', // the subgraph endpoint
   }
   ```

   The `id`, `nativeCurrency`, `rpcUrls`, and `blockExplorers` fields are reused
   from viem's well-known chains (`import { myChain } from 'viem/chains'`) so
   they stay correct. The `noxComputeAddress`, `gatewayUrl`, and `subgraphUrl`
   are Nox-specific and must be the real deployed values.

2. **Verify the wallet "add chain" payload (EIP-3085).** The demo components
   build the `wallet_addEthereumChain` request from the `Chain` entry, so the
   fields must be coherent:

   ```ts
   {
     chainId: `0x${chain.id.toString(16)}`,
     chainName: chain.name,
     nativeCurrency: chain.nativeCurrency,
     rpcUrls: [...chain.rpcUrls.default.http],
     blockExplorerUrls: [chain.blockExplorers.default.url],
   }
   ```

   If any of these are wrong, "add to wallet" will fail for the new chain.

3. **Add a row to the "Supported Networks" table** in
   `src/references/js-sdk/advanced-configuration.md`:

   ```markdown
   | Network          | Chain ID   |
   | ---------------- | ---------- |
   | Arbitrum Sepolia | `421614`   |
   | Ethereum Sepolia | `11155111` |
   | My Chain         | `<id>`     |
   ```

4. **Fill the per-chain branch of every existing `<template v-if>` snippet.**
   Pattern B blocks branch on the chain id (see below). Adding a chain means
   adding the matching `<template v-else-if="selectedChain === <id>">` branch to
   each forked code block so the new chain is not left blank.

### Pattern A — value injection

Use this when prose mentions a chain-specific **value** (name, chain id,
contract address, RPC URL, native currency symbol). Reference the value with a
`{{ … }}` expression and expose it via a `<script setup>` block that reads the
store.

In the prose, write the chain-dependent value as an interpolation:

```markdown
Make sure your wallet is connected to **{{ chainName }}** (use the chain
switcher in the top bar) before hitting **Deploy**.
```

Then add a `<script setup>` block (`src/getting-started/hello-world.md` does
exactly this) that derives the value from the selected chain:

```vue
<script setup>
import { computed } from 'vue';
import useUserStore from '@/stores/useUser.store';
import { getChainById } from '@/utils/chain.utils';

const userStore = useUserStore();
const selectedChain = computed(() => userStore.getCurrentChainId());
const chainData = computed(() => getChainById(selectedChain.value));
const chainName = computed(() => chainData.value?.name);
</script>
```

Expose whichever fields the page needs — e.g.
`const chainId = computed(() => chainData.value?.id)` or
`const noxComputeAddress = computed(() => chainData.value?.noxComputeAddress)` —
and reference them as `{{ chainId }}`, `{{ noxComputeAddress }}`, etc. Pull
every value from `getChainById()` so it stays correct when chains change.

### Pattern B — template fork

Use this when a **code block** has chain-divergent structural content (different
imports, different `viem/chains` chain object, twoslash type-checked code that
must compile). Fork the whole block into per-chain `<template>` branches keyed
by chain id, as the JS SDK method pages do (see
`src/references/js-sdk/methods/encryptInput.md`):

````md
<template v-if="selectedChain === 421614">

```ts twoslash
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { arbitrumSepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
```

</template>
<template v-else-if="selectedChain === 11155111">

```ts twoslash
import { createViemHandleClient } from '@iexec-nox/handle';
import { createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});

const handleClient = await createViemHandleClient(walletClient);
```

</template>
````

The `selectedChain` variable comes from the same `<script setup>` block as
Pattern A:

```vue
<script setup>
import { computed } from 'vue';
import useUserStore from '@/stores/useUser.store';

const userStore = useUserStore();
const selectedChain = computed(() => userStore.getCurrentChainId());
</script>
```

Notes:

- Branch on the numeric chain id (`421614`, `11155111`, …), matching the `id`
  field in `getSupportedChains()`.
- Keep each branch's code identical except for the lines that actually differ
  (here, the `viem/chains` import and the `chain:` value) so the branches stay
  easy to diff and maintain.
- When wrapping forked blocks that Prettier reflows incorrectly, use
  `<!-- prettier-ignore-start -->` / `<!-- prettier-ignore-end -->` around them,
  as `encryptInput.md` does.

## 📚 Project Structure

### File Organization

```
src/
├── components/          # Reusable Vue components
├── get-started/         # Getting started guides
├── guides/              # Detailed guides
├── protocol/            # Protocol documentation
├── references/          # API references
└── assets/              # Images and resources
```

### Naming Conventions

To maintain consistency, use these parameter names:

<!-- TODO -->

### Commit Message Conventions

Follow these patterns for commit messages:

- `Add: new feature or content`
- `Update: modify existing content`
- `Fix: correct errors or issues`
- `Remove: delete obsolete content`
- `Docs: documentation-only changes`

Examples:

```
Add: CardWithBorder component usage guide
Update: VitePress container recommendations
Fix: broken links in getting started guide
```

## 🐛 Testing and Validation

### Local Testing

```bash
# Build the project
npm run build

# Check syntax
npm run lint
```

### Before Submitting

- [ ] Development server runs without errors
- [ ] Vale reports no critical errors
- [ ] All links work
- [ ] Components display correctly
- [ ] Content is accessible and responsive

## 🆘 Support and Help

- 📖 [Documentation](https://docs.iex.ec)
- 💬 [Discord Community](https://discord.com/invite/5TewNUnJHN)
- 🐛 [Issue Tracker](https://github.com/iExec-Nox/documentation/issues)

## 💡 Tips for Contributors

1. **Read existing documentation** before contributing to understand the style
   and structure
2. **Always test locally** before submitting a PR
3. **Use appropriate components** to maintain visual consistency
4. **Write descriptive commit messages**
5. **Ask for help** if you're unsure about something
6. **Prefer VitePress native containers** (`::: info`, `::: tip`, etc.) over Vue
   components when possible

Thank you for contributing to improve the Nox documentation! 🎉
