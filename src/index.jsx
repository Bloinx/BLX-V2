import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client"; // Updated import statement
import "antd/dist/reset.css";
import "antd-css-utilities/utility.min.css";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import "./theme.scss";
import router from "./router";
import Defaultloader from "./components/DefaultLoader";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(
    <Suspense fallback={<Defaultloader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
