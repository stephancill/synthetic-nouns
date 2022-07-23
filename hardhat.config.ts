import { HardhatUserConfig, task } from "hardhat/config"
import "@typechain/hardhat"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-ethers"
import "hardhat-deploy"
import dotenv from "dotenv"
import { HardhatNetworkUserConfig } from "hardhat/types"
import { INounsDescriptor__factory } from "./types"
dotenv.config()

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.address)
  }
})

task("t", "test", async (args, hre) => {
  // Interact with the contract
  const address = (await hre.deployments.get("NounsDescriptor")).address
  const descriptor = INounsDescriptor__factory.connect(address, hre.ethers.provider)
  console.log(await descriptor.backgroundCount()) // Conclusion: Rinkeby contracts could be bugged
})

task("p", "pending", async (args, hre) => {
  // Interact with the contract
  const { ethers } = hre
  const address = new ethers.Wallet(process.env.SIGNER_KEY!).address
  // const txs = ethers.provider.getTransactionCount
})

let hardhatNetwork: HardhatNetworkUserConfig = {}

if (process.env.FORK) {
  if (process.env.FORK === "mainnet") {
    console.log("forking mainnet")
    hardhatNetwork = {
      chainId: 1,
      forking: {
        url: process.env.RPC_URL!,
        enabled: true,
      },
    }
  }
  if (process.env.FORK === "rinkeby") {
    console.log("forking rinkeby")
    hardhatNetwork = {
      chainId: 4,
      forking: {
        url: process.env.RINKEBY_RPC_URL!,
        enabled: true,
      },
    }
  }
}

const config: HardhatUserConfig = {
  solidity: "0.8.6",
  networks: {
    hardhat: hardhatNetwork,
    rinkeby: {
      chainId: 4,
      url: process.env.RINKEBY_RPC_URL!,
      accounts: [process.env.SIGNER_KEY!],
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY!,
        },
      },
    },
    mainnet: {
      chainId: 1,
      url: process.env.RPC_URL!,
      accounts: [process.env.SIGNER_KEY!],
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
}

export default config
