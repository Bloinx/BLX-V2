import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load your components
const Login = lazy(() => import("./containers/Login/Login"));
const Logout = lazy(() => import("./containers/Logout"));
const SignUp = lazy(() => import("./containers/Signup"));
const ForgotPass = lazy(() => import("./containers/ForgotPass"));
const UpdatePass = lazy(() => import("./containers/UpdatePass"));
const Dashboard = lazy(() => import("./containers/Dashboard"));
const CreateBatch = lazy(() => import("./containers/CreateBatch/index"));
const CreateBatchReceipt = lazy(
  () => import("./containers/CreateBatch/CreateBatchReceipt")
);
const Markup = lazy(() => import("./containers/Markup"));
// const NotFound = lazy(() => import("./containers/NotFound")); // Optional: add a NotFound component
const BaseLayoutTemplate = lazy(
  () => import("./components/templates/BaseLayoutTemplate")
);

// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <BaseLayoutTemplate>
        <Outlet />
      </BaseLayoutTemplate>
    ),
    children: [
      { path: "login", element: <Login /> },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "forgotpass",
        element: <ForgotPass />,
      },
      {
        path: "update-password",
        element: <UpdatePass />,
      },
      {
        path: "dashboard",
        element: (
          <Markup>
            <ProtectedRoute element={<Dashboard />} />
          </Markup>
        ),
      },
      {
        path: "create-round",
        element: (
          <Markup>
            <ProtectedRoute element={<CreateBatch />} />
          </Markup>
        ),
      },
      {
        path: "create-round/confirm",
        element: (
          <Markup>
            <ProtectedRoute element={<CreateBatchReceipt />} />
          </Markup>
        ),
      },
      {
        path: "*",
        element: <Navigate to="login" />,
      },
    ],
  },
]);

export default router;
