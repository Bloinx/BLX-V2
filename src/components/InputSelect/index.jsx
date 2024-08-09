import React from "react";
import { Typography, Select } from "antd";
import styles from "./styles.module.scss";

const { Option } = Select;
const { Text } = Typography;

export default function InputSelect({
  label,
  options = [],
  value,
  onChange,
  name,
  placeholder,
  disabled,
}) {
  const handleOnChange = (arg) => onChange({ target: { value: arg, name } });

  return (
    <div className={styles.InputSelect}>
      <Text className={styles.InputSelectLabel}>{label}</Text>
      <Select
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
      >
        {options.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
