/* eslint-disable no-unused-vars */
import moment from "moment";
import { supabase } from "../supabaseClient";
import MethodGetAddressOrderList from "./methods/getAddressOrderList";
import MethodGetAdmin from "./methods/getAdmin";
import MethodGetStage from "./methods/getStage";
import MethodGetPayTime from "./methods/getPayTime";
import MethodGetStartTime from "./methods/getStartTime";
import MethodGetGroupSize from "./methods/getGroupSize";
import MethodGetRealTurn from "./methods/getRealTurn";
import MethodGetTurn from "./methods/getTurn";
import MethodGetFuturePayments from "./methods/getFuturePayments";
import { getTokenDecimals } from "./utils";
import { getFuturePaymentsFormatted } from "../utils/format";
import config from "./config.sg.web3";

const getPositionAdmin = async (idRound, userId) => {
  const filterByUserId = userId;
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

const getPositionUserByAddress = async (roundId) => {
  const filterbyRound = roundId;

  let query = supabase.from("positionByRound").select();

  if (filterbyRound) {
    query = query.eq("idRound", filterbyRound);
  }
  // if (filterByAddress) {
  //   query = query.eq("wallet", filterByAddress);
  // }

  const { data } = await query;
  return data;
};

const getDateToWithdraw = (startTime, payTime, userPosition) => {
  if (startTime && payTime && !Number.isNaN(Number(startTime))) {
    const withdrawDate = new Date(
      (Number(startTime) + userPosition * payTime + 10) * 1000
    );
    return moment(withdrawDate).format("DD - MMM - YYYY HH:mm");
  }
  return "---";
};

const getParticipantsData = (
  orderList,
  round,
  payTime,
  startTime,
  admin,
  positionByRoundData
) => {
  const participantsData = orderList.map((user) => {
    const res = positionByRoundData.find((dat) => {
      return dat?.wallet.toLowerCase() === user?.address.toLowerCase();
    });
    return {
      ...user,
      address:
        user?.address === "0x0000000000000000000000000000000000000000"
          ? ""
          : user?.address,
      userId: res?.idUser,
      walletAddress: res?.wallet,
      admin: admin === user?.address,
      dateToWithdraw: getDateToWithdraw(startTime, payTime, user?.position),
    };
  });
  return participantsData;
};

const getRoundDetailData = async (
  round,
  positionAdminData,
  // wallet,
  invitations,
  currentProvider,
  currentAddress
) => {
  const sg =
    // (await wallet) !== "WalletConnect" ??
    await config(round?.contract, currentProvider);
  // : await walletConnect(round?.contract, currentProvider);

  // const sg = await config(contract);
  const admin = await MethodGetAdmin(sg.methods);

  const stage = await MethodGetStage(sg.methods);
  const startTime = await MethodGetStartTime(sg.methods);
  const payTime = await MethodGetPayTime(sg.methods);
  const groupSize = await MethodGetGroupSize(sg.methods);
  let realTurn = "0";
  if (stage === "ON_ROUND_ACTIVE") {
    realTurn = await MethodGetRealTurn(sg.methods);
  }
  const turn = await MethodGetTurn(sg.methods);

  const tokenDecimals = await getTokenDecimals(round?.tokenId);
  const futurePayments = await MethodGetFuturePayments(
    sg.methods,
    currentAddress
  );
  const resultFuturePayments = getFuturePaymentsFormatted(
    futurePayments,
    tokenDecimals
  );

  const orderList = await MethodGetAddressOrderList(sg.methods);
  const positionByRoundData = await getPositionUserByAddress(round?.id);
  const participantsData = await getParticipantsData(
    orderList,
    round,
    payTime,
    startTime,
    admin,
    positionByRoundData
  );

  const { contract, userAdmin } = round;
  const a = {
    round,
    stage,
    contract,
    userAdmin,
    positionAdminData,
    participantsData,
    invitations,
    groupSize,
    realTurn,
    turn,
    futurePayments: resultFuturePayments,
  };
  return a;
};

const getRoundData = async (roundId) => {
  const { data } = await supabase.from("rounds").select().eq("id", roundId);

  return data[0];
};

const getRoundInvitations = async (roundId) => {
  const { data } = await supabase
    .from("invitationsByRound")
    .select()
    .eq("idRound", roundId);

  return data;
};

const getRoundDetailSupabase = async (
  roundId,
  // wallet,
  currentProvider,
  currentAddress
) => {
  return new Promise((resolve, reject) => {
    getRoundData(roundId).then((round) => {
      getPositionAdmin(roundId, round.userAdmin).then((positionAdminData) => {
        getRoundInvitations(roundId).then((invitations) => {
          getRoundDetailData(
            round,
            positionAdminData,
            // wallet,
            invitations,
            currentProvider,
            currentAddress
          ).then((rs) => {
            resolve(rs);
          });
        });
      });
    });
  });
};

export default getRoundDetailSupabase;
// export default getRoundDetail;
