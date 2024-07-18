import React from "react";

import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import {
  createWeb3Modal,
  useWeb3Modal,
  useWeb3ModalEvents,
  useWeb3ModalState,
  useWeb3ModalTheme
} from '@web3modal/wagmi/react'

import { WagmiProvider } from "wagmi";
import { celo, celoAlfajores, polygon, polygonMumbai } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Your WalletConnect Cloud project ID
// const projectId= import.meta.env.VITE_WALLET_CONNECT_PROJECTID;
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECTID;
if (!projectId) {
  throw new Error('VITE_WALLET_CONNECT_PROJECTID is not set')
}


// 2. Create wagmiConfig
const metadata = {
  name: "Bloinx",
  description: "Bloinx dapp",
  url: "https://bloinx.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const chains = [celo, celoAlfajores, polygon, polygonMumbai];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId });

export function Web3ModalProvider({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
