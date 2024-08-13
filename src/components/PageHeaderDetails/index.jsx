/* eslint-disable react/prop-types */

import React from "react";
import { Typography, Flex } from "antd";

import styles from "./styles.module.scss";
import HeaderMainRound from "../HeaderMainRound";

const { Title } = Typography;

function PageHeaderDetails({
  title,
  action,
  turn,
  groupSize,
  showDetails,
  realTurn,
}) {
  return (
    <div className={styles.PageHeaderDetails}>
      <Flex vertical>
        <span>Ronda</span>
        <Title level={4} className={styles.dashboardTitle}>
          {title}
        </Title>
      </Flex>
      {showDetails && (
        <>
          <div className={styles.verticalLine} />
          <HeaderMainRound
            turn={turn}
            realTurn={realTurn}
            groupSize={groupSize}
          />
        </>
      )}
      {action}
    </div>
  );
}


export default PageHeaderDetails;
