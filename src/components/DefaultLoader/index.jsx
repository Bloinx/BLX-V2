import React from "react";
import { CubeSpinner } from "react-spinners-kit";

const DefaultLoader = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#121212",
    }}
  >
    <CubeSpinner loading frontColor="#F58F98" size={30} />
  </div>
);

export default React.memo(DefaultLoader);
