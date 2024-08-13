import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import APIGetRoundDetail from "../../actions/getRoundDetailSupabase";
// import { getUrlParams } from "../../utils/browser";

import Details from "./Details";
// import { MainContext } from "../../providers/provider";
// import { useRoundContext } from "../../contexts/RoundsContext";
import Loader from "../../components/Loader";
import { useWallet } from "../../context/WalletContext";
import { useRounds } from "../../context/RoundsContext";

function RoundDetails() {
  // const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roundId = searchParams.get("roundId");
  // const baseUrl = "/round-details";
  // const { roundId } = getUrlParams(history.location.search);
  const [roundData, setRoundData] = useState();
  const [roundDataById, setRoundDataById] = useState(null);
  const { accountData, selectedNetworkId } = useWallet();
  const { activeRounds, handleGetRounds, completeRoundList } = useRounds();
  // const { currentAddress, wallet, currentProvider } = useContext(MainContext);
  // const { activeRounds, handleGetRounds, completeRoundList } =
  //   useRoundContext();

  useEffect(() => {
    if (
      !roundId ||
      activeRounds?.length < 0 ||
      !activeRounds ||
      !completeRoundList ||
      completeRoundList?.length < 0
    )
      return;
    console.log(
      activeRounds,
      completeRoundList,
      accountData.originalAddress,
      selectedNetworkId,
      "round details"
    );
    if (activeRounds.length > 0) {
      activeRounds.forEach((round) => {
        if (round.roundKey === roundId) {
          setRoundDataById(round);
        }
      });
    }
    if (completeRoundList.length > 0) {
      completeRoundList.forEach((round) => {
        if (round.roundKey === roundId) {
          setRoundDataById(round);
        }
      });
    }
  }, [activeRounds, roundId, completeRoundList]);

  useEffect(() => {
    if (!roundId || !selectedNetworkId || !accountData.originalAddress) return;
    APIGetRoundDetail(
      roundId,
      selectedNetworkId,
      accountData.originalAddress
    ).then((dataRound) => {
      setRoundData(dataRound);
    });
  }, [roundId, selectedNetworkId, accountData]);

  if (!roundData) {
    return <Loader loadingMessage="infoLoader.roundPage" />;
  }
  return (
    <Details
      roundData={roundData}
      roundId={roundId}
      currentAddress={accountData?.originalAddress}
      // wallet={wallet}
      roundDataById={roundDataById}
      currentProvider={selectedNetworkId}
      handleGetRounds={handleGetRounds}
    />
  );
}

export default RoundDetails;
