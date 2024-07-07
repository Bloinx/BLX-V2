/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { RightOutlined } from "@ant-design/icons";
import { CubeSpinner } from "react-spinners-kit";
import { FormattedMessage } from "react-intl";

import styles from "./RoundCard.module.scss";
import Stepper from "../../components/Stepper";
import { formatAddress } from "../../utils/format";
import logoIcon from "../../assets/icon.png";
// import { getTokenSymbolByRound } from "../../api/utils/getTokenData";
import { ButtonAction, LinkStyled } from "../../components/styles";

export function RoundCard({
  name,
  contractKey,
  groupSize,
  missingPositions,
  turn,
  linkTo,
  onClick,
  buttonText,
  positionToWithdrawPay,
  loading,
  buttonDisabled,
  withdraw,
  onWithdraw,
  stage,
  saveAmount,
  tokenId,
  byInvitation,
}) {
  const [tokenSymbol, setTokenSymbol] = useState("");

  // useEffect(() => {
  //   const getTokenSymbol = async () => {
  //     const data = await getTokenSymbolByRound(tokenId);
  //     return data;
  //   };

  //   getTokenSymbol().then((data) => {
  //     setTokenSymbol(data);
  //   });
  // }, [tokenId]);

  const handleGetSteps = () => {
    const numGroup = Number(groupSize);
    const indents = [];
    for (let i = 1; i <= numGroup; i += 1) {
      indents.push({ label: i });
    }
    return indents;
  };
  const arePending = missingPositions > 0;

  return (
    <div className={styles.RoundCard}>
      <div className={styles.RoundCardHeader}>
        <div className={styles.RoundCardHeaderImage}>
          <img src={logoIcon} alt="logo" />
        </div>
        <div>
          <LinkStyled to={linkTo} className={styles.RoundCardTitle}>
            <div className={styles.RoundCardTitleTitle}>{name}</div>
            <div className={styles.RoundCardTitleIcon}>
              <RightOutlined />
            </div>
          </LinkStyled>
          <div className={styles.RoundCardSubject}>
            <FormattedMessage id="roundCardInfo.roundAddr" />
            {formatAddress(contractKey)}
          </div>
          {arePending && (
            <div className={styles.RoundCardSubject}>
              Podran iniciarla cuando todos los participantes se hayan unido
            </div>
          )}
        </div>
      </div>
      <div className={styles.RoundCardSeparation}>
        <Stepper
          current={turn}
          steps={handleGetSteps()}
          turnWithDraw={positionToWithdrawPay}
        />
      </div>
      {arePending && !byInvitation && (
        <p>
          Necesitas invitar a {missingPositions} amigos para para poder inciar
          la ronda
        </p>
      )}
      <div className={styles.RoundCardFooter}>
        <div className={styles.RoundCardTitleFooter}>
          {arePending &&
            `${groupSize - missingPositions} de ${groupSize} unidos`}
          {!arePending &&
            missingPositions === 0 &&
            stage === "ON_REGISTER_STAGE" &&
            "Esperando iniciar..."}
          {!arePending && stage === "ON_ROUND_ACTIVE" && `Turno ${turn}`}
          {!arePending && stage === "ON_ROUND_FINISHED" && "Ronda terminada"}
          {!arePending && stage === "ON_EMERGENCY_STAGE" && "Ronda sin fondos"}
          <div style={{ display: "block" }}>
            {!arePending &&
              stage === "ON_ROUND_ACTIVE" &&
              `$ ${saveAmount} ${tokenSymbol} a pagar`}
          </div>
        </div>
        <div>
          {loading && (
            <div className={styles.RoundCardLoader}>
              <CubeSpinner frontColor="#F58F98" size={20} />
              <span>Espere...</span>
            </div>
          )}
          {!loading && (
            <>
              <ButtonAction
                ghost={buttonText !== "Pagar"}
                type="primary"
                disabled={buttonDisabled}
                onClick={onClick}
              >
                {buttonText}
              </ButtonAction>
              {!arePending && (
                <ButtonAction
                  type="primary"
                  disabled={!withdraw}
                  onClick={onWithdraw}
                >
                  Cobrar
                </ButtonAction>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(RoundCard);
