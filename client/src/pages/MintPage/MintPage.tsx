import style from "./MintPage.module.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useContractRead, useContractWrite } from "wagmi"

import { useEffect } from "react"
import { MintCard } from "../../components/MintCard/MintCard"

export const MintPage = () => {
  const { address, isConnecting, isDisconnected } = useAccount()

  return (
    <div>
      <h1>Synthetic Nouns</h1>
      <ConnectButton />
      {address && <MintCard address={address} />}
    </div>
  )
}
