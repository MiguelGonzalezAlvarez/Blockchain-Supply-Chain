# ChainTrace - Supply Chain Traceability DApp

A decentralized supply chain traceability platform built with Solidity, Hardhat, Next.js, and Ethereum.

## Overview

ChainTrace allows manufacturers, logistics providers, and consumers to track products through every stage of the supply chain using blockchain technology. Each product is represented as an NFT with complete traceability history stored on-chain.

## Features

- **Product Registration**: Register products as NFTs with metadata (name, description, origin, manufacturer, category)
- **Traceability Events**: Track every supply chain stage (Production → Packaging → Storage → Transport → Distribution → Delivered)
- **Product Transfer**: Transfer product ownership between actors in the supply chain
- **Verification**: Public verification of product authenticity via product ID
- **Role Management**: Assign roles to different actors in the supply chain

## Tech Stack

### Smart Contracts
- **Solidity** v0.8.1
- **Hardhat** - Development environment
- **OpenZeppelin** - ERC-721 implementation

### Frontend
- **Next.js** 16 - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wagmi** - Ethereum interaction
- **RainbowKit** - Wallet connection
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Testing & Deployment
- **Hardhat** - Local testing & deployment
- **Chai** - Test assertions
- **Ethereum Sepolia** - Testnet deployment

## Project Structure

```
smart-contracts-app/
├── contracts/
│   ├── ChainTrace.sol      # Main traceability contract
│   └── ProductNFT.sol      # ERC-721 token for products
├── scripts/
│   └── deploy.js           # Deployment script
├── test/
│   └── ChainTrace.test.js  # Comprehensive test suite
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # React components
│   │   └── lib/            # Web3 & utility functions
│   └── package.json
├── hardhat.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or other Web3 wallet

### Installation

1. **Clone and install dependencies**:
```bash
# Root project
npm install

# Frontend
cd frontend
npm install
```

2. **Configure environment**:
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your settings:
# - SEPOLIA_RPC_URL: Your Alchemy/Infura Sepolia URL
# - PRIVATE_KEY: Your wallet private key (for mainnet deployment)
```

### Development

**Smart Contracts**:
```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

**Frontend**:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to view the application.

### Testing

The test suite covers:
- Product creation and NFT minting
- Traceability event management
- Product transfers
- Product verification
- Role management
- Edge cases (empty strings, long strings, timestamps)

```
20 passing tests
```

## Smart Contracts

### ProductNFT.sol

ERC-721 token representing products in the supply chain.

**Key Functions**:
- `createProduct()` - Mint new product NFT
- `getProduct()` - Retrieve product metadata
- `totalSupply()` - Get total products created
- `tokenURI()` - Return product metadata URI

### ChainTrace.sol

Main contract managing supply chain traceability.

**Key Functions**:
- `createProduct()` - Register new product with traceability history
- `addTraceabilityEvent()` - Add supply chain event
- `transferProduct()` - Transfer product ownership
- `getProductHistory()` - Get complete traceability timeline
- `getProductInfo()` - Get product details
- `verifyProduct()` - Verify product authenticity

**Supply Chain Stages**:
- 0: Production
- 1: Packaging
- 2: Storage
- 3: Transport
- 4: Distribution
- 5: Delivered

## Deployment

### Testnet (Sepolia)

1. Ensure `.env` has valid `SEPOLIA_RPC_URL` and `PRIVATE_KEY`
2. Get testnet ETH from [Sepolia Faucet](https://faucet.sepolia.org)
3. Deploy contracts:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4. Update contract address in `frontend/src/lib/contracts.ts`
5. Deploy frontend to Vercel/Netlify

### Frontend Deployment

```bash
cd frontend
npm run build
```

## Usage

1. **Connect Wallet**: Use MetaMask or another Web3 wallet
2. **Create Product**: Fill form with product details
3. **Add Events**: Track product through supply chain stages
4. **Verify**: Use product ID to verify authenticity on-chain

## Security Considerations

- All product data is immutable once recorded
- Only product owners can add traceability events
- Only contract owner can assign roles
- Use OpenZeppelin battle-tested contracts

## Gas Optimization

- Compiler optimizer enabled (200 runs)
- Minimal storage operations
- Efficient error handling

## License

MIT License

## Contributing

Contributions are welcome! Please open an issue or pull request.

## Acknowledgments

- OpenZeppelin for secure contract libraries
- Hardhat for development tooling
- RainbowKit for wallet connection UI