/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { ButtonAction, LinkStyled } from "../../components/styles";

import logo from "../../assets/bloinxLogo.png";
import { validateEmail, validatePassword } from "./vlidators";
import styles from "./index.module.scss";
import { useAuth } from "../../context/AuthContext";
// import useLocalStorage from "../../hooks/useLocalStorage";

const errors = {
  "auth/user-not-found": "El usuario no existe.",
};

function Login() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  const { session, loading, error, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const intl = useIntl();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailError && !passwordError) {
      try {
        await login(email, password);
      } catch (loginError) {
        console.log(loginError);
      }
    }
  };

  const handlePasswordChange = (e) => {
    const {
      target: { value },
    } = e;
    const validationpasswordError = validatePassword(value, intl);
    setPasswordError(validationpasswordError !== null);
    setIsDisabled(validationpasswordError !== null);
    if (validationpasswordError) {
      setPasswordErrorMessage(validationpasswordError);
    }
    setPassword(value);
  };
  const handleEmailChange = (e) => {
    const {
      target: { value },
    } = e;
    const validationError = validateEmail(value, intl);
    setEmailError(validationError !== null);
    setIsDisabled(validationError !== null);
    if (validationError) {
      setEmailErrorMessage(validationError);
    }
    setEmail(value);
  };
  useEffect(() => {
    if (email.length !== 0 && password.length !== 0) {
      isDisabled(true);
    }
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session, navigate]);
  return (
    <div className={styles.Login}>
      <div className={styles.Login_Card}>
        <div className={styles.Login_Card_Content}>
          <div className={styles.Login_Card_Content_Header}>
            <img src={logo} alt="logo" className={styles.Login_Icon} />
            <span className={styles.Login_Title}>
              {" "}
              <FormattedMessage id="login.title" />
            </span>
          </div>
          <form className={styles.Login_Card_Content_Form}>
            <span>
              {" "}
              <FormattedMessage id="login.form.label.email" />
            </span>
            <input
              className={styles.Login_Input}
              name="user"
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
            />
            <span className={styles.error}>
              {emailError ? emailErrorMessage : ""}
            </span>
            <span>
              {" "}
              <FormattedMessage id="login.form.label.password" />
            </span>
            <input
              className={styles.Login_Input}
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
            />
            <span className={styles.error}>
              {passwordError ? passwordErrorMessage : ""}
            </span>
          </form>
          <span className={styles.Login_Card_Content_forgotPass}>
            <Link to="/forgotpass">
              <FormattedMessage id="login.actions.forgotPassword" />
            </Link>
          </span>
          <div className={styles.Login_Card_Content_Actions}>
            <span className={styles.error}>{error ? errorMessage : ""}</span>
            <ButtonAction
              loading={loading}
              type="primary"
              disabled={isDisabled}
              onClick={(e) => handleLogin(e)}
            >
              <FormattedMessage id="login.actions.login" />
            </ButtonAction>
          </div>
        </div>
        <div className={styles.Login_Card_Options}>
          <div>
            <FormattedMessage id="login.subtitle" />
          </div>
          <div>
            <LinkStyled to="/signup">
              <FormattedMessage id="login.actions.register" />
            </LinkStyled>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
