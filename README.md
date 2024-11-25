# RAP Token Presale Mini-App

A decentralized presale application for RAP tokens on the TON blockchain.

## Features

- Secure token presale contract
- Per-wallet purchase tracking
- Purchase limits
- Real-time presale statistics
- TonConnect integration
- Mobile-friendly UI

## Technical Stack

- Frontend: React + TypeScript
- Smart Contract: FunC
- Blockchain: TON
- Styling: CSS with cyberpunk theme

## Contract Details

- Token: RAP
- Total Supply: 20,000 RAP
- Price: 1 TON per RAP
- Min Purchase: 0.5 TON
- Max Purchase: 1,000 TON
- Contract Address (Mainnet): `0:bdc7e41dfd2015daca60cef7cbee5a9f487721f8165aa618c6347340c9757ee5`
- Owner Address: `UQDZVD1WEazw8ypx7kZ6UCHuQkgXRIgnMW3ttPskoxyYdaDO`

## Development

```bash
# Install dependencies
npm install

# Build contract
npm run build

# Deploy to mainnet (requires environment variables)
npm run deploy:mainnet
```

## Environment Variables

Required environment variables for deployment:
- `ENCRYPTED_MNEMONIC`: Encrypted mnemonic phrase for deployer wallet
- `ENCRYPTION_KEY`: Key for decrypting mnemonic
- `TON_CENTER_API_KEY`: API key for TON Center
- `OWNER_ADDRESS`: TonKeeper wallet address that will own the contract
- `TOTAL_SUPPLY`: Total supply of RAP tokens
- `PRICE_PER_TOKEN`: Price per RAP token in TON
- `MIN_PURCHASE`: Minimum purchase amount in TON
- `MAX_PURCHASE`: Maximum purchase amount in TON

## Security

- Encrypted sensitive data
- Secure contract deployment
- Purchase limits per wallet
- Immediate TON forwarding to owner

## License

MIT
