import React, { useContext } from "react";
import { MainContext } from "./MainContext";
import { useLocation } from "react-router-dom";

export default function LoginButton(props) {
  const { betsLength } = useContext(MainContext);
  const location = useLocation();
  if (!props.token) {
    return (
      <div
        className="login-and-account-btn"
        id="login-btn"
        onClick={props.handleLoginFormVisibility}
      >
        Login
      </div>
    );
  } else {
    return (
      <div
        id="account-and-login-wrapper"
        style={
          location.pathname === "/calculator"
            ? { position: "absolute" }
            : { position: "fixed" }
        }
      >
        <p id="account-email">{localStorage.getItem("user")}</p>
        <div
          className="login-and-account-btn"
          id="account-btn"
          onClick={props.handleLoginFormVisibility}
        >
          My account
          <div
            id="bets-number"
            style={
              betsLength < 1 || props.loginFormVisibility
                ? { visibility: "hidden" }
                : {}
            }
          >
            {betsLength}
          </div>
        </div>
      </div>
    );
  }
}
