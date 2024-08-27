/* eslint-disable no-unused-vars */
import config from "./config.sg.web3";
import getGasFee from "./getGasFee";

const setStartRound = async (currentWallet, roundData, chainId) => {
  //   const { data } = await supabase.from("rounds").select().eq("id", roundId);

  const gasFee = await getGasFee(chainId);
  console.log(currentWallet, roundData, chainId, "parameters start round");
  const sg = await new Promise((resolve, reject) => {
    try {
      resolve(config(roundData.contract, chainId));
    } catch (error) {
      reject(error);
    }
  });
  console.log(sg, "sg methods");
  return new Promise((resolve, reject) => {
    sg.methods
      .startRound()
      .send({
        from: currentWallet,
        to: roundData.contract,
        maxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (receipt) => {
        // await updateDoc(docRef, {
        //   invitations: [],
        // });
        resolve(receipt);
      })
      .on("error", async (error) => {
        reject(error);
      });
  });
};

export default setStartRound;
