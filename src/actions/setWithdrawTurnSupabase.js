/* eslint-disable no-unused-vars */
import { supabase } from "../supabaseClient";
import config from "./config.sg.web3";
import MethodGetRealTurn from "./methods/getRealTurn";
import MethodGetGroupSize from "./methods/getGroupSize";
import MethodSetEndRound from "./methods/setEndRound";
import getGasFee from "./getGasFee";

const setWithdrawTurn = async (roundId, walletAddress, chainId) => {
  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  const gasFee = await getGasFee(chainId);

  const sg = await new Promise((resolve, reject) => {
    try {
      resolve(config(data[0].contract, chainId));
    } catch (error) {
      reject(error);
    }
  });

  // const sg = await config(data.contract);
  const groupSize = await MethodGetGroupSize(sg.methods);
  const realTurn = await MethodGetRealTurn(sg.methods);

  return new Promise((resolve, reject) => {
    sg.methods
      .withdrawTurn()
      .send({
        from: walletAddress,
        to: data[0].contract,
        maxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (receipt) => {
        resolve(receipt);
      })
      .on("error", async (error) => {
        reject(error);
      });
  });
};

export default setWithdrawTurn;
