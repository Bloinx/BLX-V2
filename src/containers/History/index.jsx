/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

import RoundCard from "./RoundCard";
import RoundCardNew from "./RoundCardNew";
import PageHeader from "../../components/PageHeader";
import styles from "./History.module.scss";
import APISetStartRound from "../../actions/setStartRoundSupabase";
import Placeholder from "../../components/Placeholder";
import NotFoundPlaceholder from "../../components/NotFoundPlaceholder";
import { useRounds } from "../../context/RoundsContext";
import { useWallet } from "../../context/WalletContext";
// import { useRoundContext } from "../../contexts/RoundsContext";
// import { MainContext } from "../../providers/provider";

function History() {
  const navigate = useNavigate();

  // const { handleGetRounds, historyList } = useRoundContext();
  const { handleGetRounds, historyList } = useRounds();
  const { accountData, selectedNetworkId } = useWallet();

  const [loading, setLoading] = useState(false);
  // const { currentAddress, wallet, currentProvider } = useContext(MainContext);
  const intl = useIntl();

  const goToCreate = () => {
    navigate("/create-round");
  };

  const goToJoin = (roundKey) => {
    navigate(`/register-user?roundId=${roundKey}`);
  };

  const handleStartRound = (roundId) => {
    setLoading(true);
    APISetStartRound(roundId, selectedNetworkId)
      .then(() => {
        Modal.success({
          title: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.success.title",
          })}`,
          content: `${intl.formatMessage({
            id: "dashboardPage.functions.handleStartRound.success.content",
          })}`,
        });
        setLoading(false);
        handleGetRounds(accountData.originalAddress, selectedNetworkId);
      })
      .catch(() => {
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
    const { stage, isAdmin, missingPositions } = roundData;
    if (stage === "ON_REGISTER_STAGE" && isAdmin) {
      return {
        disable: missingPositions > 0,
        text: `${intl.formatMessage({
          id: "dashboardPage.functions.handleButton.ON_REGISTER_STAGE_ADMIN.text",
        })}`,
        action: () => handleStartRound(roundData.roundKey),
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

  if (accountData === null || selectedNetworkId === null) {
    return <Placeholder />;
  }

  return (
    <>
      <PageHeader
        title={<FormattedMessage id="historyPage.title" />}
        action={
          <PlusCircleOutlined
            onClick={goToCreate}
            style={{ fontSize: "20px", color: "white" }}
          />
        }
      />
      <div className={styles.RoundCards}>
        {accountData?.originalAddress && historyList?.length === 0 && (
          <NotFoundPlaceholder />
        )}
        {accountData?.originalAddress &&
          historyList?.map((round) => {
            if (round.stage === "ON_REGISTER_STAGE" && round.toRegister) {
              return (
                <RoundCardNew
                  key={round.roundKey}
                  fromInvitation={round.fromInvitation}
                  fromEmail={round.fromEmail}
                  onClick={() => goToJoin(round.roundKey)}
                />
              );
            }
            const { disable, text, action, withdrawText, withdrawAction } =
              handleButton(round);
            return (
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
                byInvitation={false}
              />
            );
          })}
      </div>
    </>
  );
}

export default History;
