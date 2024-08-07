/* eslint-disable react/prop-types */
import React from "react";
import styles from "./CardDashboard.module.scss";
import HeaderMainRound from "../../components/HeaderMainRound";

export default function ProgressFormat({ turn, groupSize, realTurn }) {
  return (
    <div className={styles.progressInfoContainer}>
      <HeaderMainRound turn={turn} realTurn={realTurn} groupSize={groupSize} />
    </div>
  );
}
