/* eslint-disable no-unused-vars */
import { supabase } from "../supabaseClient";
import config from "./config.sg.web3";

import MethodGetStage from "./methods/getStage";

export const configByInvitation = async (
  round,
  // wallet,
  adminEmail,
  currentProvider
) => {
  const sg =
    // (await wallet) !== "WalletConnect" ??
    await config(round.contract, currentProvider);
  // : await walletConnect(round.contract, currentProvider);
  const stage = await MethodGetStage(sg.methods);

  const roundData = {
    stage,
    roundKey: round.id,
    toRegister: true,
    fromInvitation: true,
    fromEmail: adminEmail,
    contract: round.contract,
  };

  return roundData;
};

export const getUserAdminEmail = async (idUserAdmin) => {
  const { data } = await supabase
    .from("profiles")
    .select()
    .eq("id", idUserAdmin);

  return data[0].email;
};

export const getInviteByEmail = async ({ email }) => {
  const filterByEmail = email;
  const filterbyIsRegister = false;

  let query = supabase.from("invitationsByRound").select();
  if (filterByEmail) {
    query = query.eq("userEmail", filterByEmail);
  }
  query = query.eq("isRegister", filterbyIsRegister);

  const { data } = await query;
  return data;
};

export const getRoundInvite = async (invite) => {
  const { data } = await supabase
    .from("rounds")
    .select()
    .eq("id", invite.idRound);
  return data[0];
};

export default getInviteByEmail;
