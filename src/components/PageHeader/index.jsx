import React from "react";
import { Typography } from "antd";

import styles from "./styles.module.scss";

const { Title } = Typography;

const PageHeader = ({ title, action }) => {
  return (
    <div className={styles.PageHeader}>
      <Title level={4} className={styles.dashboardTitle}>
        {title}
      </Title>
      {action}
    </div>
  );
};

export default PageHeader;
