import React from "react";
import { Typography, Slider } from "antd";

import styles from "./styles.module.scss";
import { SliderStyled } from "../styles";

const { Text } = Typography;

export default function InputSlider({
  label,
  value = 0,
  onChange,
  min,
  max,
  name,
  step,
}) {
  const handleOnChange = (arg) => onChange({ target: { value: arg, name } });

  return (
    <div className={styles.InputSlider}>
      <Text className={styles.Label}>{label}</Text>
      <SliderStyled
        onChange={handleOnChange}
        value={value}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
