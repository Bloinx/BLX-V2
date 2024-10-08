/* eslint-disable no-unused-vars */

import config from "./config.sg.web3";
// import MethodGetRealTurn from "./methods/getRealTurn";
// import MethodGetGroupSize from "./methods/getGroupSize";
import MethodSetEndRound from "./methods/setEndRound";
// import getGasFee from "./utils/getGasFee";

const setEndRound = async (contractAddress, walletAddress, chainId) => {
  //   const { data } = await supabase.from("rounds").select().eq("id", roundId);
  //   const gasFee = await getGasFee(chainId);

  const sg = await new Promise((resolve, reject) => {
    try {
      resolve(config(contractAddress, chainId));
    } catch (error) {
      reject(error);
    }
  });

  //   // const sg = await config(data.contract);
  //   const groupSize = await MethodGetGroupSize(sg.methods);
  //   const realTurn = await MethodGetRealTurn(sg.methods);

  return new Promise((resolve, reject) => {
    MethodSetEndRound(sg.methods, {
      walletAddress,
      contract: contractAddress,
    })
      .then((endReceipt) => {
        resolve(endReceipt);
      })
      .catch((endErr) => {
        const er = endErr;
        reject(er);
      });
  });
};

export default setEndRound;
