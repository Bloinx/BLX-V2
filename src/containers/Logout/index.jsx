import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import styles from "./index.module.scss";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  });

  return (
    <div className={styles.Logout}>
      <FormattedMessage id="logout.text" />
    </div>
  );
};

export default Logout;
