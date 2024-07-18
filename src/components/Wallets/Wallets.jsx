import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Button, Spin, } from "antd";
import NETWORKS from "../../constants/networks";
// import { useWallet } from "../../hooks/useWallet";
// import { MainContext } from "../../providers/provider";

//por mientras comentado para refactorizar -->
// import config, { walletConnect } from "../../actions/config.main.web3";
import config from "../../actions/config.main.web3";

import styles from "./styles.module.scss";
import { useWallet } from "../../context/WalletContext";


function Wallets() {

  const {
    accountData,
    setAccountData,
    isOpen,
    selectedNetworkId,
    address,
    open,
    disconnect
  } = useWallet();

  const [loading, setLoading] = useState(false);

  const intl = useIntl();




  const handleOpen=()=>{
    open();
  }

  return (
    <div>
      {accountData.publicAddress &&
        accountData.publicAddress.startsWith("0X") &&
        !loading && (
          <Button
            type="primary"
            shape="round"
            onClick={handleOpen}
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src={NETWORKS[String(selectedNetworkId)]?.icon}
              alt="bloinx-icon"
              width="20"
            />
            &nbsp;&nbsp;{accountData.publicAddress}
          </Button>
        )}

      {!accountData.publicAddress && (
        <Button type="primary" shape="round" onClick={handleOpen}>
          {`${intl.formatMessage({
            id: "wallets.actions.connect",
          })}`}
        </Button>
      )}

      {loading && <Spin size="medium" />}

    </div>
  );
}

export default Wallets;
