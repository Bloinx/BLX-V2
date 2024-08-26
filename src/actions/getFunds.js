import { ethers } from "ethers"; // Import ethers directly
import Decimal from "decimal.js";
import { ALFAJORES_RPC_URL, CELO_MAINNET_RPC_URL } from "../utils/constants";

// Constants for the networks and their RPC URLs
const NETWORK_CONFIG = {
  alfajores: {
    rpcUrl: ALFAJORES_RPC_URL,
    tokens: {
      CELO: "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9",
      cUSD: "0x874069fa1eb16d44d622f2e0ca25eea172369bc1",
    },
  },
  celoMainnet: {
    rpcUrl: CELO_MAINNET_RPC_URL,
    tokens: {
      CELO: "0x471EcE3750Da237f93B8E339c536989b8978a438",
      cUSD: "0x765de816845861e75a25fca122bb6898b8b1282a",
    },
  },
};

// Standard ERC20 ABI for balance and metadata queries
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// Helper function to format balance
function formatBalance(rawBalance, decimals) {
  // First, ensure that decimals is a number
  const numericDecimals = Number(decimals); // Safely convert BigInt or string to number

  // Check for valid input after converting types
  if (
    rawBalance === undefined ||
    numericDecimals === undefined ||
    isNaN(numericDecimals)
  ) {
    console.error(
      "formatBalance called with invalid arguments:",
      rawBalance,
      numericDecimals
    );
    return "0.000";
  }

  const scaleFactor = new Decimal(10).pow(numericDecimals);
  return new Decimal(rawBalance.toString()) // Convert BigInt to string for Decimal.js
    .dividedBy(scaleFactor)
    .toFixed(3)
    .toString();
}

// Retrieve balance for a specific ERC20 token
async function getERC20TokenBalance(walletAddress, tokenAddress, provider) {
  const contract = new ethers.Contract(tokenAddress, erc20Abi, provider);
  try {
    const [balance, decimals, symbol] = await Promise.all([
      contract.balanceOf(walletAddress),
      contract.decimals(),
      contract.symbol(),
    ]);
    return {
      name: symbol,
      balance: formatBalance(balance, decimals),
    };
  } catch (error) {
    console.error("Error getting ERC20 token balance:", error);
    throw error; // Rethrow or handle as necessary
  }
}

// Main function to get token balances
const getFunds = async (walletAddress, networkId) => {
  // console.log(walletAddress, networkId);
  const network = networkId === 44787 ? "alfajores" : "celoMainnet";
  const config = NETWORK_CONFIG[network];

  console.log("Using network config:", config);

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  console.log("Provider URL:", config.rpcUrl);

  // Fetch balances concurrently for CELO and cUSD using dynamic token addresses
  try {
    const results = await Promise.all([
      getERC20TokenBalance(walletAddress, config.tokens.CELO, provider),
      getERC20TokenBalance(walletAddress, config.tokens.cUSD, provider),
    ]);
    return results;
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw error;
  }
};

export default getFunds;
