/* eslint-disable no-unused-vars */
import React from "react";

import styles from "./styles.module.scss";

function InputCheck({ name, onChange, checked, label }) {
  return (
    <div className={styles.InputCheck}>
      <input
        type="checkbox"
        name={name}
        onChange={onChange}
        checked={checked}
      />
      <span>{label}</span>
    </div>
  );
}


export default React.memo(InputCheck);
