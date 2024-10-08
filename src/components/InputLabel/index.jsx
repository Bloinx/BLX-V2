/* eslint-disable react/prop-types */
import React from "react";

import styles from "./index.module.scss";

export default function InputLabel({ value, label }) {
  const stageLabels = {
    ON_REGISTER_STAGE: "Registro",
    ON_ROUND_ACTIVE: "En Progreso",
    ON_ROUND_FINISHED: "Finalizada",
    ON_EMERGENCY_STAGE: "Sin Fondos",
  };

  return (
    <div className={styles.InputLabel}>
      <div className={styles.InputLabelLabel}>{label}</div>
      <div className={styles.InputLabelValue}>
        {!stageLabels[value] ? value : stageLabels[value]}
      </div>
    </div>
  );
}
