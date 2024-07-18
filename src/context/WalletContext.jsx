import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';


const WalletContext = createContext();

export function WalletProvider({ children }) {
  // const [provider, setProvider] = useState(null);
  // const [walletAddress, setWalletAddress] = useState(null);
  // const [chainId, setChainId] = useState(null);
  const [funds, setFunds] = useState(null);
  // const [walletName, setWalletName] = useState();
  const [accountData, setAccountData] = useState({
    publicAddress: null,
    originalAdress: null,
  });

  const { open } = useWeb3Modal();
  const { isOpen, selectedNetworkId } = useWeb3ModalState();
  const { address, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();


  useEffect(() => {
    console.log(selectedNetworkId, "netwoerss");
  }, [ selectedNetworkId]);

  useEffect(() => {
    if(isDisconnected){
      setAccountData({publicAddress: null, originalAddres: null});
    }
  }, [ isDisconnected]);

  useEffect(() => {
    if (address === undefined) {
      console.log("Please connect a your wallet");
    } else {
      // setWalletAddress(address);
      setAccountData({
        publicAddress: `${address?.slice(0, 4)}...${address?.slice(
          address.length - 4,
          address.length
        )}`.toUpperCase(),
        originalAdress: address,
      });
      console.log(address, "address");
    }

    // if (provider) {
    //   provider.on("accountsChanged", handleAccountsChanged);
    // }

    // return () => {
    //   if (provider) {
    //     provider.removeListener("accountsChanged", handleAccountsChanged);
    //   }
    // };
  }, [address]);

  return (
    <WalletContext.Provider
      value={{
        accountData,
        setAccountData,
        // chainId this is selectedNetworkId,
        selectedNetworkId,
        // connectWallet,
        // disconnectWallet,
        // provider,
        // setProvider,
        // walletName,
        open,
        isOpen,
        disconnect
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
