import React, { useState } from "react";
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
import { useWallet } from "../../context/WalletContext";
import { useFormContext } from "../../context/FormCreateRoundContext";
import { useAuth } from "../../context/AuthContext";

function Receipt() {
  const { form, setForm, tokenSelected } = useFormContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { selectedNetworkId, accountData } = useWallet();
  const { session } = useAuth();

  const refreshRounds = () => {
    navigate("/dashboard");
  };

  const handlerOnSubmit = async (values) => {
    setForm({
      ...form,
      ...values,
      isComplete: true,
    });

    if (!accountData.originalAddress) {
      Modal.warning({
        title: "Wallet no encontrada",
        content: "Por favor conecta tu wallet antes de continuar.",
      });
      setForm({
        ...form,
        isComplete: false,
      });
      return;
    }

    setLoading(true);

    try {
      await APISetCreateRound({
        warranty: form?.amount,
        saving: form?.amount,
        groupSize: form?.participants,
        payTime: paymentTime[form?.periodicity],
        tokenSelected,
        isPublic: false,
        currentAddress: accountData.originalAddress,
        currentProvider: selectedNetworkId,
        session,
      });

      setLoading(false);
      setForm(INITIAL_FORM_VALUES);
      Modal.success({
        title: "Ronda creada con éxito",
        content:
          "Para continuar, paga el depósito de garantía e invita a las personas que quieras!",
        onOk: refreshRounds,
        okCancel: refreshRounds,
      });
    } catch (err) {
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
    }
  };

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
              <div>{form?.participants}</div>
            </div>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.labels.amount" />
              </div>
              <div>{`${form?.amount} ${tokenSelected}`}</div>
            </div>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.labels.receiptAmount" />
              </div>
              <div>{`${form?.amount * (form?.participants - 1)} ${tokenSelected}`}</div>
            </div>
            <div className={styles.ReceiptCardItem}>
              <div>
                <FormattedMessage id="createRound.labels.roundTime" />
              </div>
              <div>
                {
                  periodicityOptions.find(
                    (option) => option.value === form?.periodicity
                  )?.label
                }
              </div>
            </div>
          </div>

          <ButtonOnlyOneStep
            loading={loading}
            label={<FormattedMessage id="createRound.actions.payGuarantee" />}
            type="submit"
            onClick={() => handlerOnSubmit({})}
            disabled={loading}
          />
        </>
      )}
    </>
  );
}

export default Receipt;
