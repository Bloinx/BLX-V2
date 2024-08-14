import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Receipt() {
  const history = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      history.push("/dashboard");
    }, 3000);
  }, []);

  return <div>Ok</div>;
}

export default Receipt;
