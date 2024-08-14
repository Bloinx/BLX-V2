/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Modal, Button, Flex } from "antd";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import RoundCard from "./RoundCard";
import RoundCardNew from "./RoundCardNew";
import PageHeader from "../../components/PageHeader";
import PageSubHeader from "../../components/PageSubHeader";
import styles from "./Dashboard.module.scss";
import setStartRound from "../../actions/setStartRoundSupabase";
import Placeholder from "../../components/Placeholder";
import NotFoundPlaceholder from "../../components/NotFoundPlaceholder";
import { useRounds } from "../../context/RoundsContext";
import { useWallet } from "../../context/WalletContext";
import { CardDashboard } from "./CardDashboard";
import Loader from "../../components/Loader";

function Dashboard() {
  const navigate = useNavigate();
  const {
    otherList,
    handleGetRounds,
    completeRoundList,
    activeRounds,
    loadingRounds,
    setLoadingRounds,
  } = useRounds();
  const [loading, setLoading] = useState(false);
  const { accountData, selectedNetworkId } = useWallet();
  const intl = useIntl();

  const goToCreate = () => {
    navigate("/create-round");
  };

  const goToJoin = (roundKey) => {
    navigate(`/register-user?roundId=${roundKey}`);
  };

  const handleStartRound = (roundData) => {
    setLoading(true);
    setStartRound(accountData.originalAddress, roundData, selectedNetworkId)
      .then((receipt) => {
        Modal.success({
          title: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.success.title",
          })}`,
          content: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.success.content",
          })}`,
        });
        setLoading(false);
        handleGetRounds(accountData.originalAddress, selectedNetworkId).then(
          () => {
            setLoadingRounds(false);
          }
        );
      })
      .catch((err) => {
        Modal.warning({
          title: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.error.title",
          })}`,
          content: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.error.content",
          })}`,
        });
        setLoading(false);
      });
  };

  const handleButton = (roundData) => {
    const { stage, isAdmin, missingPositions, withdraw, turn } = roundData;
    if (stage === "ON_REGISTER_STAGE" && isAdmin) {
      return {
        disable: missingPositions > 0,
        text: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_REGISTER_STAGE_ADMIN.text",
        })}`,
        action: () => handleStartRound(roundData.roundKey, roundData),
        withdrawText: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_REGISTER_STAGE_ADMIN.withdrawText",
        })}`,
        withdrawAction: null,
      };
    }
    if (stage === "ON_REGISTER_STAGE" && !isAdmin) {
      return {
        disable: true,
        text: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_REGISTER_STAGE.text",
        })}`,
        action: () => {},
        withdrawText: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_REGISTER_STAGE.withdrawText",
        })}`,
        withdrawAction: null,
      };
    }
    // if (stage === "ON_ROUND_ACTIVE") {
    //   const payDisable = roundData.realTurn > roundData.groupSize;

    //   return {
    //     disable: payDisable,
    //     text: paymentStatusText[roundData.paymentStatus],
    //     action: () => handlePayRound(roundData.roundKey),
    //     withdrawText:
    //       roundData.realTurn >= roundData.groupSize && payDisable
    //         ? `${intl.formatMessage({
    //             id: "dashboardPage.functions.handleButton.ON_ROUND_ACTIVE.withdrawText",
    //           })}`
    //         : `${intl.formatMessage({
    //             id: "dashboardPage.functions.handleButton.ON_ROUND_ACTIVE.withdrawTextElse",
    //           })}`,
    //     withdrawAction: () =>
    //       handleWithdrawRound(
    //         roundData.roundKey,
    //         roundData.realTurn,
    //         roundData.groupSize
    //       ),
    //   };
    // }
    if (stage === "ON_ROUND_FINISHED") {
      return {
        disable: true,
        text: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_ROUND_FINISHED.text",
        })}`,
        action: () => {},
        withdrawText: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_ROUND_FINISHED.withdrawText",
        })}`,
        withdrawAction: () => {},
      };
    }
    if (stage === "ON_EMERGENCY_STAGE") {
      return {
        disable: true,
        text: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_EMERGENCY_STAGE.text",
        })}`,
        action: () => {},
        withdrawText: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_EMERGENCY_STAGE.withdrawText",
        })}`,
        withdrawAction: () => {},
      };
    }
    return {};
  };

  const contentDashboard = () => {
    // if (loadingRounds) {
    //   return (
    //     <Flex align="center" justify="center" style={{ height: "400px" }}>
    //       <Loader loadingMessage="infoLoader.dashboard" />
    //     </Flex>
    //   );
    // }
    if (!completeRoundList?.length && !activeRounds?.length) {
      return (
        <Flex align="center" justify="center" style={{ height: "400px" }}>
          <Loader loadingMessage="infoLoader.dashboard" />
        </Flex>
      );
    }

    if (completeRoundList?.length === 0 && activeRounds?.length === 0) {
      return <NotFoundPlaceholder />;
    }

    return (
      <>
        {accountData.originalAddress && (
          <>
            {completeRoundList?.length > 0 &&
              completeRoundList?.map((round) => {
                const { disable, text, action, withdrawText, withdrawAction } =
                  handleButton(round);

                return round.stage === "ON_REGISTER_STAGE" &&
                  round.toRegister ? (
                  <RoundCardNew
                    key={round.roundKey}
                    fromInvitation={round.fromInvitation}
                    fromEmail={round.fromEmail}
                    contract={round.contract}
                    onClick={() => goToJoin(round.roundKey)}
                  />
                ) : (
                  <RoundCard
                    key={round.roundKey}
                    name={round.name}
                    groupSize={round.groupSize}
                    missingPositions={round.missingPositions}
                    contractKey={round.contract}
                    positionToWithdrawPay={round.positionToWithdrawPay}
                    turn={round.turn}
                    linkTo={`/round-details?roundId=${round.roundKey}`}
                    onClick={action}
                    buttonText={text}
                    withdrawButtonText={withdrawText}
                    buttonDisabled={disable}
                    loading={loading}
                    withdraw={round.withdraw}
                    onWithdraw={withdrawAction}
                    stage={round.stage}
                    saveAmount={round.saveAmount}
                    tokenId={round.tokenId}
                    byInvitation={false}
                  />
                );
              })}
            {activeRounds?.length > 0 &&
              activeRounds.map((round) => (
                <CardDashboard
                  key={round.roundKey}
                  contractKey={round.contract}
                  turn={round.turn}
                  groupSize={round.groupSize}
                  name={round.name}
                  positionToWithdrawPay={round.positionToWithdrawPay}
                  linkTo={`/round-details?roundId=${round.roundKey}`}
                  realTurn={round.realTurn}
                />
              ))}
          </>
        )}
      </>
    );
  };

  if (accountData.originalAddress === null || selectedNetworkId === null) {
    return <Placeholder />;
  }

  return (
    <>
      <PageHeader
        title={<FormattedMessage id="dashboardPage.title" />}
        action={
          <Button
            className={styles.RoundCardAction}
            onClick={goToCreate}
            type="primary"
          >
            Crear Ronda
          </Button>
        }
      />
      <div className={styles.RoundCards}>{contentDashboard()}</div>
    </>
  );
}

export default Dashboard;
