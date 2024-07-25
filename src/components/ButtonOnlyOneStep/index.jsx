import React from "react";
import { FormattedMessage } from "react-intl";

import styles from "./styles.module.scss";
import { ButtonAction } from "../styles";

function ButtonOnlyOneStep({ type, onClick, disabled, label, loading }) {
  return (
    <div className={styles.ButtonOnlyOneStep}>
      <ButtonAction
        loading={loading}
        htmlType={type}
        type="primary"
        size="large"
        onClick={onClick}
        disabled={disabled}
      >
        {label || <FormattedMessage id="commons.buttons.continue" />}
      </ButtonAction>
    </div>
  );
}
export default ButtonOnlyOneStep;
