import React from "react";
import { ConfigProvider } from "antd";
import { AuthProvider } from "../../context/AuthContext";
import { WalletProvider } from "../../context/WalletContext";
import { Web3ModalProvider } from "../../context/Web3ModalProvider";

import { IntlProvider } from "react-intl";

import flattenMessages from "../../utils/locales";
import es from "../../locales/es.json";
import en from "../../locales/en.json";

// import MainProvider from "./providers/provider";

const locale = window.navigator.language.split("-")[0];
const defaultLocale = "en";

const languages = { en, es };
const messages = languages[locale] || languages[defaultLocale];
const actualLocale =
  locale === "en" || locale === "es" ? locale : defaultLocale;

const BaseLayoutTemplate = ({ children }) => (
  <ConfigProvider
    theme={{
      token: {
        colorSuccess: "#F58F98",
        colorPrimary: "#F58F98",
        colorLink: "#F58F98",
        fontFamily: "Open Sans",
      },
    }}
  >
    <IntlProvider
      messages={flattenMessages(messages)}
      locale={actualLocale}
      // defaultLocale={defaultLocale}  // Uncomment if needed
    >
      <AuthProvider>
        <Web3ModalProvider>
          <WalletProvider>{children}</WalletProvider>
        </Web3ModalProvider>
      </AuthProvider>
    </IntlProvider>
  </ConfigProvider>
);

export default BaseLayoutTemplate;
