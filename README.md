# Mintable Synthetic Nouns

Synthetic nouns are nouns that are generated using the hash of the claimer's address as a seed. There exists one per address.

### Governance

Snapshot can be used for governance using the `synthetic-nouns-with-claimer` strategy. The strategy gives an address that still owns the synthetic noun that they minted the ability to vote on Snapshot.

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

### Test on mainnet fork

Run mainnet fork node

```
FORK=mainnet yarn hardhat node --no-deploy
```

Copy mainnet deployments to localhost deployments

```
cd deployments &&
mkdir localhost &&
cp -r ./mainnet/ ./localhost/ &&
cd ..
```

Run tests

```
FORK=mainnet yarn hardhat test --network localhost
```

### Client

Start node

```
FORK=mainnet yarn hardhat node --no-deploy
```

Copy mainnet deployments to localhost deployments

```
cd deployments &&
mkdir localhost &&
cp -r ./mainnet/ ./localhost/ &&
cd ..
```

Update deployments file

```
yarn hardhat deploy --export ./client/src/deployments.json --network localhost
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

## Future improvements

- Expose `generateSeed` function
- Address preview should return data URL instead of just b64 encoded svg
- Update @notice of `generateSeed` and `claim` methods in smart contract
- Use `ERC721Enumerable` to get all the tokens owned by an address
- Add a mapping to see if a token is still owned by its original minter
- Add a function which lets you claim a token for another address and have it sent to that address
