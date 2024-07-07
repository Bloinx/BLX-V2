import React from "react";
import { CubeSpinner } from "react-spinners-kit";
import { FormattedMessage } from "react-intl";

import styles from "./index.module.scss";

const Loader = ({ loadingMessage = "infoLoader.defaultLoadingMessage" }) => (
  <div className={styles.Loader}>
    <CubeSpinner loading frontColor="#F58F98" size={30} />
    <p>
      {" "}
      <FormattedMessage id={loadingMessage} />
    </p>
  </div>
);

export default React.memo(Loader);
