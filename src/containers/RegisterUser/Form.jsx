/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from "react";
import { Formik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Modal } from "antd";
import { INITIAL_FORM_VALUES } from "./constants";
import PageHeader from "../../components/PageHeader";
import InputTextField from "../../components/InputTextField";
import InputSelect from "../../components/InputSelect";
import InputTurnSelect from "../../components/InputTurnSelect";
import ButtonOnlyOneStep from "../../components/ButtonOnlyOneStep";
import Loader from "../../components/Loader";

import APISetRegisterUser from "../../actions/setRegisterUserSupabase";
import { supabase } from "../../supabaseClient";

import styles from "./Confirm.module.scss";
import { confirmValidation } from "./validations";
import { motivationOptions } from "./constants";
import { getOptions } from "./utils";
import {
  getTokenSymbolByRound,
  getTokenIdByRoundId,
} from "../../actions/utils";
// import { MainContext } from "../../providers/provider";
// import { getUrlParams } from "../../utils/browser";
import { useWallet } from "../../context/WalletContext";
import { useAuth } from "../../context/AuthContext";
import { useRounds } from "../../context/RoundsContext";
import APIgetRoundRegisterDetail from "../../actions/getRoundRegisterDetailSupabase";

function Form() {
  const { user } = useAuth();
  const { handleGetRounds } = useRounds();
  const [form, setForm] = useState(INITIAL_FORM_VALUES);
  const [roundData, setRoundData] = useState();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tokenSymbol, setTokenSymbol] = useState("");
  // const { currentProvider } = useContext(MainContext);
  const { accountData, selectedNetworkId } = useWallet();
  // const { roundId } = getUrlParams(history.location.search);
  const [searchParams] = useSearchParams();
  const roundId = searchParams.get("roundId");

  const intl = useIntl();
  const getTokenSymbol = async (tokenId) => {
    const data = await getTokenSymbolByRound(tokenId);
    return data;
  };

  useEffect(() => {
    APIgetRoundRegisterDetail(
      roundId,
      accountData.originalAddress,
      selectedNetworkId
    ).then((dataRound) => {
      console.log(dataRound);
      setRoundData(dataRound);
    });
  }, [roundId, selectedNetworkId]);

  useEffect(() => {
    if (roundData && Object.entries(roundData).length === 0) {
      getTokenIdByRoundId(roundId).then((data) => {
        getTokenSymbol(data).then((dataToken) => {
          setTokenSymbol(dataToken);
        });
      });
    } else {
      getTokenSymbol(roundData?.tokenId).then((dataToken) => {
        setTokenSymbol(dataToken);
      });
    }
  }, [roundData]);

  const refreshRounds = () => {
    handleGetRounds(accountData.originalAddress, selectedNetworkId);
    navigate("/dashboard");
  };

  const handlerOnSubmit = (values) => {
    if (!accountData.originalAddress) {
      Modal.warning({
        title: `${intl.formatMessage({
          id: "registerUser.functions.handlerOnSubmit.warning.title",
        })}`,
        content: `${intl.formatMessage({
          id: "registerUser.functions.handlerOnSubmit.warning.content",
        })}`,
      });
    } else {
      setLoading(true);
      APISetRegisterUser({
        userId: user.id,
        userEmail: user.email,
        walletAddress: accountData.originalAddress,
        roundId: roundData?.roundId,
        name: values.name,
        motivation: values.motivation,
        position: values.turnSelected,
        // wallet,
        currentProvider: selectedNetworkId,
        contract: roundData?.contract,
        isAdmin: roundData?.isAdmin,
      })
        .then((receipt) => {
          Modal.success({
            title: `${intl.formatMessage({
              id: "registerUser.functions.handlerOnSubmit.success.title",
            })}`,
            content: `${intl.formatMessage({
              id: "registerUser.functions.handlerOnSubmit.success.content",
            })}`,
            onOk: refreshRounds,
          });
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          Modal.error({
            title: `${intl.formatMessage({
              id: "registerUser.functions.handlerOnSubmit.error.title",
            })}`,
            content: `${intl.formatMessage({
              id: "registerUser.functions.handlerOnSubmit.error.content",
            })}`,
          });
        });
    }
  };

  return (
    <>
      <PageHeader title={<FormattedMessage id="createRound.titleConfirm" />} />
      {loading && <Loader loadingMessage="infoLabels.waiting" />}
      {!loading && (
        <Formik
          initialValues={{
            name: form.name,
            motivation: form.motivation,
            turnSelected:
              form.turnSelected ||
              (roundData?.positionsAvailable && roundData?.positionsAvailable[0]
                ? roundData?.positionsAvailable[0].position
                : 3),
          }}
          validate={confirmValidation}
          onSubmit={handlerOnSubmit}
        >
          {(props) => {
            const {
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isValid,
              isSubmitting,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <div className={styles.ConfirmCard}>
                  <InputTextField
                    label={
                      <FormattedMessage id="createRound.form.label.name" />
                    }
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={errors.name}
                  />
                </div>
                <div className={styles.ConfirmCard}>
                  <InputSelect
                    label={
                      <FormattedMessage id="createRound.form.label.motivation" />
                    }
                    name="motivation"
                    value={values.motivation}
                    onChange={handleChange}
                    options={motivationOptions}
                    error={errors.motivation}
                  />
                </div>
                <div className={styles.ConfirmCard}>
                  <InputTurnSelect
                    label={
                      <FormattedMessage id="createRound.form.label.turn" />
                    }
                    name="turnSelected"
                    value={values.turnSelected}
                    onChange={handleChange}
                    options={getOptions(roundData?.positionsAvailable)}
                    error={errors.turnSelected}
                  />
                </div>
                <div className={styles.ConfirmCard}>
                  <PageHeader
                    title={<FormattedMessage id="payments.details.title" />}
                  />
                  <div className={styles.TextPaymentDetails}>
                    <FormattedMessage id="payments.details.subtitle" />
                  </div>
                  <div className={styles.PaymentDetails}>
                    <div>
                      <div className={styles.TextPaymentDetails}>
                        <FormattedMessage id="payments.details.securityDeposit" />
                      </div>
                      <div className={styles.TextPaymentDetails}>
                        {roundData?.cashIn || "..."} {tokenSymbol}
                      </div>
                    </div>
                    <div>
                      <div className={styles.TextPaymentDetails}>
                        <FormattedMessage id="payments.details.serviceFee" />
                      </div>
                      <div className={styles.TextPaymentDetails}>
                        {roundData?.feeCost || "..."} {tokenSymbol}
                      </div>
                    </div>
                  </div>
                </div>
                <ButtonOnlyOneStep
                  label={
                    <FormattedMessage id="createRound.actions.registerMe" />
                  }
                  disabled={!values.name || !isValid}
                  type="submit"
                />
              </form>
            );
          }}
        </Formik>
      )}
    </>
  );
}

export default React.memo(Form);
