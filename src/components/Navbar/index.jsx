import React from "react";

import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

import styles from "./styles.module.scss";
import Wallets from "../Wallets/Wallets";

import icon from "../../assets/icon.png";
import TokenBalance from "../TokenBalance";

export default function Navbar({ width, toggleDrawer, visible }) {
  const Icon = visible ? CloseOutlined : MenuOutlined;

  return (
    <div className={styles.navbar}>
      <div>
        {width <= 768 && (
          <>
            <img src={icon} alt="bloinx-icon" />
            <Icon className={styles.menuIcon} onClick={toggleDrawer} />
          </>
        )}
      </div>
      <TokenBalance />
      <Wallets />
    </div>
  );
}
