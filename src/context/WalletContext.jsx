import React, { createContext, useContext, useState, useEffect } from "react";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import detectEthereumProvider from "@metamask/detect-provider";
import { isNetworkValid } from "../constants/networks";
import { celo, celoAlfajores } from "wagmi/chains";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [funds, setFunds] = useState(null);
  const [accountData, setAccountData] = useState({
    publicAddress: null,
    originalAddress: null,
  });

  const { open } = useWeb3Modal();
  const { isOpen, selectedNetworkId } = useWeb3ModalState();
  const { address, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const getDefaultChain = () => {
    // return process.env.NODE_ENV === "production" ? celo : celoAlfajores;
    return celoAlfajores;
  };

  useEffect(() => {
    if (isDisconnected) {
      setAccountData({ publicAddress: null, originalAddress: null });
    }
  }, [isDisconnected]);

  useEffect(() => {
    const handleNetworkSwitch = async () => {
      const provider = await detectEthereumProvider();
      if (provider && address) {
        const hexChainId = await provider.request({ method: "eth_chainId" });
        const chainId = parseInt(hexChainId, 16);
        if (!isNetworkValid(chainId)) {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: `0x${parseInt(getDefaultChain().id, 10).toString(16)}`,
                },
              ],
            });
            setAccountData({
              publicAddress: `${address.slice(0, 4)}...${address.slice(
                address.length - 4,
                address.length
              )}`.toUpperCase(),
              originalAddress: address,
            });
          } catch (error) {
            console.error("Failed to switch network", error);
            disconnect();
            open();
          }
        } else {
          setAccountData({
            publicAddress: `${address.slice(0, 4)}...${address.slice(
              address.length - 4,
              address.length
            )}`.toUpperCase(),
            originalAddress: address,
          });
        }
      }
    };

    handleNetworkSwitch();
  }, [address, selectedNetworkId, isDisconnected]);

  return (
    <WalletContext.Provider
      value={{
        accountData,
        setAccountData,
        selectedNetworkId,
        open,
        isOpen,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
