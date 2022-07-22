import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import deployments from "../../deployments.json"
import { useEffect, useState } from "react"

interface IMintCardProps {
  address: string
}

const contractConfig = {
  addressOrName: deployments.contracts.SyntheticNouns.address,
  contractInterface: deployments.contracts.SyntheticNouns.abi,
}

export const MintCard = ({ address }: IMintCardProps) => {
  const addRecentTransaction = useAddRecentTransaction()
  const [txHash, setTxHash] = useState<string | undefined>()
  const [preview, setPreview] = useState<string>()
  const [isClaimed, setIsClaimed] = useState<boolean>(false)
  // // TODO: Figure out how to typecast Result
  const {
    data: isClaimedData,
    isLoading: isClaimedLoading,
    refetch: refetchClaimed,
  } = useContractRead({
    ...contractConfig,
    functionName: "claimed",
    args: [address],
  })

  const {
    data: previewData,
    isLoading: isPreviewLoading,
    refetch: refetchPreview,
  } = useContractRead({
    ...contractConfig,
    functionName: "addressPreview",
    args: [address],
  })

  const {
    data: claimData,
    isError: isClaimError,
    isLoading: isClaimLoading,
    isSuccess: isClaimStarted,
    write: claim,
  } = useContractWrite({
    ...contractConfig,
    functionName: "claim",
    onSuccess: (txData) => {
      addRecentTransaction({
        hash: txData.hash,
        description: "Claimed a Synthetic Noun",
      })
    },
  })

  const { isSuccess: txSuccess, error: txError } = useWaitForTransaction({
    hash: claimData?.hash,
  })

  const isLoading = isClaimedLoading || isPreviewLoading

  useEffect(() => {
    if (previewData) {
      setPreview(previewData.toString())
    }
  }, [previewData])

  useEffect(() => {
    if (isClaimedData) {
      setIsClaimed(isClaimedData as any as boolean)
    }
  }, [isClaimed])

  useEffect(() => {
    console.log("success", claimData)
    refetchClaimed()
  }, [txSuccess])

  return (
    <div>
      {isLoading ? (
        "Loading"
      ) : (
        <div>
          {preview && <img src={`data:image/svg+xml;base64,${preview}`}></img>}
          {!isClaimed && (
            <button
              style={{ marginTop: 24 }}
              disabled={isClaimLoading || isClaimStarted}
              className="button"
              data-mint-loading={isClaimLoading}
              data-mint-started={isClaimStarted}
              onClick={() => claim()}
            >
              {isClaimLoading && "Waiting for approval"}
              {isClaimStarted && "Minting..."}
              {!isClaimLoading && !isClaimStarted && "Mint"}
            </button>
          )}
          {/* {!isClaimed && <button onClick={() => claim()}>Claim</button>} */}
        </div>
      )}
    </div>
  )
}
