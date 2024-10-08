import Web3 from "web3";
// import { newKitFromWeb3 } from "@celo/contractkit";
import cUSD from "../abis/cUSD.json";
import usdc from "../abis/usdc.json";
import { RPC_URL } from "../constants/web3Providers";
// import { web3Modal } from "../utils/chainProvider";

export const CUSD_TOKEN_ALFAJORES =
  "0x874069fa1eb16d44d622f2e0ca25eea172369bc1"; // cUSD
export const CUSD_TOKEN_CELO_MAINNET =
  "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // cUSD

export const USDC_MUMBAI = "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23";
export const USDC_POLYGON = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

export const selectTokenAddress = (network) => {
  if (network === 42220) {
    return CUSD_TOKEN_CELO_MAINNET;
  }
  if (network === 44787) {
    return CUSD_TOKEN_ALFAJORES;
  }
  if (network === 137) {
    return USDC_POLYGON;
  }
  return USDC_MUMBAI;
};

export async function configercToken(token, chainId) {
  try {
    const rpcUrl = RPC_URL[chainId];

    const httpProvider = new Web3.providers.HttpProvider(rpcUrl, {
      timeout: 10000,
    });

    const web3Provider = new Web3(
      window?.web3?.currentProvider || httpProvider
    );

    const ABI = chainId === 42220 ? cUSD : usdc;
    const contractAddress = token; // selectTokenAddress(chainId);
    const contract = new web3Provider.eth.Contract(ABI, contractAddress);

    return contract;
  } catch (error) {
    return error;
  }
}
