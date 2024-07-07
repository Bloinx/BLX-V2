/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import Login from "./containers/Login";
import Logout from "./containers/Logout";
import SignUp from "./containers/Signup";
import Markup from "./containers/Markup";
import Dashboard from "./containers/Dashboard";
// import History from "./containers/History";
// import CreateBatch from "./containers/CreateBatch";

// import RegisterPay from "./containers/RegisterPay"; YA ESTABA COMENTADO

// import RegisterUser from "./containers/RegisterUser";
// import RoundDetails from "./containers/RoundDetails";
// import Invitations from "./containers/Invitations";
// import { ProvideRound } from "./contexts/RoundsContext";
import "./App.scss";
// import { ProvideAuth } from "./hooks/useAuth"; //MIGRANDO....
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";

import ForgotPass from "./containers/ForgotPass";
import UpdatePass from "./containers/UpdatePass";
// import Payment from "./containers/PaymentDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
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
      <AuthProvider>
        <WalletProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgotpass" element={<ForgotPass />} />
            <Route path="/update-password" element={<UpdatePass />} />

            <Route
              path="/dashboard"
              element={
                <Markup>
                  <ProtectedRoute element={<Dashboard />} />
                </Markup>
              }
            />

            {/* <ProvideRound> */}
            {/* <ProtectedRoute exact path="/dashboard" component={Dashboard} /> */}
            {/* <ProtectedRoute exact path="/history" component={History} />
              <ProtectedRoute path="/create-round" component={CreateBatch} />
              <ProtectedRoute path="/invitations" component={Invitations} />
              <ProtectedRoute path="/register-user" component={RegisterUser} />
              <ProtectedRoute path="/round-details" component={RoundDetails} />
              <ProtectedRoute path="/payment" component={Payment} /> */}
            {/* </ProvideRound> */}

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </WalletProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
