import { Modal } from "antd";
import APISetAddPayment from "./setAddPaymentSupabase";

const handlePayRound = ({
  remainingAmount,
  setLoading,
  walletAddress,
  currentProvider,
  intl,
  contract,
  saveAmount,
  sgMethods,
  roundId,
  navigate,
}) => {
  if (remainingAmount > 0) {
    setLoading(true);
    APISetAddPayment({
      walletAddress,
      currentProvider,
      contract,
      saveAmount,
      sgMethods,
    })
      .then(() => {
        Modal.success({
          title: `${intl?.formatMessage({
            id: "dashboardPage.functions.handlePayRound.APISetAddPayment.success.title",
          })}`,
          content: "...",
        });
        setLoading(false);
        navigate(`/round-details?roundId=${roundId}`);
      })
      .catch((err) => {
        if (err.code === 4001) {
          Modal.error({
            title: `${intl?.formatMessage({
              id: "dashboardPage.functions.handlePayRound.APISetAddPayment.error.reject",
            })}`,
            content: "...",
          });
        } else {
          Modal.error({
            title: `${intl?.formatMessage({
              id: "dashboardPage.functions.handlePayRound.APISetAddPayment.error.title",
            })}`,
            content: "...",
          });
        }
        setLoading(false);
      });
  } else {
    Modal.success({
      content: `${intl?.formatMessage({
        id: "dashboardPage.functions.handlePayRound.APIGetFuturePayments.success.content",
      })}`,
    });
    setLoading(false);
    navigate(`/round-details?roundId=${roundId}`);
  }
};

export default handlePayRound;
