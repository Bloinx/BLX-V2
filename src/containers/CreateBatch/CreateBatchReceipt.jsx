/* eslint-disable react/prop-types */
import React from "react";
import BatchReceipt from "./Receipt";

export default function CreateBatchReceipt({ form, setForm, tokenSelected }) {
  return (
    <BatchReceipt form={form} setForm={setForm} tokenSelected={tokenSelected} />
  );
}
