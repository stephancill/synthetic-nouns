# Mintable Synthetic Nouns

Synthetic nouns are nouns that are generated using the hash of the claimer's address as a seed. There exists one per address.

### Run node

```
yarn hardhat node
```

Optionally export ABIs:

```
yarn hardhat deploy --export ./client/src/deployments.json --network localhost
```

Use `FORK=mainnet` to fork mainnet on the localhost network.

### Tests

Run node

```
FORK=mainnet yarn hardhat node --no-deploy
```

```
yarn hardhat test --network localhost
```

#### Test on mainnet fork

Run mainnet fork node

```
FORK=mainnet yarn hardhat node --no-deploy
```

Copy mainnet deployments to localhost deployments

```
cd deployments
mkdir localhost
cp -r ./mainnet/ ./localhost/
cd ..
```

Run tests

```
FORK=mainnet yarn hardhat test --network localhost
```

### Deployment

```
yarn hardhat deploy
```

Verify on etherscan

```
yarn hardhat etherscan-verify --network mainnet
```

### Generate types

```
yarn hardhat typechain
```
