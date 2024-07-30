/* eslint-disable no-unused-vars */
import { supabase } from "../supabaseClient";
import config from "./config.main.web3";
import { selectTokenAddress } from "./config.erc";
import { getTokenId, getTokenIdP, getTokenAddress } from "./utils";
import getGasFee from "./getGasFee";
import { selectContractAddress } from "../utils/constants";

const adminFee = 2;
const BLX_TOKEN_CELO_MAINNET = "0x37836007FC99C7cB3D4590cb466692ff7690074c"; // BLX

const setCreateRound = async ({
  warranty,
  saving,
  groupSize,
  payTime,
  tokenSelected,
  isPublic,
  currentAddress,
  currentProvider,
  session,
}) => {
  const gasFee = await getGasFee(currentProvider);
  const tokenAddress = await getTokenAddress(tokenSelected);

  try {
    const factory = await config(currentProvider);

    const handleReceipt = async (receipt) => {
      const contract = receipt?.events?.RoundCreated?.returnValues?.childRound;
      const admin = receipt.from;
      const folio = receipt.transactionHash;
      const idUser = session.user.id;
      const tokenIds =
        currentProvider === 42220 || currentProvider === 44787
          ? await getTokenId(currentProvider)
          : await getTokenIdP(tokenSelected);

      const { data, error } = await supabase
        .from("rounds")
        .insert([
          {
            userAdmin: idUser,
            wallet: admin,
            contract,
            folio,
            isPublic,
            tokenId: tokenIds,
          },
        ])
        .select(); // Use select() to return the inserted rows

      if (error) {
        console.error("Error inserting round:", error.message);
      } else {
        console.log("Round created successfully:", data);
      }
    };

    const sendTransaction = async (token) => {
      return new Promise((resolve, reject) => {
        factory.contract.methods
          .createRound(
            warranty,
            saving,
            groupSize,
            adminFee,
            payTime,
            token,
            currentProvider === 42220 || currentProvider === 44787
              ? BLX_TOKEN_CELO_MAINNET
              : "0x0000000000000000000000000000000000000000"
          )
          .send({
            from: currentAddress,
            to: selectContractAddress(currentProvider),
            maxFeePerGas: gasFee.maxFeePerGas,
            maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
          })
          .once("receipt", async (receipt) => {
            await handleReceipt(receipt);
            resolve(receipt);
          })
          .on("error", (error) => {
            console.error("Transaction error:", error);
            reject(error);
          });
      });
    };

    if (currentProvider === 42220 || currentProvider === 44787) {
      const token = selectTokenAddress(currentProvider);
      await sendTransaction(token);
    } else {
      await sendTransaction(tokenAddress);
    }
  } catch (error) {
    console.log("Error in setCreateRound:", error.message);
  }
};

export default setCreateRound;
