/* eslint-disable react/prop-types */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Receipt({ handleGetRounds, currentProvider, wallet, currentAddress }) {
  const history = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleGetRounds(currentAddress, currentProvider, wallet);

        history.push("/dashboard");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <div style={{ color: "white" }}>Registro con éxito</div>;
}

export default Receipt;
