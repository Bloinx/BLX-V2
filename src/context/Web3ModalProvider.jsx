import React from "react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider } from "wagmi";
import { celo, celoAlfajores, polygon, polygonMumbai } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECTID;
if (!projectId) {
  throw new Error("VITE_WALLET_CONNECT_PROJECTID is not set");
}
const metadata = {
  name: "Bloinx",
  description: "Bloinx dapp",
  url: "https://bloinx.io",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [celoAlfajores, polygonMumbai];
// process.env.NODE_ENV === "production"
//   ? [celo, polygon]
//   : [celoAlfajores, polygonMumbai];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  wagmiConfig,
  projectId,
  // allowUnsupportedChain: false,
});

export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
