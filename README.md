# Nox Documentation

## 📋 Prerequisites

- **Node.js**: Version 24 or higher
- **npm**: Comes bundled with Node.js

## 🚀 Getting Started

### Installation

Install the project dependencies:

```bash
npm install
```

### Environment variables

The chain switcher integrates [Reown AppKit](https://cloud.reown.com)
(WalletConnect). Set `VITE_REOWN_PROJECT_ID` to enable WalletConnect (the QR
modal). It is optional: without it, `npm run dev` and `npm run build` still
work, and so do doc-view chain switching and the injected-wallet (MetaMask) path
— only the WalletConnect QR modal is unavailable.

To enable WalletConnect, create a `.env.local` file at the project root (it is
git-ignored):

```bash
VITE_REOWN_PROJECT_ID=your_project_id_here
```

Get a free project id from the [Reown dashboard](https://cloud.reown.com).

### Development Server

Start the development server:

```bash
npm run dev
```

The documentation site will be available at `http://localhost:3000` (or the port
shown in your terminal).

### Building for Production

To build the project for production:

```bash
npm run build
```

## 🆘 Support

- 📖 [Documentation](https://docs.iex.ec)
- 💬 [Discord Community](https://discord.com/invite/5TewNUnJHN)
- 🐛 [Issue Tracker](https://github.com/iExec-Nox/documentation/issues)
