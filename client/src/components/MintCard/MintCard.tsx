import { useContractRead, useContractWrite, useWaitForTransaction } from "wagmi"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import deployments from "../../deployments.json"
import { useEffect, useState } from "react"
import { Canvg } from "canvg"
import download from "../../img/download.svg"
import style from "./MintCard.module.css"

interface IMintCardProps {
  address: string
}

const contractConfig = {
  addressOrName: deployments.contracts.SyntheticNouns.address,
  contractInterface: deployments.contracts.SyntheticNouns.abi,
}

async function pngDataUrl(base64Svg: string) {
  const decodedSvg = atob(base64Svg)

  const canvas = document.querySelector("canvas")
  const ctx = canvas?.getContext("2d")

  const v = await Canvg.from(ctx!, decodedSvg)
  await v.render()
  const img = canvas?.toDataURL("image/png")
  return img
}

export const MintCard = ({ address }: IMintCardProps) => {
  const addRecentTransaction = useAddRecentTransaction()
  const [preview, setPreview] = useState<string>()
  const [png, setPng] = useState<string>()
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
      const b64svg = previewData.toString()
      setPreview(b64svg)
      pngDataUrl(b64svg).then((img) => {
        setPng(img)
      })
      const parser = new DOMParser()
      const decodedSvg = atob(b64svg)
      const svgDoc = parser.parseFromString(decodedSvg, "image/svg+xml")
      const backgroundColor = svgDoc.querySelector("rect")!.getAttribute("fill")!
      document.body.style.backgroundColor = backgroundColor
    }
  }, [previewData])

  useEffect(() => {
    console.log("isClaimedData", isClaimedData)
    if (isClaimedData !== undefined) {
      setIsClaimed(isClaimedData as any as boolean)
    }
  }, [isClaimedData])

  useEffect(() => {
    console.log("success", claimData)
    refetchClaimed()
  }, [txSuccess])

  // useEffect(() => {
  //   refetchClaimed()
  //   refetchPreview()
  //   console.log("address changed", address)
  // }, [address])

  return (
    <div>
      {isLoading ? (
        "Loading"
      ) : (
        <div style={{ width: "100%" }}>
          {preview && (
            <div>
              <img style={{ width: "100%" }} src={`data:image/svg+xml;base64,${preview}`}></img>
            </div>
          )}

          <div style={{ display: "flex", marginTop: "20px", justifyContent: "center" }}>
            {!isClaimed && (
              <button
                style={{ flexGrow: "1", marginRight: "5px" }}
                disabled={isClaimLoading || isClaimStarted || isClaimLoading}
                onClick={() => claim()}
              >
                {isClaimLoading && "Waiting for approval"}
                {isClaimStarted && "Minting..."}
                {!isClaimLoading && !isClaimStarted && "Claim"}
              </button>
            )}
            <button className={style.downloadButton}>
              <a style={{ textDecoration: "none", color: "black" }} href={png} download>
                <div style={{ display: "flex" }}>
                  <img src={download} alt="download" /> {isClaimed && <p style={{ marginLeft: "5px" }}>Download PNG</p>}
                </div>
              </a>
            </button>
          </div>

          <canvas id="canvas" style={{ display: "none", width: "1024px", height: "1024px" }}></canvas>
        </div>
      )}
    </div>
  )
}
