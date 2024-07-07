import React from "react";
import classNames from "classnames";

import styles from "./index.module.scss";

export default function Stepper({ steps, current, turnWithDraw }) {
  return (
    <div className={styles.StepperContainer}>
      {steps.map((step, index) => {
        const actualStep = Number(current) === index + 1;
        const withDraw = turnWithDraw === index + 1;
        return (
          <div key={step.label} className={styles.StepperItem}>
            <div className={styles.StepperPosition}>
              {withDraw && <span className={styles.StepperPositionImage} />}
            </div>
            <span
              className={classNames(
                styles.StepperIcon,
                actualStep && styles.StepperIconActive
              )}
            />
            <span
              className={classNames(
                styles.StepperLabel,
                actualStep && styles.StepperLabelActive
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
