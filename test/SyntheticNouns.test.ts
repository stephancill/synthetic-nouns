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
    const chainId = await hre.getChainId()
    console.log(hre.deployments.getNetworkName())
    console.log(chainId)

    const nounsDescriptor = (await hre.deployments.get("NounsDescriptor")).address
    const ensReverseRecords = (await hre.deployments.get("ReverseRecords")).address

    syntheticNouns = await syntheticNounsFactory.deploy(nounsDescriptor, ensReverseRecords)
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
    // console.log(uri)
    const metadata = JSON.parse(Buffer.from(uri.split(",")[1], "base64").toString())
    // console.log(metadata.image)
    // console.log(metadata.description)
    ;["name", "description", "image"].forEach((key) => expect(Object.keys(metadata)).to.contain(key))

    expect(metadata.description.toLowerCase()).to.contain(user.address.toLowerCase())

    const svg = Buffer.from(metadata.image.split(",")[1], "base64").toString()

    expect(isSvg(svg)).to.be.true
  })

  it("contains the claimer's ENS name", async function () {
    // Impersonate vitalik.eth
    const vitalikdoteth = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [vitalikdoteth],
    })
    const user = await ethers.getSigner(vitalikdoteth)
    await syntheticNouns.connect(user).claim()

    const uri = await syntheticNouns.tokenURI(1)
    expect(uri).to.not.equal(undefined)
    const metadata = JSON.parse(Buffer.from(uri.split(",")[1], "base64").toString())
    // console.log(metadata.image)
    ;["name", "description", "image"].forEach((key) => expect(Object.keys(metadata)).to.contain(key))

    const ensName = await ethers.provider.lookupAddress(vitalikdoteth)

    expect(metadata.description).to.contain(ensName)
  })

  it("generates a preview given an address", async function () {
    const user = signers[2]
    const b64 = await syntheticNouns.addressPreview(user.address)
    const svg = Buffer.from(b64, "base64").toString()
    expect(isSvg(svg)).to.be.true
  })
})
