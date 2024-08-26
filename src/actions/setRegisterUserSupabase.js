import { supabase } from "../supabaseClient";
import config from "./config.sg.web3";
import getGasFee from "./getGasFee";

const updateInvite = async (email, idRound) => {
  const { data, error } = await supabase
    .from("invitationsByRound")
    .update({
      isRegister: true,
    })
    .match({ userEmail: email, idRound: idRound });

  if (error) {
    console.error("Update error:", error);
  } else if (data && data.length > 0) {
    console.log("Update successful, data:", data);
  } else {
    console.log(
      "No data returned; likely no matching record found for update."
    );
  }
};

const setRegisterPosition = async (
  email,
  idRound,
  userId,
  position,
  name,
  motivation,
  walletAddress,
  isAdmin
) => {
  const { data, error } = await supabase
    .from("positionByRound")
    .insert({
      idUser: userId,
      position,
      alias: name,
      motivation,
      wallet: walletAddress,
      idRound,
    })
    .select("*"); // This will return all columns of the inserted row(s)

  if (error) {
    console.error("Insert error:", error);
  } else if (data && !isAdmin) {
    await updateInvite(email, idRound);
    // Additional logic here when the insert operation is successful
  }
  console.log("Inserted data:", data);
  return data;
};

const setRegisterUser = async (props) => {
  const {
    userId,
    userEmail,
    walletAddress,
    roundId,
    name,
    motivation,
    position,
    // wallet,
    currentProvider,
    contract,
    isAdmin,
  } = props;

  const gasFee = await getGasFee(currentProvider);

  let sg;
  try {
    sg = await new Promise((resolve) => {
      resolve(config(contract, currentProvider));
    });
  } catch (error) {
    console.error(error);
    throw error;
  }

  console.log(
    userEmail,
    roundId,
    userId,
    position,
    name,
    motivation,
    walletAddress,
    isAdmin
  );
  //retirar luego el async ok??
  return new Promise((resolve, reject) => {
    sg.methods
      .registerUser(position)
      .send({
        from: walletAddress,
        to: contract,
        maxFeePerGas: gasFee.maxFeePerGas,
        maxPriorityFeePerGas: gasFee.maxPriorityFeePerGas,
      })
      .once("receipt", async (recpt) => {
        console.log(recpt);
        try {
          const res = await setRegisterPosition(
            userEmail,
            roundId,
            userId,
            position,
            name,
            motivation,
            walletAddress,
            isAdmin
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
