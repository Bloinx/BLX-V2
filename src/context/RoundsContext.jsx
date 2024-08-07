import React, { createContext, useContext, useEffect, useState } from "react";

import APIGetRounds, {
  getAll,
  configByPosition,
} from "../actions/getRoundsSupabase";
import APIGetOtherRounds, {
  getAllOtherRounds,
  configByPositionOther,
} from "../actions/getRoundsOthersSupabase";
import APIGetRoundsByInvitation, {
  getRoundInvite,
  getUserAdminEmail,
  configByInvitation,
} from "../actions/getRoundsByInvitationSupabase";
import { HistoryState } from "../utils/constants";
import { useAuth } from "./AuthContext";
import { useWallet } from "./WalletContext";

const RoundsContext = createContext();

export function RoundsProvider({ children }) {
  const { user } = useAuth();
  const { accountData, selectedNetworkId } = useWallet();

  const [roundList, setRoundList] = useState(null);
  const [historyList, setHistoryList] = useState(null);

  const [otherRounds, setOtherList] = useState(null);
  const [activeRounds, setActiveRounds] = useState(null);
  const [invitations, setInvitationsList] = useState(null);

  const [completeRoundList, setCompleteRoundList] = useState(null);
  const [loadingRounds, setLoadingRounds] = useState(true);

  const getRoundsOtherData = async (
    roundsPosition,
    userId,
    walletAddress,
    currentProvider
  ) => {
    roundsPosition.forEach((positionRound) => {
      getAllOtherRounds(userId, positionRound).then((res) => {
        if (res === undefined) return;
        configByPositionOther(
          res,
          positionRound,
          walletAddress,
          currentProvider
        ).then((resData) => {
          if (resData.stage === "ON_ROUND_ACTIVE") {
            setActiveRounds((oldArray) => [...(oldArray || []), resData]);
          }
          if (resData.stage === "ON_REGISTER_STAGE") {
            setOtherList((oldArray) => [...(oldArray || []), resData]);
          }
          HistoryState.forEach((item) => {
            if (resData.stage === item) {
              setHistoryList((oldArray) => [...(oldArray || []), resData]);
            }
          });
        });
      });
    });
  };

  const getRoundsByInvitationData = (invitesData, currentProvider) => {
    invitesData.forEach((invite) => {
      getRoundInvite(invite).then((round) => {
        getUserAdminEmail(round.userAdmin).then((roundAdminEmail) => {
          configByInvitation(round, roundAdminEmail, currentProvider).then(
            (roundData) => {
              HistoryState.forEach((item) => {
                if (roundData.stage === item) {
                  setHistoryList((oldArray) => [
                    ...(oldArray || []),
                    roundData,
                  ]);
                }
              });
              if (roundData.stage === "ON_REGISTER_STAGE") {
                setInvitationsList((oldArray) => [
                  ...(oldArray || []),
                  roundData,
                ]);
              }
            }
          );
        });
      });
    });
  };

  const getRoundsData = (rounds, userId, walletAddress, currentProv) => {
    rounds.forEach((round) => {
      getAll(userId, round).then((res) => {
        configByPosition(round, res, walletAddress, currentProv).then(
          (resData) => {
            if (resData.stage === "ON_ROUND_ACTIVE") {
              setActiveRounds((oldArray) => [...(oldArray || []), resData]);
            }
            if (resData.stage === "ON_REGISTER_STAGE") {
              setRoundList((oldArray) => [...(oldArray || []), resData]);
            }
            HistoryState.forEach((item) => {
              if (resData.stage === item) {
                setHistoryList((oldArray) => [...(oldArray || []), resData]);
              }
            });
          }
        );
      });
    });
  };

  const handleGetRounds = async (address, selectedNetworkId) => {
    setLoadingRounds(true);
    if (user && address) {
      try {
        const [rounds, invitationsData, otherRoundsPosition] =
          await Promise.all([
            APIGetRounds({ userId: user.id }),
            APIGetRoundsByInvitation({ email: user.email }),
            APIGetOtherRounds({ userId: user.id }),
          ]);

        await Promise.all([
          getRoundsData(rounds, user.id, address, selectedNetworkId),
          getRoundsByInvitationData(invitationsData, selectedNetworkId),
          getRoundsOtherData(
            otherRoundsPosition,
            user.id,
            address,
            selectedNetworkId
          ),
        ]);
      } catch (error) {
        console.error("Failed to fetch or process rounds:", error);
      }
    }
    setLoadingRounds(false);
  };

  useEffect(() => {
    setCompleteRoundList(null);
    if (roundList || invitations || otherRounds) {
      setCompleteRoundList([
        ...(roundList || []),
        ...(invitations || []),
        ...(otherRounds || []),
      ]);
    }
  }, [roundList, invitations, otherRounds]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accountData.originalAddress && selectedNetworkId) {
          await handleGetRounds(accountData.originalAddress, selectedNetworkId);
        }
      } catch (error) {
        console.error("Error in fetchData useEffect:", error);
      }
    };
    fetchData();
  }, [accountData, selectedNetworkId]);

  return (
    <RoundsContext.Provider
      value={{
        roundList,
        historyList,
        otherRounds,
        invitations,
        handleGetRounds,
        completeRoundList,
        activeRounds,
        loadingRounds,
      }}
    >
      {children}
    </RoundsContext.Provider>
  );
}

export function useRounds() {
  return useContext(RoundsContext);
}
