import React from "react";
import { Typography } from "antd";

import styles from "./styles.module.scss";

const { Title } = Typography;

const PageSubHeader = ({ title, action }) => {
  return (
    <div className={styles.PageSubHeader}>
      <Title level={5} className={styles.dashboardTitle}>
        {title}
      </Title>
      {action}
    </div>
  );
};

export default PageSubHeader;
