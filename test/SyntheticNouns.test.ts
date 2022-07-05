import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { SyntheticNouns, SyntheticNouns__factory } from "../types"
import { expect } from "chai"
import isSvg from "is-svg"
import hre from "hardhat"

describe("SyntheticNouns", function () {
  let signers: SignerWithAddress[]
  let syntheticNouns: SyntheticNouns

  beforeEach(async function () {
    signers = await ethers.getSigners()
    const syntheticNounsFactory = new SyntheticNouns__factory(signers[0])
    syntheticNouns = await syntheticNounsFactory.deploy(
      "0x0cfdb3ba1694c2bb2cfacb0339ad7b1ae5932b63",
      "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C",
    )
    await syntheticNouns.deployed()
  })

  it("should let a user claim", async function () {
    const user = signers[2]
    const tx = await syntheticNouns.connect(user).claim()
    const txResult = await tx.wait()
    expect(txResult.events?.length).to.equal(2)

    const transferEvent = txResult.events![0]
    expect(transferEvent.event).to.equal("Transfer")
    expect(transferEvent.args![0]).to.equal(ethers.constants.AddressZero)
    expect(transferEvent.args![1]).to.equal(user.address)

    const mintEvent = txResult.events![1]
    expect(mintEvent.event).to.equal("NounCreated")

    const claimed = await syntheticNouns.claimed(user.address)
    expect(claimed).to.be.true

    const claimerOf = await syntheticNouns.claimerOf(1)
    expect(claimerOf).to.equal(user.address)
  })

  it("should only let the user claim once", async function () {
    const user = signers[2]
    await syntheticNouns.connect(user).claim()
    await expect(syntheticNouns.connect(user).claim()).to.be.revertedWith("Noun already claimed")
  })

  it("should return valid tokenURI", async function () {
    const user = signers[2]
    await syntheticNouns.connect(user).claim()

    const uri = await syntheticNouns.tokenURI(1)
    expect(uri).to.not.equal(undefined)
    console.log(uri)
    const metadata = JSON.parse(Buffer.from(uri.split(",")[1], "base64").toString())
    // console.log(metadata.image);
    ;["name", "description", "image"].forEach((key) => expect(Object.keys(metadata)).to.contain(key))

    expect(metadata.description).to.contain(user.address)

    const svg = Buffer.from(metadata.image.split(",")[1], "base64").toString()

    expect(isSvg(svg)).to.be.true
  })

  it("contains the claimer's ENS name", async function () {
    // Impersonate nounders.eth
    const vitalikdoteth = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [vitalikdoteth],
    })
    const user = await ethers.getSigner(vitalikdoteth)
    await syntheticNouns.connect(user).claim()

    const uri = await syntheticNouns.tokenURI(1)
    expect(uri).to.not.equal(undefined)
    console.log(uri)
    const metadata = JSON.parse(Buffer.from(uri.split(",")[1], "base64").toString())
    // console.log(metadata.image);
    ;["name", "description", "image"].forEach((key) => expect(Object.keys(metadata)).to.contain(key))

    const ensName = await ethers.provider.lookupAddress(vitalikdoteth)

    expect(metadata.description).to.contain(ensName)
  })
})
