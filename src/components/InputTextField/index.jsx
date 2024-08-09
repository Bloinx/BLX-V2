/* eslint-disable no-undef */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-unused-vars */
import React from "react";
import { Typography } from "antd";

import styles from "./styles.module.scss";

const { Text } = Typography;

export default function InputTextField({ label, name, value, onChange, placeholder, error }) {
  return (
    <div className={styles.TextField}>
      <Text className={styles.TextFieldLabel}>{label}</Text>
      <input
        id={name}
        key={name}
        className={styles.TextFieldInput}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
      />
      {error && <span className={styles.TextFieldError}>{error}</span>}
    </div>
  );
}

