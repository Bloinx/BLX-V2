/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import { Typography, Button, Flex } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import {
  FlexPageContainer,
  StepStyle,
  FlexPaymentContainer,
  FlexCardInfoStyle,
  FlexMessageStyle,
} from "./styles";
// import { getUrlParams } from "../../utils/browser";

import Loader from "../../components/Loader";
import { getTokenSymbol } from "../../actions/utils";

import MethodGetRegisterStable from "../../actions/setRegisterUserStable";
import { getAmountToApprove } from "../../actions/getAmountToApprove";
import handlePayRound from "../../actions/payRound";

import { useRounds } from "../../context/RoundsContext";
import { useWallet } from "../../context/WalletContext";

function StepContent({
  step,
  setCurrentStep,
  data,
  tokenSymbol,
  walletAddress,
  chainId,
  intl,
  currentProvider,
  navigate,
}) {
  const [loading, setLoading] = useState(false);

  switch (step) {
    case 0:
      return !loading ? (
        <>
          <FlexMessageStyle>
            <InfoCircleOutlined style={{ color: "#C6A15B" }} />
            <Typography.Text>
              Antes de pagar en el turno, deberás aprobar el gasto
            </Typography.Text>
          </FlexMessageStyle>
          <FlexCardInfoStyle vertical>
            <div>
              <Typography.Title level={5}>Aprobación de gasto</Typography.Title>
              <Flex gap={10} style={{ flexDirection: "row" }}>
                <Typography.Text>Monto aprobado:</Typography.Text>
                <Typography.Text>
                  {data?.allowance} {tokenSymbol[0]?.symbol}
                </Typography.Text>
              </Flex>
              <Flex gap={10} style={{ flexDirection: "row" }}>
                <Typography.Text>Monto mínimo a aprobar:</Typography.Text>
                <Typography.Text>
                  {data?.saveAmount}
                  {tokenSymbol[0]?.symbol}
                </Typography.Text>
              </Flex>
              <Flex gap={10} style={{ flexDirection: "row" }}>
                <Typography.Text>
                  Monto que debe aprobar (recomendado):
                </Typography.Text>
                <Typography.Text>
                  {getAmountToApprove(
                    Number(data?.saveAmount),
                    Number(data?.groupSize),
                    Number(data?.turn)
                  )}
                  {tokenSymbol[0]?.symbol}
                </Typography.Text>
              </Flex>
            </div>
          </FlexCardInfoStyle>
          <Button
            type="primary"
            onClick={() => {
              setLoading(true);
              MethodGetRegisterStable({
                walletAddress,
                roundId: data?.roundKey,
                chainId,
                dataApprove: {
                  amount: Number(data?.saveAmount),
                  groupSize: Number(data?.groupSize),
                  turn: Number(data?.turn),
                },
              })
                .then(() => {
                  setCurrentStep(1);
                })
                .finally(() => {
                  setLoading(false);
                })
                .catch((e) => {
                  console.log(e);
                });
            }}
          >
            Aprobar
          </Button>
        </>
      ) : (
        <Flex align="center" justify="center" style={{ height: "400px" }}>
          <Loader loadingMessage="infoLoader.approve" />
        </Flex>
      );
    case 1:
      return !loading ? (
        <>
          {" "}
          <FlexCardInfoStyle vertical>
            <Typography.Title level={5}>Monto a pagar:</Typography.Title>
            <Typography.Text>
              {data.saveAmount} {tokenSymbol[0]?.symbol}
            </Typography.Text>
          </FlexCardInfoStyle>
          <Button
            type="primary"
            onClick={() =>
              handlePayRound({
                remainingAmount: data.futurePayments,
                setLoading,
                walletAddress,
                currentProvider,
                intl,
                contract: data.contract,
                saveAmount: data.saveAmount,
                sgMethods: data.sgMethods,
                roundId: data.roundKey,
                navigate,
              })
            }
          >
            Pagar
          </Button>
        </>
      ) : (
        <Flex align="center" justify="center" style={{ height: "400px" }}>
          <Loader loadingMessage="infoLoader.payment" />
        </Flex>
      );
    default:
      return <p>Volver a cargar</p>;
  }
}

function Payment() {
  //history
  const navigate = useNavigate();
  const baseUrl = "/payment";
  // const { roundId } = getUrlParams(history.location.search);
  const [currentStep, setCurrentStep] = React.useState(null);
  const [roundDataById, setRoundDataById] = useState(null);

  const [tokenSymbol, setTokenSymbol] = useState(null);

  const { activeRounds } = useRounds();
  const { accountData, selectedNetworkId } = useWallet();
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const roundId = searchParams.get("roundId");

  const getAllowanceSymbol = async (tokenId) => {
    // Call the asynchronous function getTokenSymbol with the provided tokenId
    const symbol = await getTokenSymbol(tokenId);
    return symbol || null;
  };

  useEffect(() => {
    if (!roundId || !activeRounds) return;
    activeRounds.forEach((round) => {
      if (round.roundKey === roundId) {
        setRoundDataById(round);
      }
    });
  }, [activeRounds, roundId]);

  useEffect(() => {
    if (!roundDataById) return;

    const allowance = parseInt(roundDataById.allowance, 10);
    const saveAmount = Number(roundDataById.saveAmount);
    if (allowance < saveAmount) {
      setCurrentStep(0);
    } else {
      setCurrentStep(1);
    }

    getAllowanceSymbol(roundDataById.tokenId)
      .then((symbol) => {
        setTokenSymbol(symbol);
      })
      .catch((error) => {
        console.error("Error in useEffect:", error);
      });
  }, [roundDataById]);

  if (roundDataById === null || tokenSymbol === null) {
    return <Loader loadingMessage="infoLoader.page" />;
  }
  return (
    <FlexPageContainer>
      <Typography.Title level={4}>Pagar en turno</Typography.Title>
      <FlexPaymentContainer>
        <StepStyle
          current={currentStep}
          direction="horizontal"
          items={[
            {
              title: "Aprobar gasto",
            },
            {
              title: "Pagar",
            },
          ]}
        />
        <StepContent
          step={currentStep}
          setCurrentStep={setCurrentStep}
          data={roundDataById}
          tokenSymbol={tokenSymbol}
          walletAddress={accountData.originalAddress}
          // wallet={wallet}
          chainId={selectedNetworkId}
          intl={intl}
          currentProvider={selectedNetworkId}
          navigate={navigate}
        />
      </FlexPaymentContainer>
    </FlexPageContainer>
  );
}

export default Payment;
