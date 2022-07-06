import { useContractRead, useContractWrite } from "wagmi"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import deployments from "../../deployments.json"
import { useState } from "react"

interface IMintCardProps {
  address: string
}

export const MintCard = ({ address }: IMintCardProps) => {
  const addRecentTransaction = useAddRecentTransaction()
  const [txHash, setTxHash] = useState<string | undefined>()

  // // TODO: Figure out how to typecast Result
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
    onSuccess: (txData) => {
      addRecentTransaction({
        hash: txData.hash,
        description: "Claimed a Synthetic Noun",
      })
      refetchClaimed()
      refetchPreview()
    },
  })

  const isLoading = isClaimedLoading || isPreviewLoading || isClaimLoading

  return (
    <div>
      {isLoading ? (
        "Loading"
      ) : (
        <div>
          {preview && <img src={`data:image/svg+xml;base64,${preview}`}></img>}
          {!isClaimed && <button onClick={() => claim()}>Claim</button>}
        </div>
      )}
    </div>
  )
}
