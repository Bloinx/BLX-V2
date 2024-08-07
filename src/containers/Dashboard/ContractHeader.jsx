import React from "react";
import { Typography } from "antd";
import { FormattedMessage } from "react-intl";
import styles from "./CardDashboard.module.scss";
import { formatAddress } from "../../utils/format";

export default function ContractHeader({ contractKey }) {
  return (
    <div className={styles.RoundCardContractAddress}>
      <Typography.Text>
        <FormattedMessage id="roundDetails.contractID" />
      </Typography.Text>
      <span> {formatAddress(contractKey)}</span>
    </div>
  );
}
