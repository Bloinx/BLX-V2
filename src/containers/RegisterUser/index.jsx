/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";

import Terms from "./Terms";
import Form from "./Form";

import APIgetRoundRegisterDetail from "../../actions/getRoundRegisterDetailSupabase";

import { INITIAL_FORM_VALUES } from "./constants";
// import { MainContext } from "../../providers/provider";
// import { useRoundContext } from "../../contexts/RoundsContext";
import Loader from "../../components/Loader";
import { useRounds } from "../../context/RoundsContext";
import { useWallet } from "../../context/WalletContext";

export default function RegisterUser() {
  const baseUrl = "/register-user";
  // const { roundId } = getUrlParams(history.location.search);
  const [searchParams] = useSearchParams();
  const roundId = searchParams.get("roundId");
  console.log(roundId);
  const [form, setForm] = useState(INITIAL_FORM_VALUES);
  const [roundData, setRoundData] = useState();
  // const { currentAddress, wallet, currentProvider, funds } =
  //   useContext(MainContext);
  // const [tokenBalance, setTokenBalance] = useState();
  const { accountData, selectedNetworkId, funds } = useWallet();
  const { handleGetRounds } = useRounds();

  useEffect(() => {
    APIgetRoundRegisterDetail(
      roundId,
      accountData.originalAddress,
      selectedNetworkId
    ).then((dataRound) => {
      setRoundData(dataRound);
    });
  }, [roundId, selectedNetworkId, accountData]);

  if (roundData === undefined) {
    return <Loader loadingMessage="infoLoader.roundPage" />;
  }

  return (
    <Terms
      form={form}
      baseUrl={baseUrl}
      walletAddress={accountData.originalAddress}
      roundData={roundData}
      // wallet={wallet}
      chainId={selectedNetworkId}
      funds={funds}
    />

    // <Route
    //   path={`${baseUrl}/join`}
    //   component={() => (
    //     <Form
    //       form={form}
    //       setForm={setForm}
    //       roundData={roundData}
    //       walletAddress={currentAddress}
    //       wallet={wallet}
    //       currentProvider={currentProvider}
    //       handleGetRounds={handleGetRounds}
    //     />
  );
}
