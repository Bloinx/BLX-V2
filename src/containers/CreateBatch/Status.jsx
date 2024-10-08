import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";

import styles from "./Status.module.scss";

function Status() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  }, []);

  return (
    <div className={styles.Status}>
      <SmileOutlined
        style={{
          color: "#F58F98",
          fontSize: 60,
        }}
      />
      <FrownOutlined
        style={{
          color: "#F58F98",
          fontSize: 60,
        }}
      />
      <p>
        <FormattedMessage id="createRound.titleReceipt" />
      </p>
    </div>
  );
}

export default Status;
