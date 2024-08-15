import React, { createContext, useContext, useState, useEffect } from "react";
import { useWallet } from "./WalletContext";
import { INITIAL_FORM_VALUES } from "../containers/CreateBatch/constants";
const FormContext = createContext();
import useToken from "../hooks/useToken";

export const useFormContext = () => {
  return useContext(FormContext);
};

export const FormProvider = ({ children }) => {
  const [form, setForm] = useState(INITIAL_FORM_VALUES);
  const { selectedNetworkId } = useWallet();
  const { tokens } = useToken(selectedNetworkId);

  const getDefaultToken = (selectedNetworkId) => {
    return selectedNetworkId === 137 || selectedNetworkId === 80002
      ? "USDC"
      : "cUSD";
  };

  const [tokenSelected, setTokenSelected] = useState(
    getDefaultToken(selectedNetworkId)
  );

  useEffect(() => {
    setTokenSelected(getDefaultToken(selectedNetworkId));
  }, [selectedNetworkId]);

  return (
    <FormContext.Provider
      value={{ form, setForm, tokenSelected, setTokenSelected, tokens }}
    >
      {children}
    </FormContext.Provider>
  );
};
