import style from "./MintPage.module.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount, useContractRead, useContractWrite } from "wagmi"

import { useEffect } from "react"
import { MintCard } from "../../components/MintCard/MintCard"
import deployments from "../../deployments.json"
import github from "../../img/github.svg"
import etherscan from "../../img/etherscan.svg"
import opensea from "../../img/opensea.svg"
import syntheticNounsIcon from "../../img/synthetic-nouns.png"

export const MintPage = () => {
  const { address } = useAccount()

  return (
    <div>
      <div
        style={{
          width: "300px",
          marginLeft: "auto",
          marginRight: "auto",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          height: "95vh",
          minHeight: "650px",
        }}
      >
        <div>
          <h1 style={{ display: "inline-block" }}>Synthetic Nouns</h1>
        </div>
        <div className={style.linksContainer}>
          <a href="https://github.com/stephancill/synthetic-nouns" target="_blank" rel="noopener noreferrer">
            <img src={github} alt="GitHub" />
          </a>
          <a
            href={`https://etherscan.io/address/${deployments.contracts.SyntheticNouns.address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={etherscan} alt="Etherscan" />
          </a>
          <a href={`collection/synthetic-nouns`} target="_blank" rel="noopener noreferrer">
            <img src={opensea} alt="OpenSea" />
          </a>
        </div>
        <p>A Noun for every wallet. Claim yours for free.</p>

        <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "20px" }}>
          <ConnectButton />
        </div>
        {address && <MintCard address={address} />}
      </div>
      <div style={{ textAlign: "center" }}>
        Created by{" "}
        <a href="https://twitter.com/stephancill" target="_blank" rel="noopener noreferrer">
          @stephancill
        </a>
      </div>
    </div>
  )
}
