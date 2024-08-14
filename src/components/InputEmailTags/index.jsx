/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Typography, Input, Tag } from "antd";

import { validateEmail } from "../../utils/format";
import styles from "./styles.module.scss";

const { Text } = Typography;

export default function InputEmailTags({
  label,
  name,
  value = [],
  onChangeValue,
  placeholder,
}) {
  const [inputValue, setInputValue] = useState(null);
  const [tags, setTags] = useState(value);
  const [error, setError] = useState(null);

  useEffect(() => {
    onChangeValue({ target: { value: tags, name } });
  }, [tags]);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [inputValue]);

  useEffect(() => {
    setTags(value);
  }, [value]);

  const handleAddTag = (event) => {
    const { charCode, target } = event;
    const isValidEmail = validateEmail(target.value);

    if (charCode === 13 && isValidEmail) {
      setTags([...tags, target.value.trim()]);
      setInputValue(null);
    }

    if (charCode === 13 && !isValidEmail) {
      setError("Ingresa un email valido.");
    }
  };

  const handleInputValue = (event) => setInputValue(event.target.value);

  const handleOnClose = (element) => {
    const newTags = tags;
    newTags.splice(element, 1);
    setTags([...newTags]);
  };

  return (
    <div className={styles.InputEmailTags}>
      <Text className={styles.TextFieldLabel}>{label}</Text>
      <div className={styles.tagSection}>
        {tags.map((item, index) => (
          <Tag closable key={item} onClose={() => handleOnClose(index)}>
            {item}
          </Tag>
        ))}
      </div>
      <Input
        onKeyPress={handleAddTag}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputValue}
      />
      <Text>{error}</Text>
    </div>
  );
}
