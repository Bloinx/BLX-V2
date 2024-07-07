import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import detectEthereumProvider from "@metamask/detect-provider";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  // const [walletAddress, setWalletAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [funds, setFunds] = useState(null);
  const [walletName, setWalletName] = useState();
  const [accountData, setAccountData] = useState({
    publicAddress: null,
    originalAdress: null,
  });

  // metamask
  const connectWallet = async (walletName, network) => {
    try {
      const detectedProvider = await detectEthereumProvider();
      if (!detectedProvider) {
        console.error("No wallet provider found!");
        return;
      }

      // Requesting accounts
      await detectedProvider.request({ method: "eth_requestAccounts" });

      // Getting the list of accounts
      const accounts = await detectedProvider.request({
        method: "eth_accounts",
      });
      const selectedAddress = accounts[0];

      setProvider(detectedProvider);
      setWalletName(walletName);
      setChainId(network?.chainId);
      setAccountData({
        publicAddress:
          `${selectedAddress?.slice(0, 4)}...${selectedAddress?.slice(
            selectedAddress.length - 4,
            selectedAddress.length
          )}`.toUpperCase(),
        originalAdress: selectedAddress,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    // setWalletAddress(null);
    setChainId(null);
    setAccountData({ publicAddress: null, originalAdress: null });
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        console.log("Please connect to MetaMask.");
      } else {
        setWalletAddress(accounts[0]);
        setAccountData({
          publicAddress: `${accounts[0]?.slice(0, 4)}...${accounts[0]?.slice(
            accounts[0].length - 4,
            accounts[0].length
          )}`.toUpperCase(),
          originalAdress: accounts[0],
        });
      }
    };

    if (provider) {
      provider.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (provider) {
        provider.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, [provider]);

  return (
    <WalletContext.Provider
      value={{
        accountData,
        chainId,
        connectWallet,
        disconnectWallet,
        provider,
        setProvider,
        walletName,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
