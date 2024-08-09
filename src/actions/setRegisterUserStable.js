import { configercToken } from "./config.erc";
import getGasFee from "./getGasFee";
import { getTokenAddressById, getTokenDecimals } from "./utils";
import { getAmountToApproveWithDecimals } from "./getAmountToApprove";

import { supabase } from "../supabaseClient";

const amountToApprove = {
  4: "300000000",
  3: "300000000",
  1: "300000000000000000000",
  2: "300000000000000000000",
  5: "300000000",
  7: "600000000000000000000",
  8: "600000000000000000000",
  9: "600000000000000000000",
};

const setRegisterUser = async (props) => {
  const { walletAddress, roundId, chainId, dataApprove } = props;
  // const { chainId } = userData ? JSON.parse(userData) : null;
  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  const gasFee = await getGasFee(chainId);
  const token = await getTokenAddressById(data[0].tokenId);

  const amount = dataApprove
    ? getAmountToApproveWithDecimals(
        dataApprove.amount,
        dataApprove.groupSize,
        dataApprove.turn,
        await getTokenDecimals(data[0].tokenId)
      )
    : amountToApprove[data[0].tokenId];

  const cUSD = await new Promise((resolve, reject) => {
    try {
      resolve(configercToken(token, chainId));
    } catch (error) {
      reject(error);
    }
  });

  return new Promise((resolve, reject) => {
    cUSD.methods
      .approve(data[0].contract, amount)
      .send({
        from: walletAddress,
        to: token,
        gasFeemaxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (receipt) => {
        resolve(receipt);
      })
      .on("error", async (err) => {
        console.log("err", err);
        reject(err);
      });
  });
};

export default setRegisterUser;
