/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import CreateBatchForm from "./CreateBatchForm";
import CreateBatchReceipt from "./CreateBatchReceipt";

import { INITIAL_FORM_VALUES } from "./constants";
// import { MainContext } from "../../providers/provider";
import useToken from "../../hooks/useToken";

import { useWallet } from "../../context/WalletContext";
import { useFormContext } from "../../context/FormCreateRoundContext";

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
  const { form, setForm, tokenSelected, setTokenSelected, tokens } =
    useFormContext();

  const handleSubmit = (values) => {
    setForm({
      ...form,
      ...values,
    });
    navigate("/create-round/confirm");
  };

  return (
    <CreateBatchForm
      form={form}
      setForm={setForm}
      setTokenSelected={setTokenSelected}
      tokenSelected={tokenSelected}
      tokens={tokens}
      handleSubmit={handleSubmit}
    />

    //     <CreateBatchReceipt
    //       form={form}
    //       setForm={setForm}
    //       tokenSelected={tokenSelected}
    //     />
  );
}

export default React.memo(CreateBatch);
