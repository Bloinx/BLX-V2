/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import CreateBatchForm from "./CreateBatchForm";
import CreateBatchReceipt from "./CreateBatchReceipt";

import { INITIAL_FORM_VALUES } from "./constants";
// import { MainContext } from "../../providers/provider";
import useToken from "../../hooks/useToken";

import { useWallet } from "../../context/WalletContext";

// Define BatchForm component outside of CreateBatch
// const CreateBatchForm = ({
//   form,
//   setForm,
//   setTokenSelected,
//   tokenSelected,
//   tokens,
// }) => (
//   <BatchForm
//     form={form}
//     setForm={setForm}
//     setTokenSelected={setTokenSelected}
//     tokenSelected={tokenSelected}
//     tokens={tokens}
//   />
// );

// Define BatchReceipt component outside of CreateBatch
// const CreateBatchReceipt = ({ form, setForm, tokenSelected }) => (
//   <BatchReceipt form={form} setForm={setForm} tokenSelected={tokenSelected} />
// );

function CreateBatch() {
  const navigate = useNavigate();
  const baseUrl = "/create-batch";
  const { selectedNetworkId } = useWallet();
  const { tokens } = useToken(selectedNetworkId);

  const getDefaultToken = (selectedNetworkId) => {
    return selectedNetworkId === 137 || selectedNetworkId === 80001
      ? "USDC"
      : "cUSD";
  };

  const [tokenSelected, setTokenSelected] = useState(
    getDefaultToken(selectedNetworkId)
  );

  useEffect(() => {
    setTokenSelected(getDefaultToken(selectedNetworkId));
  }, [selectedNetworkId]);

  const [form, setForm] = useState(INITIAL_FORM_VALUES);
  console.log("Rendering CreateBatch");
  console.log("form:", form);
  console.log("tokenSelected:", tokenSelected);
  console.log("tokens:", tokens);
  return (
    <CreateBatchForm
      form={form}
      setForm={setForm}
      setTokenSelected={setTokenSelected}
      tokenSelected={tokenSelected}
      tokens={tokens}
    />

    //     <CreateBatchReceipt
    //       form={form}
    //       setForm={setForm}
    //       tokenSelected={tokenSelected}
    //     />
  );
}

export default React.memo(CreateBatch);
