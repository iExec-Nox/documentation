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
(WalletConnect), which requires a project id. Without it, both `npm run dev` and
`npm run build` fail with `You need to provide VITE_REOWN_PROJECT_ID env variable`.

Create a `.env.local` file at the project root (it is git-ignored):

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
