import React from "react";
import { ConfigProvider } from "antd";
import { createRoot } from "react-dom/client"; // Updated import statement
import { IntlProvider } from "react-intl";
import { BrowserRouter } from "react-router-dom";

import flattenMessages from "./utils/locales";
import es from "./locales/es.json";
import en from "./locales/en.json";
import App from "./App";

// import MainProvider from "./providers/provider";

const locale = window.navigator.language.split("-")[0];
const defaultLocale = "en";

const languages = { en, es };
const messages = languages[locale] || languages[defaultLocale];
const actualLocale =
  locale === "en" || locale === "es" ? locale : defaultLocale;

const container = document.getElementById("root"); // Ensure 'root' is the correct container ID
const root = createRoot(container); // Create a root

root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#f58f98",
        },
      }}
    >
      <IntlProvider
        messages={flattenMessages(messages)}
        locale={actualLocale}
        // defaultLocale={defaultLocale}  // Uncomment if needed
      >
        <BrowserRouter>
          {/* <MainProvider> */}
          <App />
          {/* </MainProvider> */}
        </BrowserRouter>
      </IntlProvider>
    </ConfigProvider>
  </React.StrictMode>
);
