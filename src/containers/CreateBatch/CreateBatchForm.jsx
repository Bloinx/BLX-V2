/* eslint-disable react/prop-types */
import React from "react";
import BatchForm from "./Form";

function CreateBatchForm({
  form,
  setForm,
  setTokenSelected,
  tokenSelected,
  tokens,
}) {
  return (
    <BatchForm
      form={form}
      setForm={setForm}
      setTokenSelected={setTokenSelected}
      tokenSelected={tokenSelected}
      tokens={tokens}
    />
  );
}

export default CreateBatchForm;
