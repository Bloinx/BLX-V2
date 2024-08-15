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
const RegisterUser = lazy(() => import("./containers/RegisterUser/index"));
const RegisterUserForm = lazy(() => import("./containers/RegisterUser/Form"));
const RoundDetails = lazy(() => import("./containers/RoundDetails/index"));
const Invitations = lazy(() => import("./containers/Invitations/index"));
const PaymentDetails = lazy(() => import("./containers/PaymentDetails/index"));
const History = lazy(() => import("./containers/History"));
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
      { index: true, element: <Navigate to="login" /> },
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
        path: "register-user",
        element: (
          <Markup>
            <ProtectedRoute element={<RegisterUser />} />
          </Markup>
        ),
      },
      {
        path: "register-user/join",
        element: (
          <Markup>
            <ProtectedRoute element={<RegisterUserForm />} />
          </Markup>
        ),
      },
      {
        path: "round-details",
        element: (
          <Markup>
            <ProtectedRoute element={<RoundDetails />} />
          </Markup>
        ),
      },
      {
        path: "invitations",
        element: (
          <Markup>
            <ProtectedRoute element={<Invitations />} />
          </Markup>
        ),
      },
      {
        path: "payment",
        element: (
          <Markup>
            <ProtectedRoute element={<PaymentDetails />} />
          </Markup>
        ),
      },
      {
        path: "history",
        element: (
          <Markup>
            <ProtectedRoute element={<History />} />
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
