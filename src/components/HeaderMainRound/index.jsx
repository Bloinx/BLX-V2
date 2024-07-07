import React from "react";
import { FormattedMessage } from "react-intl";
import styles from "./styles.module.scss";
import getTurnHeader from "../../utils/common";

function HeaderMainRound({ turn, groupSize, realTurn }) {
  return (
    <div className={styles.progressInfoContainer}>
      <span>
        {" "}
        <FormattedMessage id="roundCardInfo.turn" />
      </span>
      <div className={styles.progressMainInfo}>
        <p style={{ alignContent: "flex-end" }}>
          {Number(
            getTurnHeader(Number(turn), Number(realTurn), Number(groupSize))
          )}
        </p>
        <p>/{Number.isNaN(groupSize) ? 0 : groupSize}</p>
      </div>
    </div>
  );
}

export default HeaderMainRound;
