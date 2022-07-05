import style from "./MintPage.module.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useContractRead, useContractWrite } from "wagmi"
import deployments from "../../deployments.json"
import { useEffect } from "react"

export const MintPage = () => {
  const { address, isConnecting, isDisconnected } = useAccount()

  // TODO: Figure out how to typecast Result
  const {
    data: isClaimed,
    isLoading: isClaimedLoading,
    refetch: refetchClaimed,
  } = useContractRead({
    addressOrName: deployments.contracts.SyntheticNouns.address,
    contractInterface: deployments.contracts.SyntheticNouns.abi,
    functionName: "claimed",
    args: [address],
  })

  const {
    data: preview,
    isLoading: isPreviewLoading,
    refetch: refetchPreview,
  } = useContractRead({
    addressOrName: deployments.contracts.SyntheticNouns.address,
    contractInterface: deployments.contracts.SyntheticNouns.abi,
    functionName: "addressPreview",
    args: [address],
  })

  const {
    isError: isClaimError,
    isLoading: isClaimLoading,
    write: claim,
  } = useContractWrite({
    addressOrName: deployments.contracts.SyntheticNouns.address,
    contractInterface: deployments.contracts.SyntheticNouns.abi,
    functionName: "claim",
  })

  return (
    <div>
      <h1>Synthetic Nouns</h1>
      <ConnectButton />
      {isClaimedLoading || isPreviewLoading ? "Loading" : `${isClaimed}`}
      {preview && <img src={`data:image/svg+xml;base64,${preview}`}></img>}
      {!isClaimed && isClaimed != undefined && <button onClick={() => claim()}>Claim</button>}
    </div>
  )
}
