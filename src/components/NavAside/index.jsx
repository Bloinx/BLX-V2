/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import classnames from "classnames";
import { Menu, Layout } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import {
  DesktopOutlined,
  HomeFilled,
  // FileOutlined,
  StarOutlined,
  LogoutOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

// import LogOut from "../../api/setLogoutSupabase";
import { useAuth } from "../../context/AuthContext";
// import getUserScore from "../../api/getUserScore";

import styles from "./styles.module.scss";
import logo from "../../assets/bloinxLogo.png";
import icon from "../../assets/icon.png";
import { DrawerStyled } from "../styles";

const { Sider } = Layout;

function NavAside({ width, toggleDrawer, visible }) {
  const [sliderStatus, setSliderStatus] = useState(false);
  // const [score, setScore] = useState(0);
  const [selected, setSelected] = useState();
  const isTablet = width <= 800;
  const isMobile = width <= 768;
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  useEffect(() => {
    if (location.pathname === "/history") {
      setSelected("5");
    } else {
      setSelected("1");
    }
  }, []);

  useEffect(() => {
    if (isTablet && !sliderStatus) {
      setSliderStatus(true);
    }
    if (!isMobile) {
      toggleDrawer();
    }
  }, [width]);

  // useEffect(async () => {
  //   const result = await getUserScore("123");
  //   setScore(result);
  // }, []);

  const isVisible = (key) => {
    toggleDrawer();
    setSelected(key);
  };

  // const selected = 1;

  const logoutSession = () => {
    signOut();
    localStorage.removeItem("user_address");
    navigate("/login");
  };

  const MenuOptions = () => (
    <Menu
      className={styles.MenuOptions}
      defaultSelectedKeys={[selected]}
      mode="inline"
    >
      {!isMobile && (
        <div className={classnames(styles.logo, sliderStatus && styles.icon)}>
          <img src={sliderStatus ? icon : logo} alt="bloinx-logo" />
        </div>
      )}
      <Menu.Item key="0" className={styles.MenuItem} onClick={toggleDrawer}>
        <span>{user?.email ? user.email : ""}</span>
      </Menu.Item>
      <Menu.Item
        // key="4"
        className={styles.MenuItem}
        onClick={toggleDrawer}
        icon={<StarOutlined />}
      >
        {/* <span>Score: {score}</span> */}
      </Menu.Item>
      <Menu.Item
        className={classnames(
          styles.MenuItem,
          selected === "1" ? styles.MenuItemSelected : styles.MenuItemUnselect
        )}
        key="1"
        icon={<HomeFilled />}
        onClick={() => isVisible("1")}
      >
        <Link to="/dashboard">
          <span>
            <FormattedMessage id="navAside.dashboard" />
          </span>
        </Link>
      </Menu.Item>

      <Menu.Item
        className={classnames(
          styles.MenuItem,
          selected === "5" ? styles.MenuItemSelected : styles.MenuItemUnselect
        )}
        key="5"
        icon={<HistoryOutlined />}
        onClick={() => isVisible("5")}
      >
        <Link to="/history">
          <span>
            <FormattedMessage id="navAside.history" />
          </span>
        </Link>
      </Menu.Item>

      <Menu.Item
        className={classnames(
          styles.MenuItem,
          selected === "2" ? styles.MenuItemSelected : styles.MenuItemUnselect
        )}
        key="2"
        icon={<LogoutOutlined />}
        onClick={logoutSession}
      >
        <Link to="/logout">
          <span>
            <FormattedMessage id="navAside.logout" />
          </span>
        </Link>
      </Menu.Item>
      <Menu.Item
        className={classnames(
          styles.MenuItem,
          selected === "3" && styles.MenuItemSelected
        )}
        key="3"
        icon={<DesktopOutlined />}
        onClick={toggleDrawer}
      >
        <a target="_blank" href="https://docs.bloinx.io/" rel="noreferrer">
          <span>
            <FormattedMessage id="navAside.docs" />
          </span>
        </a>
      </Menu.Item>
      {/* <Menu.Item
        className={classnames(
          styles.MenuItem,
          selected === 3 && styles.MenuItemSelected,
        )}
        key={3}
        icon={<FileOutlined />}
        onClick={toggleDrawer}
      >
        <Link to="/degisterPay">
          <span>
            <FormattedMessage id="navAside.registerpay" />
          </span>
        </Link>
      </Menu.Item> */}
      {/* <Menu.Item
        className={classnames(
          styles.MenuItem,
          selected === 4 && styles.MenuItemSelected,
        )}
        key={4}
        icon={<FileOutlined />}
        onClick={toggleDrawer}
      >
        <Link to="/BatchDetails">
          <span>
            <FormattedMessage id="navAside.batchDetails" />
          </span>
        </Link>
      </Menu.Item> */}
    </Menu>
  );

  return (
    <>
      {!isMobile && (
        <Sider
          collapsible={!isTablet}
          collapsed={sliderStatus}
          onCollapse={setSliderStatus}
          className={styles.NavAside}
        >
          <MenuOptions />
        </Sider>
      )}
      {isMobile && (
        <DrawerStyled
          title={
            <div className={styles.logoMobile}>
              <img src={logo} alt="bloinx-logo" />
            </div>
          }
          placement="left"
          closable
          onClose={toggleDrawer}
          open={visible}
          body={{
            padding: 0,
          }}
          drawer={{
            backgroundColor: "#2B2D33",
          }}
          header={{
            backgroundColor: "#2B2D33",
            borderBottom: "0px",
            color: "white",
            padding: "0px",
          }}
        >
          <MenuOptions />
        </DrawerStyled>
      )}
    </>
  );
}

export default NavAside;
