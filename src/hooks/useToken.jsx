import { useState, useEffect } from "react";
import { getTokenSymbol } from "../actions/utils";

export default function useToken(networkId) {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    if (typeof networkId === "number") {
      const getTokenSymbolData = async (network) => {
        const data = await getTokenSymbol(network);
        if (data) {
          setTokens(data.map((item) => item.symbol));
        }
      };
      getTokenSymbolData(networkId);
    }
  }, [networkId]);

  return { tokens };
}
