import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import readline from "readline"

function userInput(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close()
      resolve(ans)
    }),
  )
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const chainId = await getChainId()
  console.log(deployments.getNetworkName())
  console.log(chainId)
  const nounsDescriptor = (await deployments.get("NounsDescriptor")).address
  const ensReverseRecords = (await deployments.get("ReverseRecords")).address

  const confirmation = await userInput(`
  Confirm chain id: ${chainId}\n
  Confirm deployer address: ${deployer}\n
  Confirm Nouns Descriptor Address: ${nounsDescriptor}\n
  Confirm ENS reverse resolution address: ${ensReverseRecords}\n
  \n'y' to continue, ENTER to cancel\n`)
  if (confirmation.toLowerCase() !== "y") {
    throw new Error("User denied deployment details")
  }

  await deploy("SyntheticNouns", {
    from: deployer,
    log: true,
    args: [nounsDescriptor, ensReverseRecords],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SyntheticNouns"]
