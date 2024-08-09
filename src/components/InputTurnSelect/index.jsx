/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
import React from "react";
import { Typography, Radio } from "antd";

import styles from "./styles.module.scss";

const { Text } = Typography;

export default function InputTurnSelect({
  label,
  value,
  options,
  onChange,
  name,
}) {
  return (
    <span className={styles.InputTurnSelect}>
      <Text className={styles.InputTurnSelectLabel}>{label}</Text>
      <fieldset
        id={name}
        className={styles.InputTurnSelectOptions}
        onChange={onChange}
      >
        {options.map((option) => {
          const checked = value.toString() === option.value.toString();
          return (
            <div>
              <span className={checked && styles.inputChecked} />
              <input
                type="radio"
                id={option.label}
                name={name}
                value={option.value.toString()}
                checked={checked}
              />
              <label
                htmlFor={option.label}
                className={checked && styles.inputLabel}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </fieldset>
    </span>
  );
}
