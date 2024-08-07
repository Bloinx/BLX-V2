/* eslint-disable no-unused-vars */
import React from "react";
import { Button, Typography, Progress } from "antd";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import styles from "./CardDashboard.module.scss";
import { formatAddress } from "../../utils/format";
import HeaderMainRound from "../../components/HeaderMainRound";
// import getTurnHeader from "../RoundDetails/utils";
import ContractHeader from "./ContractHeader";
import ProgressFormat from "./ProgressFormat";

export function CardDashboard({
  name,
  contractKey,
  groupSize,
  turn,
  linkTo,
  saveAmount,
  positionToWithdrawPay,
  realTurn,
}) {
  const getPercentage = () => {
    const percentage = (turn / groupSize) * 100;
    return percentage;
  };
  const renderProgressFormat = () => (
    <ProgressFormat turn={turn} realTurn={realTurn} groupSize={groupSize} />
  );

  return (
    <div className={styles.RoundCard}>
      <div className={styles.RoundCardHeader}>
        <div className={styles.RoundCardSubject}>
          <span>
            <FormattedMessage id="roundCardInfo.roundAddr" />
          </span>
          <Typography.Title level={4}>{name}</Typography.Title>
        </div>
        <ContractHeader contractKey={contractKey} />
      </div>
      <div className={styles.RoundCardStats}>
        <Progress
          className={styles.progress}
          type="circle"
          percent={getPercentage()}
          strokeColor="#f58f98"
          format={renderProgressFormat}
        />
        <div>
          <span>
            <FormattedMessage id="roundCardInfo.myTurn" />
          </span>
          <Typography.Title level={1}>{positionToWithdrawPay}</Typography.Title>
        </div>
      </div>
      <div className={styles.RoundCardFooter}>
        <div style={{ width: "100%" }}>
          <Link to={linkTo}>
            <Button className={styles.RoundCardAction} type="primary">
              Ver más
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CardDashboard);
