# Liquid Real Estate

## Description
Liquid Real Estate is a decentralized platform that enables users to invest in tokenized real estate assets with hyper liquidity. Properties are fractionalized using ERC-1155 semi-fungible tokens, allowing users to own individual units of a property and freely trade them on-chain.

A designated "Realtor" role can mint new properties by providing descriptions, assigning unit supply, and setting prices. Once minted, properties can be listed on the marketplace, where users can browse details and purchase fractional units.

After acquiring units, users can use them as collateral to request loans within the protocol. The platform calculates repayment obligations using a fixed interest rate and tracks loan status, repayments, and due dates — all on the Mantle network.

To support lending operations, we've integrated MXNB, a stablecoin from the Juno ecosystem, via the Arbitrum network. Liquidity providers on Arbitrum can inject capital into a decentralized pool that fuels the lending functionality on Mantle through cross-chain interoperability.

## Features
- Real estate fractionalization via ERC-1155
- On-chain marketplace for property tokens
- Collateralized loans using fractional units
- Cross-chain liquidity sourcing (Arbitrum ↔ Mantle)
- Live investor dashboard with performance metrics

## Architecture
The platform consists of several key components:

1. **Frontend (React + Vite)**
   - User interface for property browsing, investment, and loan management
   - Integration with MetaMask for wallet connectivity
   - Real-time updates of property and loan status

2. **Smart Contracts**
   - Real Estate Token (ERC-1155): Manages property fractionalization
   - Escrow: Handles property token transfers and payments
   - Loan Handler: Manages loan creation, tracking, and repayments
   - Liquidity Pool: Facilitates cross-chain liquidity provision

3. **Cross-Chain Integration**
   - Arbitrum: Hosts the liquidity pool and MXNB stablecoin
   - Mantle: Main network for property tokenization and lending

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MetaMask wallet
- Access to Arbitrum and Mantle networks

### Installation
1. Clone the repository
```bash
git clone [repository-url]
cd liquid-real-estate/front-end
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_REAL_ESTATE_TOKEN_ADDRESS=0x2855221327E2C93474Bf3041bd8217C31b48Da36
VITE_ESCROW_ADDRESS=0x7933d67FFe76E2a202Fd198DE7DA7Dec48c35d3A
VITE_LOAN_HANDLER_ADDRESS=0xa6145e0136bFF0f3c9d9505da62f35D7E202ef79
VITE_LIQUIDITY_POOL_ADDRESS=0x14b1BcDe6f1eE136D143ea5EF29557022c37482A
VITE_MXNB_ADDRESS=0x82B9e52b26A2954E113F94Ff26647754d5a4247D
```

4. Start the development server
```bash
npm run dev
```

## Smart Contracts

### Real Estate Token (ERC-1155) (MANTLE NETWORK)
- **Address**: `0x2855221327E2C93474Bf3041bd8217C31b48Da36`
- **Purpose**: Manages property fractionalization and unit ownership
- **Features**: Minting, transferring, and tracking property units

### Escrow (MANTLE NETWORK)
- **Address**: `0x7933d67FFe76E2a202Fd198DE7DA7Dec48c35d3A`
- **Purpose**: Handles secure property token transfers and payments
- **Features**: Safe exchange of tokens and funds

### Loan Handler (MANTLE NETWORK)
- **Address**: `0xa6145e0136bFF0f3c9d9505da62f35D7E202ef79`
- **Purpose**: Manages loan creation and tracking
- **Features**: Loan origination, repayment tracking, collateral management

### Liquidity Pool (ARBITRUM NETWORK)
- **Address**: `0x14b1BcDe6f1eE136D143ea5EF29557022c37482A`
- **Purpose**: Facilitates cross-chain liquidity provision
- **Features**: Investment management, yield distribution

### MXNB Token (ARBITRUM NETWORK)
- **Address**: `0x82B9e52b26A2954E113F94Ff26647754d5a4247D`
- **Purpose**: Stablecoin for loan operations
- **Features**: Cross-chain transfers, stable value

## Summary
Liquid Real Estate bridges DeFi and tangible asset investment, democratizing access to property ownership and decentralized credit. By leveraging ERC-1155 tokens and cross-chain interoperability, the platform enables fractional property ownership, on-chain trading, and collateralized lending, all while maintaining high liquidity through the integration of MXNB stablecoin and a decentralized liquidity pool. 
