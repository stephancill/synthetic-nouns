import "./App.css"
import "@rainbow-me/rainbowkit/dist/index.css"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { publicProvider } from "wagmi/providers/public"
import { MintPage } from "./pages/MintPage/MintPage"

const { chains, provider } = configureChains(
  [chain.mainnet],
  [
    jsonRpcProvider({
      static: true,
      rpc: () => ({
        http: process.env.REACT_APP_RPC_URL!,
      }),
    }),
    // publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: "Synthetic Nouns",
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <MintPage />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
