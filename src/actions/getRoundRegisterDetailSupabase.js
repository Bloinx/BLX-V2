import MethodGetAvailablePlaces from "./methods/getAvailablePlaces";
import MethodGetCashIn from "./methods/getCashIn";
import MethodGetFeeCost from "./methods/getFeeCost";
import config from "./config.sg.web3";
import { supabase } from "../supabaseClient";
import { getTokenDecimals } from "./utils";

const getRoundRegisterDetail = async (roundId, wallet, currentProvider) => {
  try {
    const { data } = await supabase.from("rounds").select().eq("id", roundId);

    const sg = await new Promise((resolve, reject) => {
      try {
        if (wallet !== "WalletConnect") {
          resolve(config(data[0].contract, currentProvider));
        } else {
          // resolve(walletConnect(data[0].contract, currentProvider));
        }
      } catch (error) {
        reject(error);
      }
    });
    const positionsAvailable = await MethodGetAvailablePlaces(sg.methods);
    const cashIn = await MethodGetCashIn(sg.methods);
    const feeCost = await MethodGetFeeCost(sg.methods);
    console.log(wallet, data[0].wallet);
    const tokenDecimals = await getTokenDecimals(data[0].tokenId);
    return {
      ...data[0],
      roundId,
      positionsAvailable,
      cashIn: (Number(cashIn) * 10 ** -tokenDecimals).toFixed(2),
      feeCost: (Number(feeCost) * 10 ** -tokenDecimals).toFixed(2),
      isAdmin: wallet.toLowerCase() === data[0].wallet.toLowerCase(),
    };
  } catch (err) {
    return err;
  }
};

export default getRoundRegisterDetail;
