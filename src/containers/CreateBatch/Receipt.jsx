import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Modal } from "antd";

import PageHeader from "../../components/PageHeader";
import ButtonOnlyOneStep from "../../components/ButtonOnlyOneStep";
import Loader from "../../components/Loader";

import APISetCreateRound from "../../actions/setCreateRoundSupabase";

import styles from "./Receipt.module.scss";
import {
  INITIAL_FORM_VALUES,
  periodicityOptions,
  paymentTime,
} from "./constants";
// import { MainContext } from "../../providers/provider";
import { useWallet } from "../../context/WalletContext";
// import { useRoundContext } from "../../contexts/RoundsContext";

function Receipt({ form, setForm, tokenSelected }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { handleGetRounds } = useRoundContext();
  // const { address, wallet, selectedNetworkId } = useContext(MainContext);
  const { selectedNetworkId, address } = useWallet();

  const refreshRounds = () => {
    // handleGetRounds(address, selectedNetworkId, wallet);
    navigate("/dashboard");
  };
  const handlerOnSubmit = (values) =>
    setForm({
      ...form,
      ...values,
      isComplete: true,
    });

  useEffect(() => {
    let cancel = false;
    if (form.isComplete && !address) {
      Modal.warning({
        title: "Wallet no encontrada",
        content: "Por favor conecta tu wallet antes de continuar.",
      });
      setForm({
        ...form,
        isComplete: false,
      });
    }
    if (form.isComplete && address && !cancel) {
      setLoading(true);
      APISetCreateRound({
        warranty: form.amount,
        saving: form.amount,
        groupSize: form.participants,
        payTime: paymentTime[form.periodicity],
        tokenSelected,
        isPublic: false,
        address,
        wallet,
        selectedNetworkId,
      })
        .then(() => {
          setLoading(false);
          setForm(INITIAL_FORM_VALUES);
          Modal.success({
            title: "Ronda creada con éxito",
            content:
              "Para continuar, paga el depósito de garantía e invita a las personas que quieras!",
            onOk: refreshRounds,
            okCancel: refreshRounds,
          });
        })
        .catch((err) => {
          setForm({
            ...form,
            isComplete: false,
          });
          setLoading(false);
          Modal.error({
            title: "Oops!",
            content:
              "¿Ya no quieres crear la ronda? Ocurrió un problema al crear la ronda.",
            onOk: refreshRounds,
            okCancel: refreshRounds,
          });
        });
    }
    return () => {
      cancel = true;
    };
  }, [
    form.isComplete,
    address,
    wallet,
    form,
    setForm,
    history,
    selectedNetworkId,
    refreshRounds,
    tokenSelected,
  ]);

  return (
    <>
      <PageHeader title={<FormattedMessage id="createRound.title" />} />
      {loading && <Loader loadingMessage="infoLabels.waiting" />}
      {!loading && (
        <>
          <div className={styles.ReceiptCard}>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.form.label.participants" />
              </div>
              <div>{form.participants}</div>
            </div>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.labels.amount" />
              </div>
              <div>{`${form.amount} ${tokenSelected}`}</div>
            </div>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.labels.receiptAmount" />
              </div>
              <div>{`${
                form.amount * (form.participants - 1)
              } ${tokenSelected}`}</div>
            </div>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.labels.roundTime" />
              </div>
              <div>
                {
                  periodicityOptions.find(
                    (option) => option.value === form.periodicity
                  ).label
                }
              </div>
            </div>
          </div>

          <ButtonOnlyOneStep
            loading={loading}
            label={<FormattedMessage id="createRound.actions.payGuarantee" />}
            // disabled={!values.termsAndConditions || !isValid}
            type="submit"
            onClick={handlerOnSubmit}
          />
        </>
      )}
    </>
  );
}

export default Receipt;
