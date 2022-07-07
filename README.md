# Basic Sample Hardhat Typescript Project

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
FORK=mainnet yarn hardhat node
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
mkdir localhost
cp -r ./deployments/mainnet ./deployments/localhost
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
