import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments

  const { deployer } = await getNamedAccounts()

  const nounsDescriptor = "0x0cfdb3ba1694c2bb2cfacb0339ad7b1ae5932b63"
  const ensReverseRecords = "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C"

  await deploy("SyntheticNouns", {
    from: deployer,
    log: true,
    args: [nounsDescriptor, ensReverseRecords],
    autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
  })
}
export default func
func.tags = ["SyntheticNouns"]
