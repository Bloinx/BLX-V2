/* eslint-disable no-unused-vars */
import axios from "axios";

import { supabase } from "../supabaseClient";
import config from "./config.sg.web3";

import MethodGetGroupSize from "./methods/getGroupSize";
import MethodGetPayTime from "./methods/getPayTime";
import MethodSaveAmount from "./methods/saveAmount";
import { getTokenDecimals, getTokenSymbolByRound } from "./utils";

const dayInSeconds = 86400;

const getPositionUserAdmin = async (idRound, userAdminId) => {
  const filterByUserId = userAdminId;
  const filterbyRound = idRound;

  let query = supabase.from("positionByRound").select();

  if (filterbyRound) {
    query = query.eq("idRound", filterbyRound);
  }
  if (filterByUserId) {
    query = query.eq("idUser", filterByUserId);
  }

  const { data } = await query;

  return data[0];
};

const setEmailInvite = async (mailList, roundId) => {
  const duplicateEmails = [];

  for (const mail of mailList) {
    const { data: existingInvite, error: checkError } = await supabase
      .from("invitationsByRound")
      .select("*")
      .eq("idRound", roundId)
      .eq("userEmail", mail);

    if (checkError) {
      console.error("Error al verificar la invitación existente:", checkError);
      continue;
    }

    if (existingInvite.length === 0) {
      const { data, error } = await supabase
        .from("invitationsByRound")
        .insert([{ idRound: roundId, userEmail: mail, isRegister: false }]);

      if (error) {
        console.error("Error al insertar la invitación:", error);
      }
    } else {
      duplicateEmails.push(mail);
    }
  }

  return duplicateEmails;
};
const setSaveInvitations = async (
  mailList,
  round,
  positionData,
  currentProvider
) => {
  const duplicateEmails = await setEmailInvite(mailList, round?.id);

  const sg = await config(round?.contract, currentProvider);
  // : await walletConnect(round?.contract, currentProvider);

  const groupSize = await MethodGetGroupSize(sg.methods);
  const payTime = await MethodGetPayTime(sg.methods);
  const saveAmount = await MethodSaveAmount(sg.methods);
  const tokenSymbol = await getTokenSymbolByRound(round.tokenId);
  const decimals = await getTokenDecimals(round.tokenId);
  const longevity = (payTime / dayInSeconds) * groupSize;

  const totalAmount = Number(saveAmount * 10 ** -decimals) * Number(groupSize);
  let allEmailsSent = true;
  try {
    await mailList.forEach((mail) => {
      axios
        .post(
          "https://wtb2taazv8.execute-api.us-east-2.amazonaws.com/mandarMail/sendMail",
          {
            personalizations: [
              {
                to: [
                  {
                    email: mail,
                  },
                ],
                dynamic_template_data: {
                  user: mail,
                  title: "Inviación a la Ronda",
                  link: "https://bloinx.app/login",
                  name: "Bloinx Team",
                  name_tanda: positionData?.alias,
                  // type: "Public/Private",
                  longevity: `${longevity} días`,
                  participant: `${groupSize - 1}`,
                  amount: `${totalAmount} ${tokenSymbol}`,
                },
                subject: "Inviación a la Ronda",
              },
            ],
          }
        )
        .then(() => {
          return true;
        })
        .catch((e) => {
          allEmailsSent = false;
          console.error(`Error al enviar correo a ${mail}:`, e);
          return false;
        });
    });
  } catch (error) {
    allEmailsSent = false;
    console.error("Error en el proceso de envío de correos:", error);
  }
  return { duplicateEmails, status: allEmailsSent };
};

export const getRoundData = async (roundId) => {
  const { data, error } = await supabase
    .from("rounds")
    .select()
    .eq("id", roundId);

  return data[0];
};

export const setAllInvites = (mailList, roundId, wallet, currentProvider) => {
  return new Promise((resolve, reject) => {
    getRoundData(roundId).then((round) => {
      setEmailInvite(mailList, round?.id);
      getPositionUserAdmin(round?.id, round?.userAdmin).then(
        (positionAdminData) => {
          setSaveInvitations(
            mailList,
            round,
            wallet,
            positionAdminData,
            currentProvider
          )
            .then((status) => {
              resolve(status);
              // return status;
            })
            .catch((err) => {
              reject(err);
            });
        }
      );
    });
  });
};

export default setAllInvites;
