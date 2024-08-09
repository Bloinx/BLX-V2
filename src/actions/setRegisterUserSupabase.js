import { supabase } from "../supabaseClient";
import config from "./config.sg.web3";
import getGasFee from "./getGasFee";

const updateInvite = async (email, idRound) => {
  await supabase
    .from("invitationsByRound")
    .update({ isRegister: true })
    .match({ userEmail: email, idRound });
};

const setRegisterPosition = async (
  email,
  idRound,
  userId,
  position,
  name,
  motivation,
  walletAddress
) => {
  const { data } = await supabase.from("positionByRound").insert({
    idUser: userId,
    position,
    alias: name,
    motivation,
    wallet: walletAddress,
    idRound,
  });

  if (data) await updateInvite(email, idRound);
  return data;
};

const setRegisterUser = async (props) => {
  const {
    userId,
    walletAddress,
    roundId,
    name,
    motivation,
    position,
    wallet,
    currentProvider,
  } = props;

  const gasFee = await getGasFee(currentProvider);
  const user = supabase.auth.user();

  const { data } = await supabase.from("rounds").select().eq("id", roundId);
  let sg;
  try {
    sg = await new Promise((resolve) => {
      if (wallet !== "WalletConnect") {
        resolve(config(data[0].contract, currentProvider));
      } else {
        // resolve(walletConnect(data[0].contract, currentProvider));
      }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  return new Promise((resolve, reject) => {
    sg.methods
      .registerUser(position)
      .send({
        from: walletAddress,
        to: data[0].contract,
        maxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (recpt) => {
        try {
          const res = await setRegisterPosition(
            user.email,
            roundId,
            userId,
            position,
            name,
            motivation,
            walletAddress
          );
          if (res) {
            resolve(recpt);
          } else {
            reject(new Error("Failed to set register position"));
          }
        } catch (error) {
          console.error(error);
          reject(error);
        }
      })
      .on("error", (error) => {
        console.error(error);
        reject(error);
      });
  });
};

export default setRegisterUser;
