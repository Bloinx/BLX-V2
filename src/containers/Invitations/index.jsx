/* eslint-disable no-unused-vars */
import React from "react";
import { useSearchParams } from "react-router-dom";

import Form from "./Form";
// import Receipt from "./Receipt";
// import { getUrlParams } from "../../utils/browser";
// import { MainContext } from "../../providers/provider";
import { useWallet } from "../../context/WalletContext";

function RegisterUser() {
  // const history = useNavigate();
  // const baseUrl = "/invitations";
  const [searchParams] = useSearchParams();
  const roundId = searchParams.get("roundId");
  // const { wallet, currentProvider } = useContext(MainContext);
  const { selectedNetworkId } = useWallet();

  return (
    // <Routes>
    //   <Route
    //     path={baseUrl}
    //     component={() => (

    //     )}
    //   />
    //   <Route path={`${baseUrl}/success`} component={() => <Receipt />} />
    // </Routes>
    <Form
      roundId={roundId}
      // wallet={wallet}
      currentProvider={selectedNetworkId}
      // walletAddress={walletAddress}
    />
  );
}

export default RegisterUser;
