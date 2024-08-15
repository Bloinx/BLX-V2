import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "antd";

import styles from "./RoundCardNew.module.scss";

export default function RoundCardNew({
  stage,
  onClick,
  fromInvitation,
  fromEmail,
}) {
  return (
    <div className={styles.RoundCardNew}>
      <p className={styles.RoundCardNewText}>
        {fromInvitation ? (
          "Ronda por invitación"
        ) : (
          <FormattedMessage id="dashboardPage.roundCaption" />
        )}
      </p>
      <p className={styles.RoundCardNewText}>
        {fromInvitation
          ? `Te han invitado a la ronda de ${fromEmail}`
          : "Personaliza tu ronda."}
      </p>
      <p className={styles.RoundCardNewText}>
        {stage === "ON_REGISTER_STAGE"
          ? "Ronda en espera de ser iniciada"
          : null}
      </p>
      <div className={styles.RoundCardNewOptions}>
        <Button type="primary" onClick={onClick}>
          <FormattedMessage id="createRound.actions.chooseTurn" />
        </Button>
      </div>
    </div>
  );
}

