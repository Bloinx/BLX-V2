import Web3 from "web3";
import { RPC_URL } from "../constants/web3Providers";
import SavingGroups from "../abis/SavingGroups.json";
import SavingGroupsP from "../abis/SavingGroupsP.json";

export default async function config(savingGroupAddress, currentProvider) {
  try {
    const rpcUrl = RPC_URL[currentProvider];

    const httpProvider = new Web3.providers.HttpProvider(rpcUrl, {
      timeout: 10000,
    });

    const web3Provider = new Web3(
      window?.web3?.currentProvider || httpProvider
    );
    const ABI =
      currentProvider === 42220 || currentProvider === 44787
        ? SavingGroups
        : SavingGroupsP;
    const contract = new web3Provider.eth.Contract(ABI, savingGroupAddress);
    return contract;
  } catch (error) {
    return error;
  }
}
